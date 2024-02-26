import {
  getMajorRequirements,
  saveMajorRequirements,
} from "@/app/actions/majorRequirements";
import { Major } from "@customTypes/Major";
import { Binder, RequirementList } from "@customTypes/Requirements";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function useMajorRequirements(
  majors: Major[],
  userId: string | undefined,
) {
  const [listOfMajorRequirements, setListOfMajorRequirements] = useState<
    {
      majorRequirements: RequirementList;
      major: Major;
      loadingSave: boolean;
      isSaved: boolean;
    }[]
  >();

  const emptyMajorRequirements = (major: Major) => ({
    majorRequirements: {
      id: "",
      binder: Binder.AND,
      requirements: [],
    } as RequirementList,
    major: major,
    loadingSave: false,
    isSaved: true,
  });

  useQuery({
    queryKey: ["allMajorRequirements", ...majors],
    queryFn: async () => {
      const initRequirements = majors.map(emptyMajorRequirements);
      const res = await Promise.all(
        initRequirements.map(async (majorReq) => {
          return {
            ...majorReq,
            majorRequirements: await getMajorRequirements(majorReq.major.id),
            isSaved: true,
          };
        }),
      );
      setListOfMajorRequirements(res);
      return res;
    },
  });

  // handlers start ================================================
  function handleSetMajorRequirements(
    majorId: number,
    newMajorRequirements: RequirementList,
  ) {
    const newListOfMajorRequirements = listOfMajorRequirements?.map(
      (majorRequirement) => {
        if (majorRequirement.major.id === majorId) {
          return {
            ...majorRequirement,
            majorRequirements: newMajorRequirements,
            isSaved: false,
          };
        }
        return majorRequirement;
      },
    );

    setListOfMajorRequirements(newListOfMajorRequirements);
  }

  function setLoadingSave(majorId: number, loading: boolean) {
    const newListOfMajorRequirements = listOfMajorRequirements?.map(
      (majorRequirement) => {
        if (majorRequirement.major.id === majorId) {
          return {
            ...majorRequirement,
            loadingSave: loading,
          };
        }
        return majorRequirement;
      },
    );

    setListOfMajorRequirements(newListOfMajorRequirements);
  }

  function setIsSaved(majorId: number, isSaved: boolean) {
    const newListOfMajorRequirements = listOfMajorRequirements?.map(
      (majorRequirement) => {
        if (majorRequirement.major.id === majorId) {
          return {
            ...majorRequirement,
            isSaved,
          };
        }
        return majorRequirement;
      },
    );

    setListOfMajorRequirements(newListOfMajorRequirements);
  }

  async function handleSaveMajorRequirements(majorId: number) {
    const majorRequirements = listOfMajorRequirements?.find(
      (majorRequirement) => majorRequirement.major.id === majorId,
    )?.majorRequirements;

    if (majorRequirements === undefined) return;

    setLoadingSave(majorId, true);
    await saveMajorRequirements(majorRequirements, majorId, userId!);
    setLoadingSave(majorId, false);
    setIsSaved(majorId, true);
  }
  // handlers end =================================================

  // helper functions start ================================================================================
  function getRequirementsForMajor(
    majorId: number,
  ): RequirementList | undefined {
    const req = listOfMajorRequirements?.find(
      (majorRequirement) => majorRequirement.major.id === majorId,
    )?.majorRequirements;
    return req;
  }

  function getIsSaved(majorId: number): boolean {
    return (
      listOfMajorRequirements?.find(
        (majorRequirement) => majorRequirement.major.id === majorId,
      )?.isSaved ?? false
    );
  }

  function getLoadingSave(majorId: number): boolean {
    return (
      listOfMajorRequirements?.find(
        (majorRequirement) => majorRequirement.major.id === majorId,
      )?.loadingSave ?? false
    );
  }
  // helper functions end ================================================================================

  return {
    listOfMajorRequirements,
    onSetMajorRequirements: handleSetMajorRequirements,
    onSaveMajorRequirements: handleSaveMajorRequirements,
    getRequirementsForMajor,
    getIsSaved,
    getLoadingSave,
  };
}
