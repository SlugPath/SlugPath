import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = "../cse.csv";

export default function getCourses() {
  const csvFilePath = path.resolve(__dirname, filePath);

  return new Promise<
    { department: string; number: string; name: string; credits: number; quartersOffered: string[]; }[]
  >((resolve, reject) => {
    const courses: {
      department: string;
      number: string;
      name: string;
      credits: number;
      quartersOffered: string[];
    }[] = [];
    fs.createReadStream(csvFilePath)
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .pipe(parse({ delimiter: "\t" }))  
      .on("data", (r) => {
        const line: string = r[0];
        const splitArray = line.split(",");

        const course = {
          department: splitArray.length > 0 ? splitArray[0] : "no department",
          number: splitArray.length > 1 ? splitArray[1] : "no number",
          name: splitArray.length > 2 ? splitArray[2] : "no name",
          credits: splitArray.length > 3 ? parseInt(splitArray[3]) : 5,
          quartersOffered: splitArray.length > 4 ? splitArray.slice(4) : []  // captures everything from the 5th element onwards
        };

        courses.push(course);
      })
      .on("end", () => {
        console.log("done");
        resolve(courses);
      });
  });
}
