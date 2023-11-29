import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePathCourses = "../courses.csv";
const filePathPlanners = "../planners/";

export function getPlanners() {
  const planners = [
    "planners_2020-2021.json",
    "planners_2021-2022.json",
    "planners_2022-2023.json",
    "planners_2023-2024.json",
  ];

  const plannerData: any = {};
  planners.forEach((p) => {
    fs.readFile(filePathPlanners + p, "utf-8", (err, data) => {
      if (err) {
        console.error("An error occurred:", err);
        return;
      }
      plannerData[p.split("_")[1].replace(".json", "")] = JSON.parse(data);
    });
  });

  return plannerData;
}

export function getCourses() {
  const csvFilePath = path.resolve(__dirname, filePathCourses);

  return new Promise<
    {
      department: string;
      departmentCode: string;
      number: string;
      title: string;
      credits: number;
      prerequisites: string;
      ge: string[];
      quartersOffered: string[];
    }[]
  >((resolve, reject) => {
    const courses: {
      department: string;
      departmentCode: string;
      number: string;
      title: string;
      credits: number;
      prerequisites: string;
      ge: string[];
      quartersOffered: string[];
    }[] = [];
    fs.createReadStream(csvFilePath)
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .pipe(parse({ delimiter: "," }))
      .on("data", (record) => {
        const course = {
          department: record[0] || "no department",
          departmentCode: record[1] || "no department code",
          number: record[2] || "no number",
          title: record[3] || "no name",
          credits: parseInt(record[4]) || 5,
          prerequisites: record[5] || "no prerequisites",
          ge: record[6] ? record[6].split(",") : ["None"],
          quartersOffered: record[7] ? record[7].split(",") : [],
        };

        courses.push(course);
      })
      .on("end", () => {
        console.log("done");
        resolve(courses);
      });
  });
}
