import { Close, School } from "@mui/icons-material";
import { Tooltip } from "@mui/joy";

/**
 * Used to display a program chip when editing a user's majors or minors
 */
export default function ProgramChip({
  programName,
  catalogYear,
  deleteProgram,
}: {
  programName: string;
  catalogYear: string;
  deleteProgram: () => void;
}) {
  return (
    <div className="flex gap-2 items-center bg-white shadow-md w-full px-5 py-4 rounded-lg justify-between">
      <div className="flex flex-row gap-2 items-center min-w-0">
        <School sx={{ color: "#000", height: "2rem", marginRight: "0.5rem" }} />
        <Tooltip title={programName} placement="top">
          <p className="truncate">{programName}</p>
        </Tooltip>
        <p className="text-subtext min-w-fit">({catalogYear})</p>
      </div>
      <button className="ml-5" onClick={deleteProgram}>
        <Close sx={{ color: "#000", height: "2rem" }} />
      </button>
    </div>
  );
}
