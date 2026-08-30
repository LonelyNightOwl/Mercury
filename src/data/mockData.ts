import {
  MerchantProfile,
  MetricSummary,
  AnomalyAlert,
  RecoveryItem,
  RiskCluster,
  ReconciliationException,
  GrowthOpportunity,
  AuditLogEntry,
  Transaction
} from '../types';

export const INITIAL_MERCHANT_PROFILE: MerchantProfile = {
  id: 'mer_rc_99214',
  name: 'Nexus Retail & Direct Global',
  businessCategory: 'D2C Consumer & Digital Subscriptions',
  environment: 'test',
  currency: 'INR',
  razorpayKeyId: 'rzp_test_nx8481944kM',
  webhookStatus: 'connected',
  autoRecoveryEnabled: true,
  maxAutoRefundLimit: 5000,
};

export const INITIAL_METRICS: MetricSummary = {
  totalRevenue: 14824500, // ₹1.48 Cr
  totalRevenueDelta: -6.4,
  revenueAtRisk: 1428000,  // ₹14.28 Lakhs
  revenueAtRiskDelta: +18.2,
  revenueRecovered: 892400, // ₹8.92 Lakhs
  revenueRecoveredDelta: +34.5,
  paymentSuccessRate: 84.6, // 84.6%
  successRateDelta: -3.8,
  reconciliationRate: 98.2, // 98.2%
  reconciliationRateDelta: +0.4,
  riskAlertCount: 3,
  openExceptionsCount: 4,
  recentActionCount: 14,
  transactionCount: 4280,
};

export const INITIAL_ANOMALY_ALERTS: AnomalyAlert[] = [
  {
    id: 'alt_rev_001',
    module: 'revenue',
    severity: 'high',
    title: 'HDFC Netbanking 28.4% Success Rate Dip',
    description: 'Sudden degradation in HDFC Bank gateway processing between 14:00 - 16:30 IST. 62 consecutive payment drops detected.',
    detectedAt: '28 mins ago',
    estimatedImpact: 345000,
    impactLabel: '₹3,45,000 Volume at Risk',
    rootCause: 'Issuer Bank Netbanking 3DS callback timeout (HTTP 504 on bank end).',
    status: 'active',
    suggestedAction: {
      actionId: 'act_route_hdfc',
      module: 'revenue',
      title: 'Enable Dynamic Routing to Aggregator Backup',
      description: 'Automatically reroute HDFC Netbanking traffic through alternate secondary acquiring node.',
      targetEntityId: 'gateway_hdfc_nb',
      targetEntityType: 'growth_config',
      impactAmount: 345000,
      riskLevel: 'low',
      requiresApproval: false,
      guardrailChecks: [
        { id: 'g1', ruleName: 'Gateway Uptime Threshold', status: 'pass', detail: 'Secondary node latency < 450ms' },
        { id: 'g2', ruleName: 'Cost per Tx Variance', status: 'pass', detail: 'Fee differential 0.00% (standard 1.85%)' },
        { id: 'g3', ruleName: 'Rollback Capability', status: 'pass', detail: 'Auto-reverts once HDFC health score > 92%' }
      ],
      deterministicProof: 'Rule: IF gateway_success_rate < 70% FOR 15m THEN trigger_failover_routing(secondary_aggregator_node)',
      idempotencyKey: 'idem_route_hdfc_20260830',
      simulatedOutcome: 'Recovers estimated 82% of dropped transactions (+₹2,82,900 revenue).',
      payload: { gateway: 'hdfc_netbanking', action: 'failover_switch' }
    }
  },
  {
    id: 'alt_risk_002',
    module: 'risk',
    severity: 'high',
    title: 'Velocity Card Testing Attack (BIN 411111)',
    description: '48 micro-transactions (₹99 - ₹199) attempted within 7 minutes from 3 related VPN IPs across Russian and Bulgarian ASN ranges.',
    detectedAt: '1 hour ago',
    estimatedImpact: 96000,
    impactLabel: 'Risk Score: 94/100 (Critical)',
    rootCause: 'Automated brute-force card validation bot attacking checkout endpoint.',
    status: 'active',
    suggestedAction: {
      actionId: 'act_block_ip_bin',
      module: 'risk',
      title: 'Enforce Step-Up CAPTCHA & Block High-Risk IP Subnet',
      description: 'Quarantine CIDR block 185.220.101.0/24 and mandate Cloudflare Turnstile on guest checkout.',
      targetEntityId: 'risk_cluster_001',
      targetEntityType: 'risk_cluster',
      impactAmount: 96000,
      riskLevel: 'medium',
      requiresApproval: true,
      guardrailChecks: [
        { id: 'g1', ruleName: 'Legitimate User Impact Check', status: 'pass', detail: '0 historical legitimate customers in subnet' },
        { id: 'g2', ruleName: 'Anti-False-Positive Filter', status: 'pass', detail: 'Whitelist active for verified registered users' },
        { id: 'g3', ruleName: 'Chargeback Exposure Limit', status: 'pass', detail: 'Prevents potential ₹35,000 dispute fees' }
      ],
      deterministicProof: 'Rule: IF tx_count > 20 in 10min AND avg_amount < 250 AND ip_proxy = true THEN flag_attack_cluster()',
      idempotencyKey: 'idem_block_risk_cluster_001',
      simulatedOutcome: 'Immediately blocks 48 bot attempts and zeroes chargeback liability.',
      payload: { clusterId: 'risk_cluster_001', action: 'quarantine_subnet' }
    }
  },
  {
    id: 'alt_fin_003',
    module: 'finance',
    severity: 'medium',
    title: '4 Uncaptured Authorizations Near Auto-Void (₹78,400)',
    description: 'Authorized credit card transactions from high-value orders have been pending capture for 4.8 days (Auto-voids at 5.0 days).',
    detectedAt: '3 hours ago',
    estimatedImpact: 78400,
    impactLabel: '₹78,400 at Risk of Expiration',
    rootCause: 'ERP fulfillment sync delay caused authorization capture webhook to stall.',
    status: 'active',
    suggestedAction: {
      actionId: 'act_auto_capture_batch',
      module: 'finance',
      title: 'Deterministic Auto-Capture 4 Verified Orders',
      description: 'Trigger Razorpay API payment capture for verified shipped order IDs (ORD-8942, ORD-8945, ORD-8951, ORD-8958).',
      targetEntityId: 'batch_uncaptured_4',
      targetEntityType: 'batch',
      impactAmount: 78400,
      riskLevel: 'low',
      requiresApproval: false,
      guardrailChecks: [
        { id: 'g1', ruleName: 'Order Fulfillment Verified', status: 'pass', detail: 'Waybills generated in Delhivery & BlueDart' },
        { id: 'g2', ruleName: 'Authorization Expiry Window', status: 'pass', detail: 'Auth status ACTIVE (T-4 hours before auto-void)' },
        { id: 'g3', ruleName: 'Zero-Double-Charge Guarantee', status: 'pass', detail: 'Idempotent capture key validated' }
      ],
      deterministicProof: 'Rule: IF auth_age > 4d AND shipment_confirmed = true AND status = authorized THEN execute_capture()',
      idempotencyKey: 'idem_capture_batch_78400',
      simulatedOutcome: 'Secures ₹78,400 settlement into tomorrow bank transfer cycle.',
      payload: { orders: ['ORD-8942', 'ORD-8945', 'ORD-8951', 'ORD-8958'] }
    }
  }
];

