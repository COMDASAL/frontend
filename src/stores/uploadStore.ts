import { create } from "zustand";

interface UploadState {
  internalFile: File | null;
  externalFile: File | null;
  setInternalFile: (file: File | null) => void;
  setExternalFile: (file: File | null) => void;
  isReadyToValidate: () => boolean;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  internalFile: null,
  externalFile: null,
  setInternalFile: (file) => set({ internalFile: file }),
  setExternalFile: (file) => set({ externalFile: file }),
  isReadyToValidate: () => {
    const { internalFile, externalFile } = get();
    return internalFile !== null && externalFile !== null;
  },
}));
