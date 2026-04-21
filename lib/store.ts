import { create } from "zustand";
import { Transaction } from "@/types/transaction";

interface AMLStore {
  // The transaction the compliance officer has selected for review
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (txn: Transaction | null) => void;

  // The streaming AI summary text
  aiSummary: string;
  setAISummary: (text: string) => void;
  appendAISummary: (chunk: string) => void;

  // Loading state for AI call
  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;
}

export const useAMLStore = create<AMLStore>((set) => ({
  selectedTransaction: null,
  setSelectedTransaction: (txn) =>
    set({ selectedTransaction: txn, aiSummary: "", isAnalyzing: false }),

  aiSummary: "",
  setAISummary: (text) => set({ aiSummary: text }),
  appendAISummary: (chunk) =>
    set((state) => ({ aiSummary: state.aiSummary + chunk })),

  isAnalyzing: false,
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
}));
