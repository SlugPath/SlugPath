import { Button, Avatar } from "@mui/joy";

export default function Navbar({
  setShowMajorCompletionModal,
}: {
  setShowMajorCompletionModal: any;
}) {
  return (
    <header className="bg-white fixed top-0 w-full shadow-md z-50">
      <nav className="container mx-auto py-3">
        <div className="flex justify-between items-center">
          <a href="#" className="text-2xl font-bold text-gray-800">
            UCSC Course Planner
          </a>
          <div className="flex space-x-4">
            <Button variant="plain">Export Planner</Button>
            <Button onClick={setShowMajorCompletionModal} variant="plain">
              Major Progress
            </Button>
            <Avatar />
          </div>
        </div>
      </nav>
    </header>
  );
}
