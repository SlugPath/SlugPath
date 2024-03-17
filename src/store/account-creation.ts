import { ProgramInfo } from "@/app/types/Program";
import { create } from "zustand";

type AccountCreationStore = {
  skipSetup: boolean | undefined;
  setSkipSetup: (skip: boolean) => void;

  selectedMajors: ProgramInfo[] | undefined;
  addMajorInfo: (majorInfo: ProgramInfo) => void;
  deleteMajorInfo: (majorInfo: ProgramInfo) => void;

  selectedMinors: ProgramInfo[] | undefined;
  addMinorInfo: (minorInfor: ProgramInfo) => void;
  deleteMinorInfo: (minorInfo: ProgramInfo) => void;
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

  deleteMajorInfo: (toDeleteMajorInfo) =>
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

  // Minors
  selectedMinors: undefined,

  addMinorInfo: (newMinorInfo) =>
    set((state) => ({
      selectedMinors: [...(state.selectedMinors ?? []), newMinorInfo],
    })),

  deleteMinorInfo: (toDeleteMinorInfo) =>
    set((state) => {
      if (state.selectedMinors === undefined) {
        return { selectedMinors: undefined };
      }

      const _majorInfo = state.selectedMinors.filter(
        (minorInfo) =>
          minorInfo.programName !== toDeleteMinorInfo.programName ||
          minorInfo.catalogYear !== toDeleteMinorInfo.catalogYear,
      );
      return { selectedMinors: _majorInfo };
    }),
}));

export default useAccountCreationStore;
