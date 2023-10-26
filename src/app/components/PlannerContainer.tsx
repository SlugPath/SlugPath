import { useState } from "react";
import { Button } from "@mui/joy";
import CoursePlanner from "./CoursePlanner";

export default function PlannerContainer() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [plannerTitles, setPlannerTitles] = useState<string[]>([
    "My First Planner",
    "My Second Planner",
  ]);

  const handleClick = () => {
    setActiveIdx((activeIdx + 1) % 2);
    setPlannerTitles(plannerTitles);
  };

  return (
    <div>
      <div className="p-10">
        <Button onClick={handleClick}>Fat Button</Button>
      </div>
      {plannerTitles.map((title, idx) => (
        <CoursePlanner key={idx} title={title} isActive={idx == activeIdx} />
      ))}
    </div>
  );
}