export const INITIAL_RECOVERY_ITEMS: RecoveryItem[] = [
  {
    id: 'rec_001',
    paymentId: 'pay_Nz94kLm82104',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@techcorp.in',
    customerPhone: '+91 98201 44512',
    amount: 14999,
    failedAt: '12 mins ago',
    failureCode: 'GATEWAY_TIMEOUT',
    failureReason: 'HDFC Netbanking 3DS Verification Timed Out',
    failureCategory: 'technical_gateway',
    recoveryStrategy: 'Smart Auto-Retry + Fallback UPI Deep Link',
    recoveryProbability: 92,
    status: 'recoverable',
    attemptsCount: 0,
    recommendedAction: {
      actionId: 'act_rec_001',
      module: 'recovery',
      title: 'Dispatch Instant WhatsApp 1-Click Pay Link & Auto-Retry',
      description: 'Send pre-authenticated personalized payment link via WhatsApp API with 15% incentive token.',
      targetEntityId: 'pay_Nz94kLm82104',
      targetEntityType: 'recovery_item',
      impactAmount: 14999,
      riskLevel: 'low',
      requiresApproval: false,
      guardrailChecks: [
        { id: 'g1', ruleName: 'Cart Stock Hold', status: 'pass', detail: 'Item SKU #9812 reserved in inventory for 2 hours' },
        { id: 'g2', ruleName: 'Communication Consent', status: 'pass', detail: 'WhatsApp opt-in verified during checkout' },
        { id: 'g3', ruleName: 'Duplicate Payment Guard', status: 'pass', detail: 'Auto-expires previous pending payment token' }
      ],
      deterministicProof: 'Recovery score = 0.92 (Based on high intent, past 4 successful purchases, fresh failure < 1h)',
      idempotencyKey: 'idem_rec_pay_Nz94kLm82104',
      simulatedOutcome: 'Customer receives pre-filled checkout link. 92% historical conversion.',
      payload: { paymentId: 'pay_Nz94kLm82104', method: 'whatsapp_intent_dispatch' }
    }
  },
  {
    id: 'rec_002',
    paymentId: 'pay_Px88491k0021',
    customerName: 'Priya Iyer',
    customerEmail: 'priya.iyer@designcraft.co',
    customerPhone: '+91 97114 88390',
    amount: 8500,
    failedAt: '45 mins ago',
    failureCode: 'INSUFFICIENT_FUNDS',
    failureReason: 'Account Balance Exceeded for Debit Mandate',
    failureCategory: 'insufficient_funds',
    recoveryStrategy: 'Smart Scheduled Retry on Salary Cycle (1st of Month)',
    recoveryProbability: 78,
    status: 'recoverable',
    attemptsCount: 1,
    recommendedAction: {
      actionId: 'act_rec_002',
      module: 'recovery',
      title: 'Schedule Smart Recurring Debit Retry & Grace Notice',
      description: 'Queue auto-retry for 09:30 AM tomorrow and extend SaaS access grace period by 48h.',
      targetEntityId: 'pay_Px88491k0021',
      targetEntityType: 'recovery_item',
      impactAmount: 8500,
      riskLevel: 'low',
      requiresApproval: false,
      guardrailChecks: [
        { id: 'g1', ruleName: 'Retry Frequency Limit', status: 'pass', detail: '1 of 3 allowed retries this billing cycle' },
        { id: 'g2', ruleName: 'Customer Disruption Policy', status: 'pass', detail: 'Soft grace period active, no service suspension' }
      ],
      deterministicProof: 'Schedule: T+1 09:30:00 IST when banking transaction success rates peak for debit cards',
      idempotencyKey: 'idem_rec_pay_Px88491k0021',
      simulatedOutcome: 'Queues retry during optimal banking window; 78% expected recovery.',
      payload: { paymentId: 'pay_Px88491k0021', retryAt: '2026-08-31T09:30:00Z' }
    }
  },
  {
    id: 'rec_003',
    paymentId: 'pay_Qr44192m8119',
    customerName: 'Vikramaditya Rao',
    customerEmail: 'vikram.rao@enterprise.in',
    customerPhone: '+91 99401 22918',
    amount: 45000,
    failedAt: '1.5 hours ago',
    failureCode: 'UPI_LIMIT_EXCEEDED',
    failureReason: 'Daily Bank UPI Outflow Limit (₹1,00,000) reached by customer bank',
    failureCategory: 'daily_limit_exceeded',
    recoveryStrategy: 'Switch to Instant Netbanking or Cardless EMI',
    recoveryProbability: 85,
    status: 'recoverable',
    attemptsCount: 0,
    recommendedAction: {
      actionId: 'act_rec_003',
      module: 'recovery',
      title: 'Send Multi-Option Checkout with Cardless EMI / Corporate Netbanking',
      description: 'Trigger email + SMS checkout helper bypassing individual UPI caps with zero-cost EMI option.',
      targetEntityId: 'pay_Qr44192m8119',
      targetEntityType: 'recovery_item',
      impactAmount: 45000,
      riskLevel: 'low',
      requiresApproval: false,
      guardrailChecks: [
        { id: 'g1', ruleName: 'Order Value Threshold', status: 'pass', detail: 'High value order (₹45,000) qualifies for VIP recovery' },
        { id: 'g2', ruleName: 'EMI Eligibility Check', status: 'pass', detail: 'Pre-qualified for 3/6 month no-cost EMI' }
      ],
      deterministicProof: 'Alternative payment methods available for amount ₹45,000 with 0 friction',
      idempotencyKey: 'idem_rec_pay_Qr44192m8119',
      simulatedOutcome: 'Customer guided to alternate payment method; ₹45,000 preserved.',
      payload: { paymentId: 'pay_Qr44192m8119', options: ['cardless_emi', 'corporate_netbanking'] }
    }
  },
  {
    id: 'rec_004',
    paymentId: 'pay_Lm11094p8833',
    customerName: 'Ananya Deshmukh',
    customerEmail: 'ananya.d@fincloud.io',
    customerPhone: '+91 98450 11984',
    amount: 1999,
    failedAt: '3 hours ago',
    failureCode: 'USER_DROPPED_OTP',
    failureReason: 'Abandoned on Bank 3DS OTP Page',
    failureCategory: 'user_dropped_3ds',
    recoveryStrategy: 'Automated 1-Click UPI Intent Push Notification',
    recoveryProbability: 88,
    status: 'recoverable',
    attemptsCount: 0,
    recommendedAction: {
      actionId: 'act_rec_004',
      module: 'recovery',
      title: 'Trigger Direct UPI Intent App Push (GPay / PhonePe)',
      description: 'Push seamless 1-tap authorization prompt directly to customer UPI app.',
      targetEntityId: 'pay_Lm11094p8833',
      targetEntityType: 'recovery_item',
      impactAmount: 1999,
      riskLevel: 'low',
      requiresApproval: false,
      guardrailChecks: [
        { id: 'g1', ruleName: 'Device Push Notification Token', status: 'pass', detail: 'Active FCM token verified' },
        { id: 'g2', ruleName: 'Drop-off Window', status: 'pass', detail: 'Triggered within optimal 1-4 hour window' }
      ],
      deterministicProof: 'UPI Intent conversion is 4.2x higher than manual OTP entry',
      idempotencyKey: 'idem_rec_pay_Lm11094p8833',
      simulatedOutcome: '1-tap authorization sent to user device.',
      payload: { paymentId: 'pay_Lm11094p8833', channel: 'upi_intent_push' }
    }
  }
];

