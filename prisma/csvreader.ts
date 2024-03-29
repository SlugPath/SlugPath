import { parse } from "csv-parse";
import * as fs from "fs";
import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePathCourses = "../courses.csv";
const filePathPlanners = "../planners/";

export async function getPlanners() {
  const planners = [
    "planners_2020-2021.json",
    "planners_2021-2022.json",
    "planners_2022-2023.json",
    "planners_2023-2024.json",
  ];

  const plannerData: any = {};

  for (const p of planners) {
    try {
      const data = await fs.promises.readFile(
        path.resolve(__dirname, filePathPlanners + p),
        "utf-8",
      );
      const parsedData = JSON.parse(data);
      const yearKey = p.split("_")[1].replace(".json", "");
      plannerData[yearKey] = parsedData;
    } catch (err) {
      console.error("An error occurred:", err);
    }
  }
  console.log(`✨ Done parsing planners ✨`);
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
      description: string;
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
      description: string;
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
          description: record[6] || "no description",
          ge: record[7] ? record[7].split(",") : ["None"],
          quartersOffered: record[8] ? record[8].split(",") : [],
        };

        courses.push(course);
      })
      .on("end", () => {
        console.log("✨ Done parsing courses ✨");
        resolve(courses);
      });
  });
}
