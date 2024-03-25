import { Program } from "@/app/types/Program";
import { create } from "zustand";

type AccountCreationStore = {
  skipSetup: boolean | undefined;
  setSkipSetup: (skip: boolean) => void;

  selectedMajors: Program[] | undefined;
  setMajor: (majors: Program[]) => void;
  addMajor: (major: Program) => void;
  deleteMajor: (programId: number) => void;

  selectedMinors: Program[] | undefined;
  addMinor: (major: Program) => void;
  deleteMinor: (programId: number) => void;
};

const useAccountCreationStore = create<AccountCreationStore>((set) => ({
  // Skip the account creation process
  skipSetup: undefined,
  setSkipSetup: (skipSetup: boolean) => set({ skipSetup }),

  // Majors
  selectedMajors: undefined,

  setMajor: (majors) => set({ selectedMajors: majors }),

  addMajor: (newMajor) =>
    set((state) => ({
      selectedMajors: [...(state.selectedMajors ?? []), newMajor],
    })),

  deleteMajor: (programId) =>
    set((state) => {
      if (state.selectedMajors === undefined) {
        return { selectedMajors: undefined };
      }

      // Better way to do this?
      const _majorInfo = state.selectedMajors.filter(
        (majorInfo) => majorInfo.id !== programId,
      );
      return { selectedMajors: _majorInfo };
    }),

  // Minors
  selectedMinors: undefined,

  addMinor: (newMinor) =>
    set((state) => ({
      selectedMinors: [...(state.selectedMinors ?? []), newMinor],
    })),

  deleteMinor: (programId) =>
    set((state) => {
      if (state.selectedMinors === undefined) {
        return { selectedMinors: undefined };
      }

      const _majorInfo = state.selectedMinors.filter(
        (minorInfo) => minorInfo.id !== programId,
      );
      return { selectedMinors: _majorInfo };
    }),
}));

export default useAccountCreationStore;
