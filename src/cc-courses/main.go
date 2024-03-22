package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"

	"golang.org/x/exp/maps"
)

func main() {
	runPipeline()
}

type InitialData struct {
	SchoolId    int            `json:"ucsc_id"`
	YearId      int            `json:"current_year"`
	Departments map[string]int `json:"departments"`
}

func loadInitialData() (InitialData, error) {
	file, err := os.Open("assist-data.json")
	if err != nil {
		return InitialData{}, err
	}
	defer file.Close()

	var data InitialData
	if err = json.NewDecoder(file).Decode(&data); err != nil {
		return InitialData{}, err
	}

	return data, nil
}

type Institution struct {
	Name string
	Id   int
}

func getInstitutions() ([]Institution, error) {
	type OriginalData struct {
		Id    int `json:"id"`
		Names []struct {
			Name string `json:"name"`
		} `json:"names"`
	}

	res, err := http.Get("https://assist.org/api/institutions")
	if err != nil {
		return nil, err
	}
	data, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}
	var od []OriginalData
	err = json.Unmarshal(data, &od)
	if err != nil {
		return nil, err
	}

	institutions := make([]Institution, 0)
	for _, inst := range od {
		institutions = append(institutions, Institution{
			Name: inst.Names[0].Name,
			Id:   inst.Id,
		})
	}

	return institutions, nil
}

type Course struct {
	DeptCode        string `json:"deptCode"`
	CourseNumber    string `json:"courseNumber"`
	Name            string `json:"name"`
	InstitutionName string `json:"institution"`
}

func getTransferEquivalents(departmentId int, insts []Institution, initialData InitialData) (map[string][]Course, error) {

	transferCourses := make(map[string][]Course)

	for _, inst := range insts {
		log.Println(inst.Name)
		res, err := http.Get(fmt.Sprintf("https://assist.org/api/articulation/Agreements?Key=%d/%d/to/%d/Department/%d", initialData.YearId, inst.Id, initialData.SchoolId, departmentId))
		if err != nil || res.StatusCode != http.StatusOK {
			continue
		}

		bytes, err := io.ReadAll(res.Body)
		if err != nil {
			return nil, err
		}
		newStr := strings.ReplaceAll(strings.ReplaceAll(strings.ReplaceAll(strings.ReplaceAll(strings.ReplaceAll(string(bytes), `\"`, `"`), `"{`, "{"), `}"`, "}"), `"[`, "["), `]"`, "]")

		// log.Println(newStr)

		type Articulation struct {
			Result struct {
				Articulations []struct {
					Type   string `json:"type"`
					Course struct {
						Prefix       string `json:"prefix"`
						CourseNumber string `json:"courseNumber"`
					} `json:"course"`
					SendingArticulations struct {
						Items []struct {
							Items []struct {
								Type         string `json:"type"`
								Prefix       string `json:"prefix"`
								CourseNumber string `json:"courseNumber"`
								CourseTitle  string `json:"courseTitle"`
							} `json:"items"`
						} `json:"items"`
					} `json:"sendingArticulation"`
				} `json:"articulations"`
			} `json:"result"`
		}
		var iv Articulation
		err = json.Unmarshal([]byte(newStr), &iv)
		if err != nil {
			log.Println("couldn't unmarshal", inst.Name)
			continue
		}

		for _, art := range iv.Result.Articulations {
			if art.Type != "Course" {
				continue
			}
			ucscCourse := art.Course.Prefix + " " + art.Course.CourseNumber
			items := art.SendingArticulations.Items
			if len(items) == 0 {
				continue
			}
			for _, equiv := range items[0].Items {
				if equiv.Type != "Course" {
					continue
				}
				fmt.Println(ucscCourse)
				transferCourses[ucscCourse] = append(transferCourses[ucscCourse], Course{
					DeptCode:        equiv.Prefix,
					CourseNumber:    equiv.CourseNumber,
					InstitutionName: inst.Name,
				})
			}
		}
	}
	return transferCourses, nil
}

func getAllTransferEquivalents(ch chan<- map[string][]Course, initData InitialData, insts []Institution) {
	var wg sync.WaitGroup
	wg.Add(len(initData.Departments))
	for _, deptId := range initData.Departments {
		go func() {
			defer wg.Done()
			res, err := getTransferEquivalents(deptId, insts, initData)
			if err != nil {
				return
			}
			ch <- res
		}()
	}
	wg.Wait()
	close(ch)
}

func writeTransfersToFile(transfers map[string][]Course) {
	jsonData, err := json.MarshalIndent(transfers, "", "  ")
	if err != nil {
		log.Fatal("couldn't marshal data")
	}
	file, err := os.Create("transfers.json")
	if err != nil {
		log.Fatal("couldn't create transfers.json")
	}
	defer file.Close()
	_, err = file.Write(jsonData)
	if err != nil {
		log.Fatal("couldn't write data to json file")
	}
}

func runPipeline() {
	initData, err := loadInitialData()
	if err != nil {
		log.Fatal(err)
	}
	insts, err := getInstitutions()
	if err != nil {
		log.Fatal(err)
	}
	ch := make(chan map[string][]Course, 1)

	go getAllTransferEquivalents(ch, initData, insts)

	transferCourses := make(map[string][]Course)

	for transfers := range ch {
		maps.Copy(transferCourses, transfers)
	}

	writeTransfersToFile(transferCourses)

}
