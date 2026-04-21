import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AlertStatus = "NEW" | "UNDER_REVIEW" | "ESCALATED" | "CLEARED";

interface AlertStore {
    // Map of TXN ID → status
    alertStatuses: Record<string, AlertStatus>;
    setAlertStatus: (id: string, status: AlertStatus) => void;
    resetAlertStatus: (id: string) => void;
}

export const useAlertStore = create<AlertStore>()(
    persist(
        (set) => ({
            alertStatuses: {},

            setAlertStatus: (id, status) =>
                set((state) => ({
                    alertStatuses: { ...state.alertStatuses, [id]: status },
                })),

            resetAlertStatus: (id) =>
                set((state) => {
                    const next = { ...state.alertStatuses };
                    delete next[id];
                    return { alertStatuses: next };
                }),
        }),
        {
            name: "aml-alert-statuses", // localStorage key
            partialize: (state) => ({ alertStatuses: state.alertStatuses }),
        },
    ),
);
