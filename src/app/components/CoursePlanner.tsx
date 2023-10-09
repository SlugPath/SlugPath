import { Card } from "@mui/joy";
import QuarterCard from "./QuarterCard";

const quarterNames = ["Fall", "Winter", "Spring"];
const yearNames = ["Freshman", "Sophomore", "Junior", "Senior"];

export function CoursePlanner() {
  function quarterComponents() {
    return (
      <div className="flex flex-row space-x-4">
        {quarterNames.map((quarter, index) => (
          <div key={index}>
            <QuarterCard title={quarter} />
          </div>
        ))}
      </div>
    );
  }

  function yearComponents() {
    return (
      <div className="flex flex-col space-y-2">
        {yearNames.map((year, index) => (
          <div key={index}>
            {year + " Year"}
            {quarterComponents()}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center space-between p-24 bg-gray-100 space-y-4">
      <Card className="flex flex-row">{yearComponents()}</Card>
    </div>
  );
}

export default CoursePlanner;
