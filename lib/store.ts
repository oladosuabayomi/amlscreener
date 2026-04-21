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

  // SAR Report generation
  isGeneratingSAR: boolean;
  setIsGeneratingSAR: (v: boolean) => void;

  // Account freeze status
  frozenAccounts: Set<string>;
  setAccountFrozen: (id: string, frozen: boolean) => void;
}

export const useAMLStore = create<AMLStore>((set, get) => ({
  selectedTransaction: null,
  setSelectedTransaction: (txn) =>
    set({ selectedTransaction: txn, aiSummary: "", isAnalyzing: false }),

  aiSummary: "",
  setAISummary: (text) => set({ aiSummary: text }),
  appendAISummary: (chunk) =>
    set((state) => ({ aiSummary: state.aiSummary + chunk })),

  isAnalyzing: false,
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),

  isGeneratingSAR: false,
  setIsGeneratingSAR: (v) => set({ isGeneratingSAR: v }),

  frozenAccounts: new Set(),
  setAccountFrozen: (id, frozen) =>
    set((state) => {
      const newFrozen = new Set(state.frozenAccounts);
      if (frozen) {
        newFrozen.add(id);
      } else {
        newFrozen.delete(id);
      }
      return { frozenAccounts: newFrozen };
    }),
}));
