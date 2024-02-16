import { getAllMajorsBy } from "@/app/actions/major";
import { Major } from "@/app/types/Major";
import { years } from "@/lib/defaultPlanners";
import { DefaultPlannerContext } from "@contexts/DefaultPlannerProvider";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";

import SelectCatalogYear from "./SelectCatalogYear";
import SelectMajorName from "./SelectMajorName";

export default function MajorSelection() {
  const queryClient = useQueryClient();
  const { setMajorToAdd } = useContext(DefaultPlannerContext);

  const [selectedMajors, setSelectedMajors] = useState<Major[]>([]);
  const [programType, setProgramType] = useState<ProgramType>(
    ProgramType.Major,
  );
  const [majorName, setMajorName] = useState("");
  const [catalogYear, setCatalogYear] = useState("");

  const [error, setError] = useState("");

  const { data: majors } = useQuery({
    queryKey: ["majors", catalogYear, programType],
    queryFn: async () => {
      return await getAllMajorsBy(programType, catalogYear);
    },
    enabled: catalogYear !== "" && programType in ProgramType,
  });

  // getting userMajors from a context so that they load properly
  const {
    userMajors,
    userMajorsIsLoading,
    saveMajors,
    loadingSaveMajor,
    errorSavingMajor,
  } = useContext(DefaultPlannerContext);

  useEffect(() => {
    setSelectedMajors(userMajors);
  }, [userMajors]);

  // when searching for a major, setMajorToAdd so defaultPlannerSelection can display
  // default planners for this major
  useEffect(() => {
    if (programType in ProgramType && catalogYear.length > 0 && majorName.length > 0) {
      setMajorToAdd({
        name: majorName,
        catalogYear,
        programType,
        id: 0,
      });
    }
  }, [programType, catalogYear, majorName]);

  function handleChangeProgramType(
    event: React.SyntheticEvent | null,
    newValue: ProgramType,
  ) {
    if (newValue != null) {
      queryClient.invalidateQueries({
        queryKey: ["majors", catalogYear, programType],
      });
      setProgramType(newValue);
    }
  }

  function handleChangeMajorName(
    event: React.SyntheticEvent | null,
    newValue: string | null,
  ) {
    if (newValue != null) {
      setMajorName(newValue);
    }
  }

  function handleChangeCatalogYear(
    event: React.SyntheticEvent | null,
    newCatalogYear: string | null,
  ) {
    if (typeof newCatalogYear === "string") {
      setCatalogYear(newCatalogYear);
    }
  }

  function selectionIsValid(): boolean {
    return (
      majorName.length > 0 &&
      catalogYear.length > 0 &&
      programType in ProgramType
    );
  }

  function alreadyAddedMajor(major: Major): boolean {
    const alreadyAdded = selectedMajors.some((userMajor) => {
      if (
        userMajor.programType === major.programType &&
        userMajor.name === major.name &&
        userMajor.catalogYear === major.catalogYear
      ) {
        return true;
      }
    });

    return alreadyAdded;
  }

  function handleAddMajor() {
    const majorToAdd: Major = {
      name: majorName,
      catalogYear,
      programType,
      id: 0,
    };

    if (!selectionIsValid()) {
      setError("Please select a major and catalog year");
      return;
    } else if (alreadyAddedMajor(majorToAdd)) {
      setError(
        "You have already added this major: " + majorName + " " + catalogYear,
      );
    } else {
      // actually add the major here
      const newMajors = [...selectedMajors, majorToAdd];
      setSelectedMajors(newMajors);
      setMajorName("");
      setCatalogYear("");
      setError("");

      // every time a major is added, save all majors to the database
      saveMajors(newMajors);
    }
  }

  function handleRemoveMajor(majorId: number) {
    const newMajors = selectedMajors.filter((major) => major.id !== majorId);
    setSelectedMajors(newMajors);
    setError("");

    // save the new list of majors to the database
    saveMajors(newMajors);
  }

  const ErrorAlert = () => (
    <div>
      {error.length > 0 && (
        <Alert color="danger" startDecorator={<ReportIcon />}>
          {error}
        </Alert>
      )}
    </div>
  );

  return (
    <div className="space-y-4 w-full">
      <Card variant="soft" size="sm">
        <MajorsList
          selectedMajors={selectedMajors}
          majors={majors}
          major={majorName}
          catalogYear={catalogYear}
          programType={programType}
          handleChangeProgramType={handleChangeProgramType}
          handleChangeCatalogYear={handleChangeCatalogYear}
          handleChangeMajorName={handleChangeMajorName}
          errorSavingMajor={errorSavingMajor}
          onRemoveMajor={handleRemoveMajor}
          onAddMajor={handleAddMajor}
        />
        {userMajorsIsLoading && <CircularProgress />}
        {loadingSaveMajor && <LinearProgress />}
      </Card>

      <ErrorAlert />
    </div>
  );
}

function MajorsList({
  selectedMajors,
  major,
  catalogYear,
  programType,
  majors,
  handleChangeProgramType,
  handleChangeCatalogYear,
  handleChangeMajorName,
  errorSavingMajor,
  onRemoveMajor,
  onAddMajor,
}: {
  selectedMajors: Major[];
  major: string;
  catalogYear: string;
  programType: ProgramType;
  majors: any;
  handleChangeProgramType: any;
  handleChangeCatalogYear: any;
  handleChangeMajorName: any;
  errorSavingMajor: any;
  onRemoveMajor: any;
  onAddMajor: any;
}) {
  return (
    <>
      <Typography level="h4" textColor="inherit" fontWeight="lg" mb={1}>
        Your Majors
      </Typography>

      {errorSavingMajor && (
        <Alert color="danger" startDecorator={<ReportIcon />}>
          Error saving major data. Please log out and try again.
        </Alert>
      )}

      {selectedMajors.length === 0 && (
        <Typography level="body-lg" color="neutral">
          You have not added any majors yet.
        </Typography>
      )}

      <div className="space-y-2">
        {selectedMajors.map((major, index) => {
          const isMajor = major.programType === ProgramType.Major;

          return (
            <Card key={index} size="sm" variant="plain">
              <div className="flex justify-between items-center">
                <Typography>
                  {major.name} {major.catalogYear}
                </Typography>
                <div className="flex space-x-2">
                  <Chip color={isMajor ? "success" : "primary"}>
                    {isMajor ? "Major" : "Minor"}
                  </Chip>
                  <IconButton
                    color="danger"
                    onClick={() => onRemoveMajor(major.id)}
                  >
                    <Delete />
                  </IconButton>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-7 gap-2 items-end">
        <div className="col-span-2">
          <Typography level="body-lg">Program</Typography>
          <Select
            value={programType}
            placeholder="Choose one…"
            variant="plain"
            defaultValue={ProgramType.Major}
            onChange={handleChangeProgramType}
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
            years={years}
            onChange={handleChangeCatalogYear}
          />
        </div>
        <div className="col-span-2">
          <SelectMajorName
            selectedMajor={major}
            majors={majors}
            onChange={handleChangeMajorName}
          />
        </div>
        <div className="col-span-1">
          <Button variant="soft" onClick={onAddMajor}>
            Add
          </Button>
        </div>
      </div>
    </>
  );
}