export const INITIAL_RISK_CLUSTERS: RiskCluster[] = [
  {
    id: 'risk_cluster_001',
    clusterType: 'card_testing_velocity',
    severity: 'critical',
    title: 'Automated Card Testing Velocity Wave',
    description: '48 micro-transactions from ASN 13335 / IP range 185.220.101.* using randomized cardholder names on Visa BIN 411111.',
    riskScore: 96,
    detectedAt: '42 mins ago',
    transactionCount: 48,
    totalExposure: 9600,
    associatedTransactions: ['pay_tst_01', 'pay_tst_02', 'pay_tst_03', 'pay_tst_04'],
    entityValue: 'CIDR 185.220.101.0/24 (Tor Exit Node)',
    explanation: 'Rapid successive card authorization attempts with identical billing postal codes but mismatching CVVs indicate scripted carding activity.',
    evidence: [
      { label: 'Time Window', value: '48 requests in 380 seconds' },
      { label: 'CVV Mismatch Rate', value: '91.6%' },
      { label: 'IP Reputation', value: 'Known Tor exit node & VPN proxy' },
      { label: 'Device Fingerprint', value: 'Headless Chrome / Puppeteer script' }
    ],
    status: 'active',
    recommendedAction: {
      actionId: 'act_risk_quarantine_001',
      module: 'risk',
      title: 'Quarantine CIDR Subnet & Enable Strict Velocity Rule',
      description: 'Add 185.220.101.0/24 to MERCURY firewall blocklist and cap guest attempts to 3 per hour.',
      targetEntityId: 'risk_cluster_001',
      targetEntityType: 'risk_cluster',
      impactAmount: 9600,
      riskLevel: 'high',
      requiresApproval: true,
      guardrailChecks: [
        { id: 'g1', ruleName: 'CIDR Scope Limitation', status: 'pass', detail: 'Target restricted to /24 subnetwork only' },
        { id: 'g2', ruleName: 'Zero Registered User Impact', status: 'pass', detail: '0 past legitimate accounts originated from subnet' },
        { id: 'g3', ruleName: 'Audit Trail Enforced', status: 'pass', detail: 'Digital sign-off hash logged to ledger' }
      ],
      deterministicProof: 'Attack signature: 48 hits / 380s > threshold(5 hits / 60s) AND Tor = true',
      idempotencyKey: 'idem_quarantine_risk_001',
      simulatedOutcome: 'Blocks all incoming automated testing and neutralizes gateway chargeback risk.',
      payload: { clusterId: 'risk_cluster_001', action: 'firewall_quarantine' }
    }
  },
  {
    id: 'risk_cluster_002',
    clusterType: 'suspicious_refund_burst',
    severity: 'high',
    title: 'Suspicious Repeated Refund Abuse',
    description: '3 accounts created with disposable email domains (mailinator.com, guerrillamail.com) requested instant refunds on high-ticket digital vouchers (₹24,500).',
    riskScore: 82,
    detectedAt: '2 hours ago',
    transactionCount: 3,
    totalExposure: 24500,
    associatedTransactions: ['pay_ref_ab_01', 'pay_ref_ab_02', 'pay_ref_ab_03'],
    entityValue: 'Domain @mailinator.com / Disposable Vouchers',
    explanation: 'Digital product download tokens were accessed and redeemed prior to requesting instant refund under false claims.',
    evidence: [
      { label: 'Product Access', value: 'Voucher code downloaded 4 mins after purchase' },
      { label: 'Email Domain', value: 'Disposable temporary inbox' },
      { label: 'Device ID', value: 'Shared canvas fingerprint across 3 user IDs' }
    ],
    status: 'active',
    recommendedAction: {
      actionId: 'act_hold_refund_002',
      module: 'risk',
      title: 'Hold Pending Refund & Require Identity Verification',
      description: 'Freeze automatic refund payout pending secondary fraud review and notify merchant ops team.',
      targetEntityId: 'risk_cluster_002',
      targetEntityType: 'risk_cluster',
      impactAmount: 24500,
      riskLevel: 'medium',
      requiresApproval: true,
      guardrailChecks: [
        { id: 'g1', ruleName: 'Consumer Protection Law Window', status: 'pass', detail: 'Holds refund under 48h investigation clause' },
        { id: 'g2', ruleName: 'Proof of Digital Delivery', status: 'pass', detail: 'Server access logs attached to case' }
      ],
      deterministicProof: 'Voucher redemption timestamp (14:12:05) < Refund request timestamp (14:18:22)',
      idempotencyKey: 'idem_hold_refund_002',
      simulatedOutcome: 'Prevents ₹24,500 fraudulent payout while maintaining regulatory compliance.',
      payload: { clusterId: 'risk_cluster_002', action: 'hold_payout' }
    }
  }
];

