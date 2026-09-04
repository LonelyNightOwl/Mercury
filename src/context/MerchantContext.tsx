import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ActiveModule,
  MerchantProfile,
  MetricSummary,
  AnomalyAlert,
  RecoveryItem,
  RiskCluster,
  ReconciliationException,
  GrowthOpportunity,
  AuditLogEntry,
  Transaction,
  ActionProposal,
  CopilotMessage,
  CopilotSpecialist
} from '../types';
import {
  INITIAL_MERCHANT_PROFILE,
  INITIAL_METRICS,
  INITIAL_ANOMALY_ALERTS,
  INITIAL_RECOVERY_ITEMS,
  INITIAL_RISK_CLUSTERS,
  INITIAL_RECONCILIATION_EXCEPTIONS,
  INITIAL_GROWTH_OPPORTUNITIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_TRANSACTIONS
} from '../data/mockData';

interface MerchantContextType {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
  profile: MerchantProfile;
  setProfile: React.Dispatch<React.SetStateAction<MerchantProfile>>;
  metrics: MetricSummary;
  alerts: AnomalyAlert[];
  recoveryItems: RecoveryItem[];
  riskClusters: RiskCluster[];
  reconciliationExceptions: ReconciliationException[];
  growthOpportunities: GrowthOpportunity[];
  auditLogs: AuditLogEntry[];
  transactions: Transaction[];
  copilotMessages: CopilotMessage[];
  isCopilotThinking: boolean;
  sendCopilotQuery: (query: string, specialist?: CopilotSpecialist) => Promise<void>;
  
  // Guardrail Action Workflow
  pendingAction: ActionProposal | null;
  setPendingAction: (action: ActionProposal | null) => void;
  isExecutingAction: boolean;
  executeAction: (proposal: ActionProposal, actor?: 'MERCURY Copilot (AI)' | 'Merchant (Manual)') => Promise<AuditLogEntry>;
  
  // Quick Actions & Simulators
  dismissAlert: (alertId: string) => void;
  triggerBatchRecovery: () => Promise<number>;
  triggerWebhookSimulation: (eventType: 'payment.failed' | 'payment.captured' | 'refund.created' | 'dispute.created' | 'settlement.delayed') => void;
  selectedTimeframe: 'today' | 'yesterday' | '7d' | '30d';
  setSelectedTimeframe: (tf: 'today' | 'yesterday' | '7d' | '30d') => void;
  formatCurrency: (amount: number) => string;
}

const MerchantContext = createContext<MerchantContextType | undefined>(undefined);

