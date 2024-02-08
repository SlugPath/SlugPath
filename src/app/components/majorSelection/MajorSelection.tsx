/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAllMajorsByCatalogYear } from "@/app/actions/major";
import { Major } from "@/app/types/Major";
import { years } from "@/lib/defaultPlanners";
import { DefaultPlannerContext } from "@contexts/DefaultPlannerProvider";
import { Delete } from "@mui/icons-material";
import ReportIcon from "@mui/icons-material/Report";
import {
  Button,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  Option,
  Select,
  Typography,
} from "@mui/joy";
import { Alert } from "@mui/joy";
import { ProgramType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useMemo, useState } from "react";

import SelectCatalogYear from "./SelectCatalogYear";
import SelectMajorName from "./SelectMajorName";
import DefaultPlannerSelection from "./defaultPlannerSelection/DefaultPlannerSelection";
// import useDefaultPlanners from "./defaultPlannerSelection/useDefaultPlanners";
import useMajorSelection from "./useMajorSelection";

export interface MajorSelectionProps {
  onSaved: () => void;
  saveButtonName: string;
  isInPlannerPage?: boolean;
  onSkip?: () => void;
  onCreateNewPlanner?: () => void;
  onReplaceCurrentPlanner?: () => void;
}

export default function MajorSelection({
  saveButtonName,
  onSaved,
  isInPlannerPage,
  onSkip,
  onCreateNewPlanner,
  onReplaceCurrentPlanner,
}: MajorSelectionProps) {
  const { data: session } = useSession();

  const [programType, setProgramType] = useState(ProgramType.Major);
  const [majorName, setMajorName] = useState("");
  const [catalogYear, setCatalogYear] = useState("");

  const [error, setError] = useState("");

  const { data: majors } = useQuery({
    queryKey: ["majors", catalogYear],
    queryFn: async () => {
      return await getAllMajorsByCatalogYear(catalogYear);
    },
    enabled: catalogYear !== "",
  });

  // getting userMajors from a context so that they load properly
  const {
    userMajors,
    userMajorsIsLoading,
    onAddMajor,
    loadingAddMajor,
    errorAddingMajor,
    onRemoveMajor,
    loadingRemoveMajor,
    errorRemovingMajor,
  } = useContext(DefaultPlannerContext);

  // const {
  // userMajorsIsLoading,
  // onAddMajor,
  // loadingAddMajor,
  // errorAddingMajor,
  // onRemoveMajor,
  // loadingRemoveMajor,
  // errorRemovingMajor,
  // } = useMajorSelection(session?.user.id);

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

  function alreadyAddedMajor(major: Major): boolean {
    return userMajors.some((userMajor) => {
      if (
        userMajor.name === major.name &&
        userMajor.catalogYear === major.catalogYear
      ) {
        return true;
      }
    });
  }

  function handleAddMajor() {
    const majorToAdd: Major = {
      name: majorName,
      catalogYear,
      programType,
      id: 0,
    };

    if (!alreadyAddedMajor(majorToAdd)) {
      onAddMajor(programType, majorName, catalogYear);
    } else {
      setError(
        "You have already added this major: " + majorName + " " + catalogYear,
      );
    }
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
      <ErrorAlert />

      <Card variant="soft" size="sm">
        {userMajorsIsLoading ||
          (loadingAddMajor && (
            <CircularProgress variant="plain" color="primary" />
          ))}
        <MajorsList
          selectedMajors={userMajors}
          majors={majors}
          major={majorName}
          catalogYear={catalogYear}
          handleChangeCatalogYear={handleChangeCatalogYear}
          handleChangeMajorName={handleChangeMajorName}
          handleAddMajor={handleAddMajor}
          loadingAddMajor={loadingAddMajor}
          errorAddingMajor={errorAddingMajor}
          onRemoveMajor={onRemoveMajor}
          loadingRemoveMajor={loadingRemoveMajor}
        />
      </Card>

      {/* <DefaultPlannerSelection
        onSaved={onSaved}
        saveButtonName={saveButtonName}
        isInPlannerPage={isInPlannerPage}
        onSkip={onSkip}
        onCreateNewPlanner={onCreateNewPlanner}
        onReplaceCurrentPlanner={onReplaceCurrentPlanner}
        major={{
          name: majorName,
          catalogYear: catalogYear,
          id: 0,
          programType: ProgramType.Major,
        }}
      /> */}
    </div>
  );
}

function MajorsList({
  selectedMajors,
  major,
  catalogYear,
  majors,
  handleChangeCatalogYear,
  handleChangeMajorName,
  handleAddMajor,
  loadingAddMajor,
  errorAddingMajor,
  onRemoveMajor,
  loadingRemoveMajor,
}: {
  selectedMajors: Major[];
  major: string;
  catalogYear: string;
  majors: any;
  handleChangeCatalogYear: any;
  handleChangeMajorName: any;
  handleAddMajor: any;
  loadingAddMajor: boolean;
  errorAddingMajor: any;
  onRemoveMajor: any;
  loadingRemoveMajor: boolean;
}) {
  return (
    <>
      <Typography level="h4" textColor="inherit" fontWeight="lg" mb={1}>
        Your Majors
      </Typography>

      {loadingAddMajor && <CircularProgress variant="plain" color="primary" />}
      {errorAddingMajor && (
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
                  {loadingRemoveMajor ? (
                    <CircularProgress variant="plain" color="primary" />
                  ) : (
                    <IconButton
                      color="danger"
                      onClick={() => onRemoveMajor(major.id)}
                    >
                      <Delete />
                    </IconButton>
                  )}
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
            // value={catalogYear}
            placeholder="Choose one…"
            variant="plain"
            // onChange={onChange}
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
          <Button variant="soft" onClick={handleAddMajor}>
            Add Major
          </Button>
        </div>
      </div>
    </>
  );
}
