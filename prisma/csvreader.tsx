import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePathCourses = "../courses.csv";

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
      ge: string;
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
      ge: string;
      quartersOffered: string[];
    }[] = [];
    fs.createReadStream(csvFilePath)
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .pipe(parse({}))
      .on("data", (r) => {
        const line: string = r[0];
        const splitArray = line.split(",");

        const course = {
          department: splitArray.length > 0 ? splitArray[0] : "no department",
          departmentCode:
            splitArray.length > 1 ? splitArray[1] : "no department code",
          number: splitArray.length > 2 ? splitArray[2] : "no number",
          title: splitArray.length > 3 ? splitArray[3] : "no name",
          credits: splitArray.length > 4 ? parseInt(splitArray[4]) : 5,
          prerequisites:
            splitArray.length > 5 ? splitArray[5] : "no prerequisites",
          ge: splitArray.length > 6 ? splitArray[6] : "None",
          quartersOffered: splitArray.length > 7 ? splitArray.slice(7) : [], // captures everything from the 7th element onwards
        };

        courses.push(course);
      })
      .on("end", () => {
        console.log("done");
        resolve(courses);
      });
  });
}
