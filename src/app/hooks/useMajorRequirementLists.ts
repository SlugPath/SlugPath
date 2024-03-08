import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
  addMajorRequirementList,
  addUpvote,
  getApprovedMajorRequirement,
  getMajorRequirementLists,
  getUpvotes,
  removeMajorRequirementList,
  removeUpvote,
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

  async function handleGetUpvotes(majorRequirementId: number) {
    setLoadingSave(true);
    await getUpvotes(majorRequirementId);
    setLoadingSave(false);
    setIsSaved(true);
  }

  async function handleAddUpvote(userId: string, majorRequirementId: number) {
    setLoadingSave(true);
    await addUpvote(userId, majorRequirementId);
    setLoadingSave(false);
    setIsSaved(true);
  }

  async function handleRemoveUpvote(userId: string, upvoteId: number) {
    setLoadingSave(true);
    await removeUpvote(userId, upvoteId);
    setLoadingSave(false);
    setIsSaved(true);
  }

  return {
    isSaved,
    loadingSave,
    majorRequirementLists,
    onAddMajorRequirementList: handleAddMajorRequirementList,
    onGetApprovedMajorRequirement: handleGetApprovedMajorRequirement,
    onRemoveMajorRequirementList: handleRemoveMajorRequirementList,
    onGetUpvotes: handleGetUpvotes,
    onAddUpvote: handleAddUpvote,
    onRemoveUpvote: handleRemoveUpvote,
  };
}