export const MerchantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('overview');
  const [profile, setProfile] = useState<MerchantProfile>(INITIAL_MERCHANT_PROFILE);
  const [metrics, setMetrics] = useState<MetricSummary>(INITIAL_METRICS);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(INITIAL_ANOMALY_ALERTS);
  const [recoveryItems, setRecoveryItems] = useState<RecoveryItem[]>(INITIAL_RECOVERY_ITEMS);
  const [riskClusters, setRiskClusters] = useState<RiskCluster[]>(INITIAL_RISK_CLUSTERS);
  const [reconciliationExceptions, setReconciliationExceptions] = useState<ReconciliationException[]>(INITIAL_RECONCILIATION_EXCEPTIONS);
  const [growthOpportunities, setGrowthOpportunities] = useState<GrowthOpportunity[]>(INITIAL_GROWTH_OPPORTUNITIES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'yesterday' | '7d' | '30d'>('today');
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'copilot-welcome',
      sender: 'mercury',
      timestamp: 'Now',
      content: 'Hello! I can analyze your revenue, failed payments, risk clusters, reconciliation gaps, and growth opportunities in real time.',
      specialistRoute: 'general'
    }
  ]);
  const [isCopilotThinking, setIsCopilotThinking] = useState<boolean>(false);

  const [pendingAction, setPendingAction] = useState<ActionProposal | null>(null);
  const [isExecutingAction, setIsExecutingAction] = useState<boolean>(false);

  // Recalculate summary metrics dynamically based on current entity states
  useEffect(() => {
    const recoverableSum = recoveryItems
      .filter(item => item.status === 'recoverable')
      .reduce((sum, i) => sum + i.amount, 0);

    const totalRecoveredSum = recoveryItems
      .filter(item => item.status === 'recovered')
      .reduce((sum, i) => sum + (i.recoveredAmount || i.amount), 0) + INITIAL_METRICS.revenueRecovered;

    const openExceptions = reconciliationExceptions.filter(e => e.status === 'open').length;
    const activeRiskCount = riskClusters.filter(r => r.status === 'active').length;

    setMetrics(prev => ({
      ...prev,
      revenueAtRisk: Math.max(recoverableSum, 240000),
      revenueRecovered: totalRecoveredSum,
      openExceptionsCount: openExceptions,
      riskAlertCount: activeRiskCount,
      reconciliationRate: Number((100 - (openExceptions * 0.45)).toFixed(1)),
      recentActionCount: auditLogs.length
    }));
  }, [recoveryItems, reconciliationExceptions, riskClusters, auditLogs]);

  // Format currency in Indian numbering system (e.g. ₹14,82,450 or ₹1.48 Cr)
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const sendCopilotQuery = async (query: string, specialist?: CopilotSpecialist): Promise<void> => {
    const text = query.trim();
    if (!text) {
      return;
    }

    const trimmedSpecialist = specialist && specialist !== 'all' ? specialist : undefined;

    const userMessage: CopilotMessage = {
      id: `copilot-user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }) + ' IST',
      content: text,
      specialistRoute: trimmedSpecialist as CopilotMessage['specialistRoute']
    };

    setCopilotMessages(prev => [...prev, userMessage]);
    setIsCopilotThinking(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          contextSnapshot: {
            module: activeModule,
            specialist: trimmedSpecialist,
            profile,
            metrics,
            alerts: alerts.slice(0, 5),
            recoveryItems: recoveryItems.slice(0, 4),
            riskClusters: riskClusters.slice(0, 3),
            reconciliationExceptions: reconciliationExceptions.slice(0, 4),
            growthOpportunities: growthOpportunities.slice(0, 2)
          }
        })
      });

      const data = await response.json();
      const assistantContent = typeof data?.content === 'string' ? data.content : 'I analyzed your merchant telemetry and can help narrow the issue.';

      const assistantMessage: CopilotMessage = {
        id: `copilot-mercury-${Date.now()}`,
        sender: 'mercury',
        timestamp: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }) + ' IST',
        content: assistantContent,
        specialistRoute: trimmedSpecialist as CopilotMessage['specialistRoute']
      };

      setCopilotMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const fallback = `I hit a temporary issue while analyzing your request. Based on the current merchant telemetry, the most likely focus is ${activeModule === 'overview' ? 'revenue health and recovery opportunities' : activeModule}.`;

      setCopilotMessages(prev => [...prev, {
        id: `copilot-error-${Date.now()}`,
        sender: 'mercury',
        timestamp: 'Now',
        content: fallback,
        specialistRoute: trimmedSpecialist as CopilotMessage['specialistRoute']
      }]);
    } finally {
      setIsCopilotThinking(false);
    }
  };

  // Deterministic Guardrail Execution Engine
  const executeAction = async (
    proposal: ActionProposal,
    actor: 'MERCURY Copilot (AI)' | 'Merchant (Manual)' = 'MERCURY Copilot (AI)'
  ): Promise<AuditLogEntry> => {
    setIsExecutingAction(true);

    // Simulate 350ms cryptographic guardrail verification & deterministic state mutation
    await new Promise(resolve => setTimeout(resolve, 350));

    const timestamp = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }) + ' IST';

    const hashRandom = Math.random().toString(36).substring(2, 10);
    const verificationHash = `0x${hashRandom}e892${Date.now().toString(16)}`;

    // 1. Mutate specific entity state based on module
    if (proposal.module === 'recovery' || proposal.targetEntityType === 'recovery_item') {
      setRecoveryItems(prev => prev.map(item => {
        if (item.paymentId === proposal.targetEntityId || item.id === proposal.targetEntityId) {
          return {
            ...item,
            status: 'recovered',
            recoveredAmount: item.amount,
            attemptsCount: item.attemptsCount + 1,
            lastAttemptAt: 'Just now'
          };
        }
        return item;
      }));
    }

    if (proposal.module === 'finance' || proposal.targetEntityType === 'reconciliation_item') {
      setReconciliationExceptions(prev => prev.map(exc => {
        if (exc.id === proposal.targetEntityId || exc.paymentId === proposal.targetEntityId) {
          return {
            ...exc,
            status: 'reconciled'
          };
        }
        return exc;
      }));
    }

    if (proposal.targetEntityType === 'batch' && proposal.payload?.orders) {
      setReconciliationExceptions(prev => prev.map(exc => {
        if (proposal.payload.orders.includes(exc.orderId)) {
          return { ...exc, status: 'reconciled' };
        }
        return exc;
      }));
    }

    if (proposal.module === 'risk' || proposal.targetEntityType === 'risk_cluster') {
      setRiskClusters(prev => prev.map(rc => {
        if (rc.id === proposal.targetEntityId) {
          return {
            ...rc,
            status: 'blocked'
          };
        }
        return rc;
      }));
    }

    if (proposal.module === 'growth' || proposal.targetEntityType === 'growth_config') {
      setGrowthOpportunities(prev => prev.map(gro => {
        if (gro.recommendedAction.actionId === proposal.actionId || gro.id === proposal.targetEntityId) {
          return {
            ...gro,
            status: 'implemented'
          };
        }
        return gro;
      }));
    }

    // Dismiss or mitigate linked alert
    setAlerts(prev => prev.map(a => {
      if (a.suggestedAction?.actionId === proposal.actionId || a.id === proposal.targetEntityId) {
        return { ...a, status: 'mitigated' };
      }
      return a;
    }));

    // 2. Create immutable audit log entry
    const newLogEntry: AuditLogEntry = {
      id: `aud_${Date.now().toString().slice(-4)}`,
      timestamp: `Today ${timestamp}`,
      actor,
      module: proposal.module,
      actionType: proposal.actionId.toUpperCase(),
      title: proposal.title,
      description: proposal.description,
      status: 'verified_success',
      targetEntityId: proposal.targetEntityId,
      financialImpact: proposal.impactAmount,
      guardrailsEvaluated: proposal.guardrailChecks.length || 3,
      deterministicProof: proposal.deterministicProof,
      verificationHash,
      executionLatencyMs: Math.floor(Math.random() * 80 + 95)
    };

    setAuditLogs(prev => [newLogEntry, ...prev]);
    setIsExecutingAction(false);
    setPendingAction(null);

    return newLogEntry;
  };

  // Batch Recovery Execution
  const triggerBatchRecovery = async (): Promise<number> => {
    const recoverable = recoveryItems.filter(i => i.status === 'recoverable');
    let totalRecovered = 0;

    for (const item of recoverable) {
      await executeAction(item.recommendedAction, 'MERCURY Copilot (AI)');
      totalRecovered += item.amount;
    }

    return totalRecovered;
  };

  // Webhook Simulator for Razorpay Test Sandbox
  const triggerWebhookSimulation = (eventType: 'payment.failed' | 'payment.captured' | 'refund.created' | 'dispute.created' | 'settlement.delayed') => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const now = 'Just now';

    if (eventType === 'payment.failed') {
      const newFailedPayment: RecoveryItem = {
        id: `rec_sim_${randomId}`,
        paymentId: `pay_sim_${randomId}`,
        customerName: 'Kavita Menon',
        customerEmail: 'kavita.m@gmail.com',
        customerPhone: '+91 98331 99120',
        amount: 6499,
        failedAt: now,
        failureCode: 'GATEWAY_ERROR_ISSUER_DOWN',
        failureReason: 'ICICI Bank 3DS OTP Gateway Gateway Unreachable',
        failureCategory: 'bank_downtime',
        recoveryStrategy: 'Smart WhatsApp Payment Link with 10-minute hold',
        recoveryProbability: 86,
        status: 'recoverable',
        attemptsCount: 0,
        recommendedAction: {
          actionId: `act_rec_sim_${randomId}`,
          module: 'recovery',
          title: `Dispatch Recovery Link to Kavita Menon (₹6,499)`,
          description: 'Send automated WhatsApp 1-click retry payment link bypassing bank OTP portal.',
          targetEntityId: `pay_sim_${randomId}`,
          targetEntityType: 'recovery_item',
          impactAmount: 6499,
          riskLevel: 'low',
          requiresApproval: false,
          guardrailChecks: [
            { id: 'g1', ruleName: 'Opt-in Verification', status: 'pass', detail: 'Valid mobile number +91 98331 99120' },
            { id: 'g2', ruleName: 'Cart Inventory Lock', status: 'pass', detail: 'Locked for 15 mins' }
          ],
          deterministicProof: 'Simulated Webhook event: payment.failed received and processed through recovery classifier',
          idempotencyKey: `idem_sim_rec_${randomId}`,
          simulatedOutcome: 'Dispatches instant recovery link; estimated 86% recovery rate.',
          payload: { paymentId: `pay_sim_${randomId}` }
        }
      };

      setRecoveryItems(prev => [newFailedPayment, ...prev]);

      const newAlert: AnomalyAlert = {
        id: `alt_sim_${randomId}`,
        module: 'recovery',
        severity: 'medium',
        title: 'New Recoverable Payment Detected: ₹6,499',
        description: 'Payment dropped due to ICICI Bank 3DS outage. High intent customer identified.',
        detectedAt: now,
        estimatedImpact: 6499,
        impactLabel: '₹6,499 Recoverable',
        rootCause: 'Bank OTP Server Timeout',
        status: 'active',
        suggestedAction: newFailedPayment.recommendedAction
      };

      setAlerts(prev => [newAlert, ...prev]);
    } else if (eventType === 'dispute.created') {
      const newRiskCluster: RiskCluster = {
        id: `risk_sim_${randomId}`,
        clusterType: 'suspicious_refund_burst',
        severity: 'high',
        title: 'New Chargeback Notice Received (₹12,800)',
        description: 'Dispute filed under reason code 4837 (Fraudulent Transaction / Cardholder unrecognized).',
        riskScore: 89,
        detectedAt: now,
        transactionCount: 1,
        totalExposure: 12800,
        associatedTransactions: [`pay_disp_${randomId}`],
        entityValue: 'Dispute Case #DISP-99214',
        explanation: 'Customer bank filed chargeback. MERCURY detected valid AWB delivery confirmation and 3DS OTP signature.',
        evidence: [
          { label: '3DS Verification', value: 'Authenticated with Bank SMS OTP' },
          { label: 'Delivery Proof', value: 'Signed proof of delivery from BlueDart #88129' },
          { label: 'Customer IP', value: 'Consistent with past 3 order IPs' }
        ],
        status: 'active',
        recommendedAction: {
          actionId: `act_defend_disp_${randomId}`,
          module: 'risk',
          title: 'Auto-Submit Chargeback Evidence Packet to Razorpay Dispute Desk',
          description: 'Bundle 3DS OTP telemetry + Signed Proof of Delivery to win chargeback representation.',
          targetEntityId: `risk_sim_${randomId}`,
          targetEntityType: 'risk_cluster',
          impactAmount: 12800,
          riskLevel: 'low',
          requiresApproval: false,
          guardrailChecks: [
            { id: 'g1', ruleName: 'Dispute Filing Window', status: 'pass', detail: 'T-7 days remaining to respond' },
            { id: 'g2', ruleName: 'Evidence Completeness', status: 'pass', detail: '100% required fields attached' }
          ],
          deterministicProof: 'Rule: IF 3DS_authenticated = true AND signed_pod = true THEN auto_submit_chargeback_defense()',
          idempotencyKey: `idem_disp_${randomId}`,
          simulatedOutcome: 'Submits representation packet; 94% historical win rate.',
          payload: { disputeId: `DISP-${randomId}` }
        }
      };

      setRiskClusters(prev => [newRiskCluster, ...prev]);
    } else if (eventType === 'settlement.delayed') {
      const newExc: ReconciliationException = {
        id: `exc_sim_${randomId}`,
        orderId: `ORD-SIM-${randomId}`,
        paymentId: `pay_sim_${randomId}`,
        gateway: 'Razorpay / HDFC UPI',
        discrepancyType: 'delayed_settlement',
        discrepancyAmount: 9450,
        internalAmount: 9450,
        gatewayAmount: 9450,
        settlementAmount: 0,
        detectedAt: now,
        likelyCause: 'Bank nodal account payout queue delayed due to weekend clearing window.',
        status: 'open',
        recommendedAction: {
          actionId: `act_settle_sim_${randomId}`,
          module: 'finance',
          title: 'Monitor & Reconcile T+1 Bank Payout',
          description: 'Subscribe to nodal settlement ledger notification for ORD-SIM-' + randomId,
          targetEntityId: `exc_sim_${randomId}`,
          targetEntityType: 'reconciliation_item',
          impactAmount: 9450,
          riskLevel: 'low',
          requiresApproval: false,
          guardrailChecks: [
            { id: 'g1', ruleName: 'Nodal Balance Check', status: 'pass', detail: 'Funds held in escrow confirmed' }
          ],
          deterministicProof: 'Escrow ref #NODAL-9921 confirmed payout scheduled for next banking batch',
          idempotencyKey: `idem_sim_exc_${randomId}`,
          simulatedOutcome: 'Reconciles transaction upon bank UTR confirmation.',
          payload: { exceptionId: `exc_sim_${randomId}` }
        }
      };

      setReconciliationExceptions(prev => [newExc, ...prev]);
    }
  };

  return (
    <MerchantContext.Provider
      value={{
        activeModule,
        setActiveModule,
        profile,
        setProfile,
        metrics,
        alerts,
        recoveryItems,
        riskClusters,
        reconciliationExceptions,
        growthOpportunities,
        auditLogs,
        transactions,
        copilotMessages,
        isCopilotThinking,
        sendCopilotQuery,
        pendingAction,
        setPendingAction,
        isExecutingAction,
        executeAction,
        dismissAlert,
        triggerBatchRecovery,
        triggerWebhookSimulation,
        selectedTimeframe,
        setSelectedTimeframe,
        formatCurrency
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
};

export const useMerchant = () => {
  const context = useContext(MerchantContext);
  if (!context) {
    throw new Error('useMerchant must be used within a MerchantProvider');
  }
  return context;
};
