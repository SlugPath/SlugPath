import { ProgramInfo } from "@/app/types/Program";
import { create } from "zustand";

type AccountCreationStore = {
  skipSetup: boolean | undefined;
  setSkipSetup: (skip: boolean) => void;

  selectedMajors: ProgramInfo[] | undefined;
  addMajorInfo: (majorInfo: ProgramInfo) => void;
  deleteMajor: (majorInfo: ProgramInfo) => void;
};

const useAccountCreationStore = create<AccountCreationStore>((set) => ({
  // Skip the account creation process
  skipSetup: undefined,
  setSkipSetup: (skipSetup: boolean) => set({ skipSetup }),

  // Majors
  selectedMajors: undefined,

  addMajorInfo: (newMajorInfo) =>
    set((state) => ({
      selectedMajors: [...(state.selectedMajors ?? []), newMajorInfo],
    })),

  deleteMajor: (toDeleteMajorInfo) =>
    set((state) => {
      if (state.selectedMajors === undefined) {
        return { selectedMajors: undefined };
      }

      const _majorInfo = state.selectedMajors.filter(
        (majorInfo) =>
          majorInfo.programName !== toDeleteMajorInfo.programName ||
          majorInfo.catalogYear !== toDeleteMajorInfo.catalogYear,
      );
      return { selectedMajors: _majorInfo };
    }),
  // setMajors: (majors: string[]) => set({ majors }),
}));

export default useAccountCreationStore;
