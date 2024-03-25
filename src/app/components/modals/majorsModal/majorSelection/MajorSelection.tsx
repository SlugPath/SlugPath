import {
  useCatalogYears,
  useProgramTypeOfYear,
  useUpdateUserProgramsMutation,
  useUserPrograms,
} from "@/app/hooks/reactQuery";
import { Program } from "@/app/types/Program";
import { isProgramInPrograms } from "@/lib/utils";
import { Delete } from "@mui/icons-material";
import ReportIcon from "@mui/icons-material/Report";
import {
  Alert,
  Button,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Option,
  Select,
  Typography,
} from "@mui/joy";
import { ProgramType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";

import SelectCatalogYear from "./SelectCatalogYear";
import SelectMajorName from "./SelectMajorName";

export default function UserProgramsEditor() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Fetch all majors and minors for the user
  const { data: userPrograms, isPending: userProgramsIsLoading } =
    useUserPrograms(userId);

  // Iniitialize hook to save user majors and minors later
  const { mutate: savePrograms, isError: saveProgramsIsError } =
    useUpdateUserProgramsMutation();

  function handleRemoveProgram(programId: number) {
    const _programs = userPrograms
      ? userPrograms.filter((p) => p.id !== programId)
      : [];

    savePrograms({ userId: userId!, programs: _programs });
  }

  return (
    <div className="space-y-4 w-full">
      <Card variant="soft" size="sm">
        <Typography level="h4" textColor="inherit" fontWeight="lg" mb={1}>
          Your Majors and Minors
        </Typography>

        {saveProgramsIsError && (
          <Alert color="danger" startDecorator={<ReportIcon />}>
            Error saving major data. Please make sure you&apos;re logged in. You
            can skip this page if you don&apos;t have an account.
          </Alert>
        )}

        {userPrograms && userPrograms.length === 0 && (
          <Typography level="body-lg" color="neutral">
            You have not added any majors yet.
          </Typography>
        )}

        <div className="space-y-2">
          {userPrograms &&
            userPrograms.map((program) => {
              const isMajor = program.programType === ProgramType.Major;

              return (
                <Card key={program.name} size="sm" variant="plain">
                  <div className="flex justify-between items-center">
                    <Typography>
                      {program.name} {program.catalogYear}
                    </Typography>
                    <div className="flex space-x-2">
                      <Chip color={isMajor ? "success" : "primary"}>
                        {isMajor ? "Major" : "Minor"}
                      </Chip>
                      <IconButton
                        color="danger"
                        onClick={() => handleRemoveProgram(program.id)}
                      >
                        <Delete />
                      </IconButton>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
        <AddProgramInputs />
      </Card>

      {userProgramsIsLoading && <CircularProgress />}
    </div>
  );
}

// TODO: Refactor, fetch all programs and filter for majors and minors, then
// fetch years based on the selected program
function AddProgramInputs() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [programType, setProgramType] = useState<ProgramType>(
    ProgramType.Major,
  );
  const [catalogYear, setCatalogYear] = useState("");
  const [programName, setProgramName] = useState("");
  const [error, setError] = useState("");

  // Fetch all catalog years
  const { data: catalogYears } = useCatalogYears();

  // Fetch all majors and minors for the user
  const { data: userPrograms } = useUserPrograms(userId);

  // Fetch all programs from a major or minor in a specific catalog year
  const { data: filteredPrograms, isPending: filteredProgramsIsLoading } =
    useProgramTypeOfYear(programType, catalogYear);

  // Iniitialize hook to save user programs later
  const { mutate: savePrograms, isPending: saveProgramsIsLoading } =
    useUpdateUserProgramsMutation();

  // Add a major to the user's list of majors
  function handleAddMajor() {
    // Validate input and prevent adding duplicate majors
    const isValidInput =
      programName.length > 0 &&
      catalogYear.length > 0 &&
      programType in ProgramType;

    if (!isValidInput) {
      setError("Please select a major and catalog year");
      return;
    }

    const programToAdd: Program = {
      name: programName,
      catalogYear,
      programType,
      id: 0,
    };

    if (isProgramInPrograms(programToAdd, userPrograms ?? [])) {
      setError(
        "You have already added this major: " + programName + " " + catalogYear,
      );
      return;
    }

    // Clear input fields and error message
    setProgramName("");
    setCatalogYear("");
    setError("");

    // Save the new list of programs
    const _programs = [...(userPrograms ?? []), programToAdd];
    savePrograms({
      userId: userId!,
      programs: _programs,
    });
  }

  return (
    <>
      <div className="grid grid-cols-7 gap-2 items-end">
        <div className="col-span-2">
          <Typography level="body-lg">Program</Typography>
          <Select
            value={programType}
            placeholder="Choose one…"
            variant="plain"
            defaultValue={ProgramType.Major}
            onChange={(_, newValue) => newValue && setProgramType(newValue)}
          >
            {["Major", "Minor"].map((major, index) => (
              <Option key={index} value={major}>
                {major}
              </Option>
            ))}
          </Select>
        </div>
        <div className="col-span-2">
          <SelectCatalogYear
            catalogYear={catalogYear}
            years={catalogYears ?? []}
            onChange={(_, newValue) =>
              typeof newValue === "string" && setCatalogYear(newValue)
            }
          />
        </div>
        <div className="col-span-2">
          <SelectMajorName
            selectedMajor={programName}
            majors={filteredPrograms}
            onChange={(_, newValue) => newValue && setProgramName(newValue)}
          />
        </div>
        <div className="col-span-1">
          <Button variant="soft" onClick={handleAddMajor}>
            Add
          </Button>
        </div>
      </div>

      {(saveProgramsIsLoading || filteredProgramsIsLoading) && (
        <LinearProgress />
      )}

      {error.length > 0 && (
        <Alert color="danger" startDecorator={<ReportIcon />}>
          {error}
        </Alert>
      )}
    </>
  );
}
