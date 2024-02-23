import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
  addMajorRequirementList,
  getApprovedMajorRequirement,
  getMajorRequirementLists,
  removeMajorRequirementList,
} from "../actions/majorRequirements";
import { RequirementList } from "../types/Requirements";

export default function useMajorRequirementLists(majorId: number | undefined) {
  const { data: majorRequirementLists } = useQuery({
    queryKey: ["getMajorRequirementLists"],
    queryFn: () => {
      if (majorId === undefined) return;
      return getMajorRequirementLists(majorId);
    },
  });

  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  async function handleGetApprovedMajorRequirement(majorId: number) {
    setLoadingSave(true);
    await getApprovedMajorRequirement(majorId);
    setLoadingSave(false);
    setIsSaved(true);
  }

  async function handleAddMajorRequirementList(
    userId: string,
    majorId: number,
    requirementList: RequirementList,
  ) {
    setLoadingSave(true);
    await addMajorRequirementList(userId, majorId, requirementList);
    setLoadingSave(false);
    setIsSaved(true);
  }

  async function handleRemoveMajorRequirementList(
    userId: string,
    majorRequirementId: number,
  ) {
    setLoadingSave(true);
    await removeMajorRequirementList(userId, majorRequirementId);
    setLoadingSave(false);
    setIsSaved(true);
  }

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       if (majorId === undefined) return;
  //       try {
  //         const result = await getMajorRequirementLists(majorId);
  //         setMajorRequirementList(result); // Set the data to the state
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     };

  //     if (majorId) {
  //       fetchData();
  //     }
  //   }, [majorId]);

  return {
    isSaved,
    loadingSave,
    majorRequirementLists,
    onAddMajorRequirementList: handleAddMajorRequirementList,
    onGetApprovedMajorRequirement: handleGetApprovedMajorRequirement,
    onRemoveMajorRequirementList: handleRemoveMajorRequirementList,
  };
}
