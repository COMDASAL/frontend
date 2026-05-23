import { create } from "zustand";

interface UploadState {
  internalFile: File | null;
  externalFile: File | null;
  hasStarted: boolean;
  setInternalFile: (file: File | null) => void;
  setExternalFile: (file: File | null) => void;
  setHasStarted: (status: boolean) => void;
  isReadyToValidate: () => boolean;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  internalFile: null,
  externalFile: null,
  hasStarted: false,
  setInternalFile: (file) => set({ internalFile: file }),
  setExternalFile: (file) => set({ externalFile: file }),
  setHasStarted: (status) => set({ hasStarted: status }),
  isReadyToValidate: () => {
    const { internalFile, externalFile } = get();
    return internalFile !== null && externalFile !== null;
  },
}));
