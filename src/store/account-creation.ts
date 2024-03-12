import { create } from "zustand";

type AccountCreationStore = {
  skipSetup: boolean | undefined;
  setSkipSetup: (skip: boolean) => void;

  majors: string[] | undefined;
  setMajors: (majors: string[]) => void;
};

const useAccountCreationStore = create<AccountCreationStore>((set) => ({
  // Skip the account creation process
  skipSetup: undefined,
  setSkipSetup: (skipSetup: boolean) => set({ skipSetup }),

  // Majors
  majors: undefined,
  setMajors: (majors: string[]) => set({ majors }),
}));

export default useAccountCreationStore;