export const INITIAL_RECONCILIATION_EXCEPTIONS: ReconciliationException[] = [
  {
    id: 'rec_exc_001',
    orderId: 'ORD-2026-8812',
    paymentId: 'pay_M8821094k1',
    bankUtr: 'HDFC002910488210',
    gateway: 'Razorpay / HDFC PG',
    discrepancyType: 'fee_overcharge',
    discrepancyAmount: 512,
    internalAmount: 50000,
    gatewayAmount: 50000,
    settlementAmount: 48820,
    detectedAt: 'Today 08:30 IST',
    likelyCause: 'Gateway applied standard credit card MDR (2.36% + GST) instead of negotiated Enterprise rate (1.85% + GST).',
    status: 'open',
    recommendedAction: {
      actionId: 'act_claim_fee_001',
      module: 'finance',
      title: 'Auto-Generate Gateway Fee Reimbursement Dispute',
      description: 'File automated reconciliation discrepancy ticket with Razorpay Partner Desk with contract Schedule B proof.',
      targetEntityId: 'rec_exc_001',
      targetEntityType: 'reconciliation_item',
      impactAmount: 512,
      riskLevel: 'low',
      requiresApproval: false,
      guardrailChecks: [
        { id: 'g1', ruleName: 'Contract Rate Matrix Verified', status: 'pass', detail: 'Contract agreed MDR: 1.85%' },
        { id: 'g2', ruleName: 'Calculated Variance Proof', status: 'pass', detail: 'Deterministic math: (2.36% - 1.85%) * ₹50,000 + GST = ₹512' }
      ],
      deterministicProof: 'Fee Charged: ₹1,180. Expected Fee: ₹668. Delta: +₹512 overcharge.',
      idempotencyKey: 'idem_claim_fee_rec_exc_001',
      simulatedOutcome: 'Generates dispute packet and claims ₹512 refund credit to next settlement cycle.',
      payload: { exceptionId: 'rec_exc_001', claimAmount: 512 }
    }
  },
  {
    id: 'rec_exc_002',
    orderId: 'ORD-2026-8790',
    paymentId: 'pay_L7741094m2',
    bankUtr: 'AXIS009918237719',
    gateway: 'Razorpay / Axis UPI',
    discrepancyType: 'delayed_settlement',
    discrepancyAmount: 18500,
    internalAmount: 18500,
    gatewayAmount: 18500,
    settlementAmount: 0,
    detectedAt: 'Yesterday 18:00 IST',
    likelyCause: 'Settlement cycle T+1 delayed due to national banking holiday clearing queue.',
    status: 'open',
    recommendedAction: {
      actionId: 'act_track_settlement_002',
      module: 'finance',
      title: 'Flag for Automated T+2 Clearing Verification',
      description: 'Subscribe to Axis Bank NPCI clearing webhook and monitor next settlement batch at 11:00 AM.',
      targetEntityId: 'rec_exc_002',
      targetEntityType: 'reconciliation_item',
      impactAmount: 18500,
      riskLevel: 'low',
      requiresApproval: false,
      guardrailChecks: [
        { id: 'g1', ruleName: 'Transaction Status Check', status: 'pass', detail: 'Payment CAPTURED, zero chargeback holds' }
      ],
      deterministicProof: 'Order ₹18,500 captured on 2026-08-28. Bank clearing latency = 36h (Holiday buffer)',
      idempotencyKey: 'idem_track_settlement_002',
      simulatedOutcome: 'Auto-reconciles once settlement UTR is received in tomorrow clearing file.',
      payload: { exceptionId: 'rec_exc_002' }
    }
  },
  {
    id: 'rec_exc_003',
    orderId: 'ORD-2026-8742',
    paymentId: 'pay_K6621094p9',
    bankUtr: 'ICIC001928471190',
    gateway: 'Razorpay / ICICI Cards',
    discrepancyType: 'uncaptured_authorization',
    discrepancyAmount: 24999,
    internalAmount: 24999,
    gatewayAmount: 24999,
    settlementAmount: 0,
    detectedAt: '2 days ago',
    likelyCause: 'Payment authorized successfully by buyer but merchant order management system missed final capture call.',
    status: 'open',
    recommendedAction: {
      actionId: 'act_capture_single_003',
      module: 'finance',
      title: 'Execute Immediate Deterministic Capture (₹24,999)',
      description: 'Call Razorpay Payment Capture API to secure funds before authorization expires in 4 hours.',
      targetEntityId: 'rec_exc_003',
      targetEntityType: 'reconciliation_item',
      impactAmount: 24999,
      riskLevel: 'low',
      requiresApproval: false,
      guardrailChecks: [
        { id: 'g1', ruleName: 'Inventory & Shipping Verified', status: 'pass', detail: 'Delivered to customer via Bluedart tracking #91823' },
        { id: 'g2', ruleName: 'Authorization Active Window', status: 'pass', detail: 'Expires in 4h 12m' }
      ],
      deterministicProof: 'Status = authorized, capture_deadline = 2026-08-30T14:30:00Z',
      idempotencyKey: 'idem_capture_rec_exc_003',
      simulatedOutcome: 'Immediately converts authorized payment to captured; locks ₹24,999 revenue.',
      payload: { paymentId: 'pay_K6621094p9', amount: 24999 }
    }
  },
  {
    id: 'rec_exc_004',
    orderId: 'ORD-2026-8610',
    paymentId: 'pay_J551094q33',
    gateway: 'Razorpay / PhonePe UPI',
    discrepancyType: 'double_debit_refund_mismatch',
    discrepancyAmount: 3200,
    internalAmount: 3200,
    gatewayAmount: 6400,
    settlementAmount: 3200,
    detectedAt: '3 days ago',
    likelyCause: 'Customer was double-debited by issuing bank on network glitch; 1 transaction auto-refunded by NPCI but not matched to internal order ledger.',
    status: 'open',
    recommendedAction: {
      actionId: 'act_match_refund_004',
      module: 'finance',
      title: 'Auto-Link NPCI Return Reference to Customer Ledger',
      description: 'Deterministic 1-click ledger balancing linking NPCI RRN #32910488 to order cancellation record.',
      targetEntityId: 'rec_exc_004',
      targetEntityType: 'reconciliation_item',
      impactAmount: 3200,
      riskLevel: 'low',
      requiresApproval: false,
      guardrailChecks: [
        { id: 'g1', ruleName: 'RRN Matching Confidence', status: 'pass', detail: '100% hash match on bank reference code' },
        { id: 'g2', ruleName: 'Zero Customer Balance Impact', status: 'pass', detail: 'Refund already credited to customer bank account' }
      ],
      deterministicProof: 'Bank RRN #32910488 matches internal cancellation ticket TKT-8841',
      idempotencyKey: 'idem_match_refund_004',
      simulatedOutcome: 'Clears unlinked debit exception and brings reconciliation score to 99.1%.',
      payload: { exceptionId: 'rec_exc_004' }
    }
  }
];

