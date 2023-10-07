import { Button, Card } from "@mui/joy";

export default function QuarterCard({ title }: { title: string }) {
  const courses = ["CSE 12", "CSE 130", "PHIL 11"];

  return (
    <Card className="w-96">
      {title}
      {courses.map((task, index) => (
        <Card
          className="flex-row justify-between"
          key={index}
          color="primary"
        >
          {task}
          <Button color="primary" variant="outlined">
            X
          </Button>
        </Card>
      ))}
    </Card>
  );
}
