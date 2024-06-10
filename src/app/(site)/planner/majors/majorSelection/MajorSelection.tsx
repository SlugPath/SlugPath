import { Program } from "@/app/types/Program";
import { isProgramInPrograms } from "@/lib/utils";
import {
  useCatalogYears,
  useProgramTypeOfYear,
  useUpdateUserProgramsMutation,
  useUserPrograms,
} from "@hooks/reactQuery";
import { Delete } from "@mui/icons-material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ReportIcon from "@mui/icons-material/Report";
import {
  Alert,
  Button,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  Modal,
  Option,
  Select,
  Sheet,
  Typography,
  useColorScheme,
} from "@mui/joy";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ProgramType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import SelectCatalogYear from "./SelectCatalogYear";
import SelectMajorName from "./SelectMajorName";

export default function UserProgramsEditor() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();

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

  const [openModal, setOpenModal] = useState(false);
  const isMobileView = useMediaQuery("(max-width: 800px)");
  const { mode } = useColorScheme();
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="space-y-4 w-full">
      <Card variant="soft" size="sm">
        <div
          className={`flex flex-row ${
            isMobileView ? "justify-between" : "justify-start"
          } items-center`}
        >
          <div className="font-semibold text-xl">Your Majors and Minors</div>
          <Button
            variant="plain"
            onClick={() => router.push("/planner")}
            startDecorator={<KeyboardArrowLeftIcon fontSize="large" />}
            sx={{ width: "fit-content" }}
          >
            {isMobileView ? "Back" : "Back to Planner"}
          </Button>
        </div>

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
                    {isMobileView ? (
                      <div className="flex flex-col flex-row">
                        <Typography>{program.name}</Typography>
                        <Typography>{program.catalogYear}</Typography>
                      </div>
                    ) : (
                      <Typography>
                        {program.name} {program.catalogYear}
                      </Typography>
                    )}
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
        {!isMobileView ? (
          <AddProgramInputs />
        ) : (
          <div className="bg-blue-500 hover:bg-blue-600 rounded">
            <Button variant="solid" onClick={handleOpenModal} fullWidth>
              Add Program
            </Button>
            <Modal
              open={openModal}
              onClose={() => setOpenModal(false)}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Sheet
                sx={{
                  borderRadius: "md",
                  p: 3,
                  boxShadow: "lg",
                  width: "80%",
                  margin: "auto",
                  backgroundColor: mode === "light" ? "#f1f5f9" : "#181a1c",
                }}
              >
                <Typography
                  component="h2"
                  id="modal-title"
                  level="h4"
                  textColor="inherit"
                  fontWeight="lg"
                  mb={1}
                  sx={{ textAlign: "center" }}
                >
                  Add Program
                </Typography>
                <AddProgramInputs closeAddProgramModal={handleCloseModal} />
              </Sheet>
            </Modal>
          </div>
        )}
      </Card>

      {userProgramsIsLoading && <CircularProgress />}
    </div>
  );
}

// TODO: Refactor, fetch all programs and filter for majors and minors, then
// fetch years based on the selected program
function AddProgramInputs({ closeAddProgramModal = () => {} }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [programType, setProgramType] = useState<ProgramType>(
    ProgramType.Major,
  );
  const [catalogYear, setCatalogYear] = useState("");
  const [programName, setProgramName] = useState("");
  const [error, setError] = useState("");

  const isMobileView = useMediaQuery("(max-width: 800px) ");

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
      console.error(
        `Invalid input provided: ${programName}, ${catalogYear}, ${programType}`,
      );
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
    closeAddProgramModal();
  }

  return (
    <>
      <div
        className={`grid grid-cols-1 gap-2 items-end ${
          isMobileView ? "" : "grid-cols-7 gap-2"
        }`}
      >
        <div className={` ${isMobileView ? "" : "col-span-2"}`}>
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
        <div className={` ${isMobileView ? "" : "col-span-2"}`}>
          <SelectCatalogYear
            catalogYear={catalogYear}
            years={catalogYears ?? []}
            onChange={(_, newValue) =>
              typeof newValue === "string" && setCatalogYear(newValue)
            }
          />
        </div>
        <div className={` ${isMobileView ? "" : "col-span-2"}`}>
          <SelectMajorName
            selectedMajor={programName}
            majors={filteredPrograms}
            onChange={(_, newValue) => newValue && setProgramName(newValue)}
          />
        </div>
        <div
          className={` ${isMobileView ? "col-span-1 flex justify-center" : ""}`}
        >
          <Button
            onClick={handleAddMajor}
            variant="soft"
            className={
              isMobileView ? "bg-blue-500 hover:bg-blue-600 rounded w-1/2" : ""
            }
          >
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