export const INITIAL_GROWTH_OPPORTUNITIES: GrowthOpportunity[] = [
  {
    id: 'gro_001',
    title: 'Enable Seamless UPI Intent Deep-Linking Over UPI Collect',
    category: 'checkout_ux',
    potentialRevenueLift: 420000,
    conversionLiftPercentage: 8.4,
    confidenceScore: 94,
    dropOffStage: 'Payment App Switch (OTP / VPA Entry)',
    description: 'UPI Collect (entering @upi ID manually) suffers a 26.2% drop-off due to notification lag and typos. Enabling native UPI Intent (direct launch of GPay/PhonePe) increases conversion from 73.8% to 88.5%.',
    actionableSteps: [
      'Upgrade Razorpay Standard Checkout SDK to enable Native Intent Turbo UPI mode',
      'Pre-detect installed UPI apps on customer device',
      'Remove manual VPA input requirement on mobile browsers'
    ],
    status: 'available',
    recommendedAction: {
      actionId: 'act_growth_enable_turbo_upi',
      module: 'growth',
      title: 'Activate Turbo UPI Intent Optimization in Checkout Config',
      description: 'Switch default mobile checkout flow to Native UPI Intent deep linking.',
      targetEntityId: 'checkout_flow_mobile',
      targetEntityType: 'growth_config',
      impactAmount: 420000,
      riskLevel: 'low',
      requiresApproval: false,
      guardrailChecks: [
        { id: 'g1', ruleName: 'Browser Compatibility', status: 'pass', detail: 'Supported on iOS Safari & Android Chrome' },
        { id: 'g2', ruleName: 'A/B Test Safety Guard', status: 'pass', detail: '50/50 gradual traffic ramp with automatic fallback' }
      ],
      deterministicProof: 'Historical test data shows 14.7% higher completion rate with 0 additional fee',
      idempotencyKey: 'idem_growth_turbo_upi',
      simulatedOutcome: 'Estimated +₹4,20,000 monthly revenue from saved drop-offs.',
      payload: { feature: 'turbo_upi', config: { default_method: 'intent' } }
    }
  },
  {
    id: 'gro_002',
    title: 'Introduce 0-Cost Cardless EMI on Orders Above ₹8,000',
    category: 'payment_methods',
    potentialRevenueLift: 680000,
    conversionLiftPercentage: 14.2,
    confidenceScore: 89,
    dropOffStage: 'Payment Method Selection on High-Value Carts',
    description: 'Carts between ₹8,000 - ₹35,000 have a 38% abandonment rate due to single-payment liquidity constraints. Offering Cardless EMI (ZestMoney, EarlySalary, HDFC FlexiPay) unblocks high-ticket buyers.',
    actionableSteps: [
      'Enable Razorpay Cardless EMI aggregator partners in merchant settings',
      'Display "EMI starting at ₹1,499/mo" widget on product & cart pages',
      'Offer 3-month no-cost EMI subsidy subsidized by 1.2% merchant subvention'
    ],
    status: 'available',
    recommendedAction: {
      actionId: 'act_growth_enable_emi',
      module: 'growth',
      title: 'Turn On Cardless EMI & Affordability Widget',
      description: 'Activate Cardless EMI partners and display pre-approved monthly breakdown widget.',
      targetEntityId: 'affordability_suite',
      targetEntityType: 'growth_config',
      impactAmount: 680000,
      riskLevel: 'low',
      requiresApproval: false,
      guardrailChecks: [
        { id: 'g1', ruleName: 'Margin Protection', status: 'pass', detail: 'Order margin > 22% satisfies 1.2% subvention cost' },
        { id: 'g2', ruleName: 'Credit Partner Availability', status: 'pass', detail: 'Covers 85% of Indian credit-active smartphone base' }
      ],
      deterministicProof: 'Average Order Value projected to rise from ₹4,200 to ₹7,850',
      idempotencyKey: 'idem_growth_enable_emi',
      simulatedOutcome: 'Unlocks ₹6,80,000 in incremental high-ticket conversions.',
      payload: { feature: 'cardless_emi', minAmount: 8000 }
    }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud_9921',
    timestamp: 'Today 10:04:12 IST',
    actor: 'MERCURY Copilot (AI)',
    module: 'recovery',
    actionType: 'TRIGGER_WHATSAPP_PAY_LINK',
    title: 'Dispatched Personalized Recovery Link (ORD-9102)',
    description: 'Sent 1-click pre-filled checkout link for failed ₹8,999 transaction. Policy guardrail verified.',
    status: 'verified_success',
    targetEntityId: 'pay_9102_rc',
    financialImpact: 8999,
    guardrailsEvaluated: 3,
    deterministicProof: 'SHA256(pay_9102_rc + token_auth + rule_92) = 8f9b...a12c',
    verificationHash: '0x8f9ba12ce8920401b8492019488a09f',
    executionLatencyMs: 142
  },
  {
    id: 'aud_9920',
    timestamp: 'Today 09:41:00 IST',
    actor: 'Policy Automation',
    module: 'revenue',
    actionType: 'GATEWAY_FAILOVER_TRIGGER',
    title: 'Auto-Rerouted Axis Netbanking Traffic to Secondary Node',
    description: 'Triggered failover after Axis success rate dipped below 65% for 12 continuous minutes.',
    status: 'verified_success',
    targetEntityId: 'gateway_axis_nb',
    financialImpact: 142000,
    guardrailsEvaluated: 4,
    deterministicProof: 'Condition: failure_rate(0.38) > threshold(0.35) triggered deterministic routing switch',
    verificationHash: '0x3841e9821aa0909fbc88310029bca18',
    executionLatencyMs: 88
  },
  {
    id: 'aud_9919',
    timestamp: 'Today 08:15:22 IST',
    actor: 'Merchant (Manual)',
    module: 'risk',
    actionType: 'FIREWALL_IP_BLOCKLIST',
    title: 'Quarantined Tor Exit Node 185.220.101.44',
    description: 'Manual review and quarantine approval after Copilot flagged 48 rapid card testing transactions.',
    status: 'verified_success',
    targetEntityId: 'risk_cluster_001',
    financialImpact: 96000,
    guardrailsEvaluated: 3,
    deterministicProof: 'Approved by admin prathamesh@mercury with 2FA OTP verification',
    verificationHash: '0x7741bcde992010948ac0194881726a1',
    executionLatencyMs: 310
  },
  {
    id: 'aud_9918',
    timestamp: 'Yesterday 21:30:15 IST',
    actor: 'MERCURY Copilot (AI)',
    module: 'finance',
    actionType: 'RECONCILIATION_DISPUTE_CLAIM',
    title: 'Auto-Filed Schedule B Fee Overcharge Ticket (₹1,240)',
    description: 'Submitted deterministic rate mismatch proof to acquiring bank settlement dispute portal.',
    status: 'verified_success',
    targetEntityId: 'rec_exc_old_88',
    financialImpact: 1240,
    guardrailsEvaluated: 3,
    deterministicProof: 'Contract MDR = 1.85%, billed MDR = 2.36%. Variance = ₹1,240. Proof attached.',
    verificationHash: '0x1192847cbb001928471190acbe88910',
    executionLatencyMs: 195
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'pay_Nz94kLm82104',
    orderId: 'ORD-2026-9104',
    amount: 14999,
    currency: 'INR',
    status: 'failed',
    method: 'netbanking',
    gateway: 'Razorpay / HDFC PG',
    issuerBank: 'HDFC Bank',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@techcorp.in',
    customerPhone: '+91 98201 44512',
    failureReason: 'HDFC Netbanking 3DS Verification Timed Out',
    failureCategory: 'technical_gateway',
    failureCode: 'GATEWAY_TIMEOUT',
    riskScore: 12,
    settlementStatus: 'unreconciled',
    feeCharged: 0,
    expectedFee: 277.48,
    createdAt: '12 mins ago'
  },
  {
    id: 'pay_Suc99104812',
    orderId: 'ORD-2026-9103',
    amount: 3499,
    currency: 'INR',
    status: 'captured',
    method: 'upi_intent',
    gateway: 'Razorpay / PhonePe',
    issuerBank: 'State Bank of India',
    customerName: 'Rohit Kulkarni',
    customerEmail: 'rohit.kulkarni@gmail.com',
    customerPhone: '+91 99881 22345',
    riskScore: 8,
    settlementStatus: 'pending',
    feeCharged: 0,
    expectedFee: 0,
    createdAt: '18 mins ago'
  },
  {
    id: 'pay_Suc99104811',
    orderId: 'ORD-2026-9102',
    amount: 28500,
    currency: 'INR',
    status: 'captured',
    method: 'card_credit',
    gateway: 'Razorpay / ICICI Cards',
    issuerBank: 'ICICI Bank',
    customerName: 'Meera Nambiar',
    customerEmail: 'meera.n@consulting.com',
    customerPhone: '+91 98401 77219',
    riskScore: 14,
    settlementStatus: 'pending',
    feeCharged: 527.25,
    expectedFee: 527.25,
    createdAt: '25 mins ago'
  },
  {
    id: 'pay_Px88491k0021',
    orderId: 'ORD-2026-9101',
    amount: 8500,
    currency: 'INR',
    status: 'failed',
    method: 'card_debit',
    gateway: 'Razorpay / Axis PG',
    issuerBank: 'Axis Bank',
    customerName: 'Priya Iyer',
    customerEmail: 'priya.iyer@designcraft.co',
    customerPhone: '+91 97114 88390',
    failureReason: 'Account Balance Exceeded for Debit Mandate',
    failureCategory: 'insufficient_funds',
    failureCode: 'INSUFFICIENT_FUNDS',
    riskScore: 22,
    settlementStatus: 'unreconciled',
    feeCharged: 0,
    expectedFee: 157.25,
    createdAt: '45 mins ago'
  },
  {
    id: 'pay_Qr44192m8119',
    orderId: 'ORD-2026-9100',
    amount: 45000,
    currency: 'INR',
    status: 'failed',
    method: 'upi_collect',
    gateway: 'Razorpay / GPay',
    issuerBank: 'Kotak Mahindra Bank',
    customerName: 'Vikramaditya Rao',
    customerEmail: 'vikram.rao@enterprise.in',
    customerPhone: '+91 99401 22918',
    failureReason: 'Daily Bank UPI Outflow Limit reached',
    failureCategory: 'daily_limit_exceeded',
    failureCode: 'UPI_LIMIT_EXCEEDED',
    riskScore: 18,
    settlementStatus: 'unreconciled',
    feeCharged: 0,
    expectedFee: 0,
    createdAt: '1.5 hours ago'
  },
  {
    id: 'pay_tst_01',
    orderId: 'ORD-2026-9099',
    amount: 149,
    currency: 'INR',
    status: 'failed',
    method: 'card_credit',
    gateway: 'Razorpay / Direct',
    issuerBank: 'US Bank International',
    customerName: 'John Doe Testing',
    customerEmail: 'temp99124@mailinator.com',
    customerPhone: '+91 90000 00000',
    failureReason: 'Card Security Code CVV Invalid',
    failureCategory: 'velocity_risk_block',
    failureCode: 'CARD_SECURITY_VIOLATION',
    riskScore: 98,
    settlementStatus: 'unreconciled',
    feeCharged: 0,
    expectedFee: 2.75,
    createdAt: '42 mins ago'
  }
];
