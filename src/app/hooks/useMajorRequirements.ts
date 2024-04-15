import {
  getMajorRequirements,
  saveMajorRequirements,
} from "@/app/actions/majorRequirements";
import { Program } from "@/app/types/Program";
import { Binder, RequirementList } from "@customTypes/Requirements";
import { useEffect, useState } from "react";

/**
 * @param majors is the majors/minors the user has.
 * This hook keeps track of listOfMajorRequirements which has major requirements
 * for each major/minor the user has. It is intended to allow the user to edit
 * major requirements
 */

// TODO: use this hook in a future admin page where all major requirements can easily be edited.
export default function useMajorRequirements(
  majors: Program[],
  userId: string | undefined,
) {
  const [listOfMajorRequirements, setListOfMajorRequirements] = useState<
    {
      majorRequirements: RequirementList;
      major: Program;
      loadingSave: boolean;
      isSaved: boolean;
    }[]
  >();

  // whenever the list of majors changes, fetch the major requirements for each major
  useEffect(() => {
    const fetchMajorRequirements = async (
      majorId: number,
      listOfRequirements: any,
    ) => {
      try {
        const requirements: RequirementList =
          await getMajorRequirements(majorId);

        // save the loaded major requirements to the state
        const newListOfMajorRequirements = listOfRequirements.map(
          (majorRequirement: any) => {
            if (majorRequirement.major.id === majorId) {
              return {
                ...majorRequirement,
                majorRequirements: requirements,
                isSaved: true,
              };
            }
            return majorRequirement;
          },
        );

        return newListOfMajorRequirements;
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      return listOfMajorRequirements;
    };

    async function fetchAllMajorRequirements() {
      // first create empty listOfMajorRequirements
      let newListOfMajorRequirements = majors.map((major) => {
        return {
          majorRequirements: {
            id: "",
            binder: Binder.AND,
            requirements: [],
          },
          major: major,
          loadingSave: false,
          isSaved: true,
        };
      });

      for (const major of majors) {
        newListOfMajorRequirements = await fetchMajorRequirements(
          major.id,
          newListOfMajorRequirements,
        );
      }
      setListOfMajorRequirements(newListOfMajorRequirements);
    }

    fetchAllMajorRequirements();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [majors]);

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
