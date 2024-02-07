import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
  addMajorRequirementList,
  getMajorRequirementLists,
  removeMajorRequirementList,
} from "../actions/majorRequirementsActions";
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

  async function handleAddMajorRequirementList(
    majorId: number,
    requirementList: RequirementList,
  ) {
    setLoadingSave(true);
    const result = await addMajorRequirementList(majorId, requirementList);
    console.log("result");
    console.log(result);
    setLoadingSave(false);
    setIsSaved(true);
  }

  async function handleRemoveMajorRequirementList(majorRequirementId: number) {
    setLoadingSave(true);
    await removeMajorRequirementList(majorRequirementId);
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
    onRemoveMajorRequirementList: handleRemoveMajorRequirementList,
  };
}
