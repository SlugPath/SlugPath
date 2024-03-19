import {
  Major as MajorExplicit,
  Minor as MinorExplicit,
} from "@/app/types/Program";
import { create } from "zustand";

// QUESTION: These types may be a little scuffed, should use new type? Or keep redundant
// programType property?
type Major = Omit<MajorExplicit, "programType">;
type Minor = Omit<MinorExplicit, "programType">;

type AccountCreationStore = {
  skipSetup: boolean | undefined;
  setSkipSetup: (skip: boolean) => void;

  selectedMajors: Major[] | undefined;
  addMajorInfo: (majorInfo: Major) => void;
  deleteMajorInfo: (programId: number) => void;

  selectedMinors: Minor[] | undefined;
  addMinorInfo: (minorInfor: Minor) => void;
  deleteMinorInfo: (programId: number) => void;
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

  deleteMajorInfo: (programId) =>
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

  addMinorInfo: (newMinorInfo) =>
    set((state) => ({
      selectedMinors: [...(state.selectedMinors ?? []), newMinorInfo],
    })),

  deleteMinorInfo: (programId) =>
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
