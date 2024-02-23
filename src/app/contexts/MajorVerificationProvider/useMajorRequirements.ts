import {
  getApprovedMajorRequirement,
  saveMajorRequirements,
} from "@actions/majorRequirements";
import { Binder, RequirementList } from "@customTypes/Requirements";
import { useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";

export default function useMajorRequirements(
  majorId: number | undefined,
  userId: string | undefined,
) {
  const [majorRequirements, setMajorRequirements] = useState<RequirementList>({
    binder: Binder.AND,
    title: "No title",
    id: uuid4(),
    requirements: [],
  });
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  function handleSetMajorRequirements(newMajorRequirements: RequirementList) {
    setMajorRequirements(newMajorRequirements);
    setIsSaved(false);
  }

  async function handleSaveMajorRequirements(majorId: number) {
    setLoadingSave(true);
    await saveMajorRequirements(majorRequirements, majorId, userId!);
    setLoadingSave(false);
    setIsSaved(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (majorId === undefined) return;
      try {
        const result = await getApprovedMajorRequirement(majorId); //this used to be getMajorRequirements
        if (result == null) {
          setMajorRequirements(majorRequirements);
        } else {
          setMajorRequirements(result);
        } // Set the data to the state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (majorId) {
      fetchData();
    }
  }, [majorId, majorRequirements]);

  return {
    isSaved,
    loadingSave,
    majorRequirements,
    onSetMajorRequirements: handleSetMajorRequirements,
    onSaveMajorRequirements: handleSaveMajorRequirements,
  };
}
