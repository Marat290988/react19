import { create } from "zustand";

interface LoadingState {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  isLocalLoading: boolean;
  setLocalLoading: (isLocalLoading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  setLoading: (isLoading: boolean) => set(prevState => ({ ...prevState, isLoading })),
  isLocalLoading: false,
  setLocalLoading: (isLocalLoading: boolean) => set(prevState => ({ ...prevState, isLocalLoading })),
}))