export type ActiveModule = 
  | 'overview'
  | 'revenue'
  | 'recovery'
  | 'risk'
  | 'finance'
  | 'growth'
  | 'copilot'
  | 'audit';

export type SpecialistType = 
  | 'revenue'
  | 'recovery'
  | 'risk'
  | 'reconciliation'
  | 'growth'
  | 'general';

export type PaymentMethod = 
  | 'upi_intent'
  | 'upi_collect'
  | 'card_credit'
  | 'card_debit'
  | 'netbanking'
  | 'wallet'
  | 'emi_cardless';

export type PaymentStatus = 
  | 'captured'
  | 'failed'
  | 'authorized'
  | 'refunded'
  | 'disputed';

export type FailureCategory = 
  | 'technical_gateway'
  | 'insufficient_funds'
  | 'user_dropped_3ds'
  | 'bank_downtime'
  | 'velocity_risk_block'
  | 'daily_limit_exceeded';

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  gateway: string;
  issuerBank: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  failureReason?: string;
  failureCategory?: FailureCategory;
  failureCode?: string;
  riskScore: number; // 0-100
  settlementStatus: 'settled' | 'pending' | 'unreconciled' | 'disputed';
  feeCharged: number;
  expectedFee: number;
  createdAt: string;
  metadata?: Record<string, string>;
}

export interface MetricSummary {
  totalRevenue: number;
  totalRevenueDelta: number; // percentage vs prior period
  revenueAtRisk: number;
  revenueAtRiskDelta: number;
  revenueRecovered: number;
  revenueRecoveredDelta: number;
  paymentSuccessRate: number; // e.g. 84.6%
  successRateDelta: number;
  reconciliationRate: number; // e.g. 98.2%
  reconciliationRateDelta: number;
  riskAlertCount: number;
  openExceptionsCount: number;
  recentActionCount: number;
  transactionCount: number;
}

export interface AnomalyAlert {
  id: string;
  module: 'revenue' | 'risk' | 'recovery' | 'finance';
  severity: 'high' | 'medium' | 'info';
  title: string;
  description: string;
  detectedAt: string;
  estimatedImpact: number;
  impactLabel: string;
  rootCause: string;
  status: 'active' | 'mitigated' | 'dismissed';
  suggestedAction?: ActionProposal;
}

export interface RecoveryItem {
  id: string;
  paymentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  failedAt: string;
  failureCode: string;
  failureReason: string;
  failureCategory: FailureCategory;
  recoveryStrategy: string;
  recoveryProbability: number; // 0-100%
  status: 'recoverable' | 'in_progress' | 'recovered' | 'unrecoverable';
  recommendedAction: ActionProposal;
  recoveredAmount?: number;
  attemptsCount: number;
  lastAttemptAt?: string;
}

export interface RiskCluster {
  id: string;
  clusterType: 'card_testing_velocity' | 'suspicious_refund_burst' | 'bin_anomaly' | 'geo_ip_mismatch';
  severity: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  riskScore: number;
  detectedAt: string;
  transactionCount: number;
  totalExposure: number;
  associatedTransactions: string[];
  entityValue: string; // e.g. "IP 185.220.101.44" or "BIN 411111"
  explanation: string;
  evidence: { label: string; value: string }[];
  status: 'active' | 'blocked' | 'monitored' | 'dismissed';
  recommendedAction: ActionProposal;
}

export interface ReconciliationException {
  id: string;
  orderId: string;
  paymentId: string;
  bankUtr?: string;
  gateway: string;
  discrepancyType: 
    | 'fee_overcharge'
    | 'uncaptured_authorization'
    | 'delayed_settlement'
    | 'double_debit_refund_mismatch'
    | 'amount_mismatch';
  discrepancyAmount: number;
  internalAmount: number;
  gatewayAmount: number;
  settlementAmount: number;
  detectedAt: string;
  likelyCause: string;
  status: 'open' | 'resolving' | 'reconciled' | 'ignored';
  recommendedAction: ActionProposal;
}

export interface GrowthOpportunity {
  id: string;
  title: string;
  category: 'payment_routing' | 'checkout_ux' | 'payment_methods' | 'smart_retry';
  potentialRevenueLift: number;
  conversionLiftPercentage: number;
  confidenceScore: number;
  dropOffStage: string;
  description: string;
  actionableSteps: string[];
  status: 'available' | 'implemented' | 'evaluating';
  recommendedAction: ActionProposal;
}

export interface GuardrailCheck {
  id: string;
  ruleName: string;
  description?: string;
  status: 'pass' | 'warning' | 'blocked';
  detail: string;
}

export interface ActionProposal {
  id?: string;
  actionId?: string;
  module: ActiveModule;
  title: string;
  description: string;
  targetEntityId?: string;
  targetEntityType?: 'transaction' | 'recovery_item' | 'risk_cluster' | 'reconciliation_item' | 'growth_config' | 'batch' | string;
  impactAmount?: number;
  riskLevel: 'low' | 'medium' | 'high';
  requiresApproval?: boolean;
  guardrailChecks: GuardrailCheck[];
  deterministicProof: string;
  idempotencyKey: string;
  simulatedOutcome: string;
  payload?: Record<string, any>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  module: ActiveModule;
  actionId?: string;
  actionType?: string;
  title: string;
  description?: string;
  policyRulesEvaluated?: string[];
  deterministicProof?: string;
  verificationHash: string;
  executionLatencyMs: number;
  status: 'verified' | 'blocked' | 'pending' | 'verified_success';
  financialImpact?: number;
  idempotencyKey?: string;
  actionPayload?: Record<string, any>;
  targetEntityId?: string;
  guardrailsEvaluated?: number;
}

export type AuditLogEntry = AuditLog;

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'mercury';
  timestamp: string;
  content: string;
  specialistRoute?: SpecialistType;
  thoughtProcess?: string[];
  keyFindings?: string[];
  dataHighlights?: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
  }[];
  suggestedAction?: ActionProposal;
  proposedAction?: ActionProposal;
  isStreaming?: boolean;
}

export interface MerchantProfile {
  id: string;
  name: string;
  businessCategory: string;
  environment: 'test' | 'live';
  currency: string;
  razorpayKeyId: string;
  webhookStatus: 'connected' | 'degraded' | 'disconnected';
  autoRecoveryEnabled: boolean;
  maxAutoRefundLimit: number;
}
