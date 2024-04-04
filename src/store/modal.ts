import { create } from "zustand";

type ModalStore = {
  showExportModal: boolean;
  setShowExportModal: (show: boolean) => void;

  showShareModal: boolean;
  setShowShareModal: (show: boolean) => void;

  showReplaceRLModal: boolean;
  setShowReplaceRLModal: (show: boolean) => void;
};

const useModalStore = create<ModalStore>((set) => ({
  showExportModal: false,
  setShowExportModal: (show: boolean) => set({ showExportModal: show }),

  showShareModal: false,
  setShowShareModal: (show: boolean) => set({ showShareModal: show }),

  showReplaceRLModal: false,
  setShowReplaceRLModal: (show: boolean) => set({ showReplaceRLModal: show }),
}));

export default useModalStore;
