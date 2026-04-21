export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type AnomalyType =
  | "SMURFING"
  | "VELOCITY_SPIKE"
  | "GEO_ANOMALY"
  | "ROUND_TRIPPING"
  | null;

export interface Transaction {
  id: string;
  timestamp: string;           // ISO 8601
  amount: number;              // in Naira (NGN)
  senderAccount: string;
  receiverAccount: string;
  senderBank: string;
  receiverBank: string;
  senderLocation: string;
  receiverLocation: string;
  velocity: number;            // transactions per hour from this account
  riskScore: number;           // 0–100
  riskLevel: RiskLevel;
  anomalyType: AnomalyType;
  flagged: boolean;
  description: string;         // human-readable note
}
