import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'MERCURY - AI Merchant Intelligence & Action Platform',
    environment: process.env.NODE_ENV || 'development',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// MERCURY Copilot AI Reasoning API
app.post('/api/copilot', async (req, res) => {
  try {
    const { message, contextSnapshot } = req.body;
    const client = getGeminiClient();

    if (client) {
      const systemInstruction = `
You are MERCURY Copilot, the AI Merchant Intelligence & Action Platform for merchants using payment platforms such as Razorpay.
Tagline: "One AI operating layer for a merchant's money."

CORE ARCHITECTURAL PRINCIPLES:
1. AI reasons and interprets data, but deterministic code handles calculations and financial operations.
2. Never allow the AI model to directly perform unrestricted financial actions.
3. All proposed actions must pass through a policy/guardrail layer.
4. Every action must be logged in an immutable audit trail.
5. Actions should be verified after execution with deterministic proof.

MERCHANT CONTEXT SNAPSHOT:
Total Revenue: ₹1,48,24,500 (down -6.4% due to HDFC netbanking drop)
Revenue at Risk: ₹14,28,000
Revenue Recovered: ₹8,92,400 (+34.5%)
Payment Success Rate: 84.6% (Standard baseline is 88.4%)
Reconciliation Rate: 98.2% (4 open exceptions totaling ₹47,211)
Active Risk Clusters: 
- 1. Card Testing Attack (48 micro-transactions from Tor ASN 13335, BIN 411111)
- 2. Suspicious Repeat Refund Abuse (3 digital voucher accounts with @mailinator.com)
Recoverable Payments:
- 1. Aarav Sharma ₹14,999 (HDFC Netbanking 3DS timeout -> 92% recoverable via WhatsApp 1-Click Pay Link)
- 2. Priya Iyer ₹8,500 (Debit Mandate Insufficient Funds -> 78% recoverable via Scheduled Salary Cycle Retry)
- 3. Vikramaditya Rao ₹45,000 (UPI Daily Cap ₹1L exceeded -> 85% recoverable via Cardless EMI / Corporate NB)
- 4. Ananya Deshmukh ₹1,999 (OTP drop -> 88% recoverable via UPI Intent App Push)

SPECIALIST CAPABILITY ROUTING:
Identify the merchant query intent and route to the corresponding specialist:
- Revenue Specialist (revenue changes, gateway outages, method performance)
- Recovery Agent (failed payments, abandoned carts, smart retries)
- Risk Analyst (suspicious transactions, velocity attacks, refund abuse, chargeback defense)
- Reconciliation Officer (order-payment-settlement mismatch, fee variance, uncaptured funds)
- Growth Advisor (checkout conversion, Turbo UPI intent, Cardless EMI)

Respond in a clear, professional fintech voice with markdown formatting. Include:
1. **Specialist Badge** (e.g. 📈 [Revenue Specialist] or 🔄 [Recovery Agent])
2. **Diagnosis & Root Cause**
3. **Deterministic Financial Proof & Impact**
4. **Actionable Guardrail Proposal** (State clearly what guardrail checks are applied)
`;

      const response = await client.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `User Merchant Query: "${message}"\n\nCurrent UI Context: ${JSON.stringify(contextSnapshot || {})}`,
        config: {
          systemInstruction,
          temperature: 0.2, // Low temperature for high precision fintech reasoning
        },
      });

      const responseText = response.text || '';
      return res.json({
        content: responseText,
        source: 'gemini-3.7-flash',
      });
    }

    // High quality deterministic fallback when API key is not present
    return res.json({
      content: generateDeterministicSpecialistResponse(message),
      source: 'deterministic-specialist-engine',
    });
  } catch (error: any) {
    console.error('Error processing MERCURY Copilot request:', error);
    // Graceful fallback to deterministic engine
    const { message } = req.body;
    return res.json({
      content: generateDeterministicSpecialistResponse(message || ''),
      source: 'deterministic-fallback',
      errorNotice: error.message,
    });
  }
});

// Deterministic specialist engine fallback for instant responses
function generateDeterministicSpecialistResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('why') && (q.includes('revenue') || q.includes('fall') || q.includes('drop') || q.includes('yesterday'))) {
    return `### 📈 [Revenue Specialist] Anomaly Decomposition

**Root Cause Identified:**
Your revenue dipped **6.4% (₹9,48,000 below baseline)** yesterday primarily due to two isolated gateway degradation events:

1. **HDFC Netbanking 3DS Timeout (Major Driver - 68% of drop)**
   - **Time Window:** 14:00 - 16:30 IST
   - **Impact:** 62 transactions dropped due to HTTP 504 gateway gateway timeouts on the bank callback node.
   - **Revenue at Risk:** ₹3,45,000.
2. **UPI Collect VPA Drop-off (Secondary Driver - 32% of drop)**
   - Manual @upi ID validation failed for 41 mobile checkout sessions.

**Deterministic Proof:**
\`\`\`
HDFC Success Rate: 89.2% (Norm) ➔ 60.8% (During Anomaly) | Delta: -28.4%
Total Affected Volume: ₹3,45,000 across 62 sessions.
\`\`\`

**Recommended Guardrail-Protected Action:**
- **Action:** *Enable Dynamic Failover Routing to Secondary Aggregator Node*
- **Policy Guardrails:** Latency threshold < 450ms, zero MDR fee variance (1.85% parity), auto-reverts when HDFC health score recovers > 92%.`;
  }

  if (q.includes('recover') || q.includes('failed') || q.includes('abandoned')) {
    return `### 🔄 [Recovery Agent] Actionable Recovery Inventory

MERCURY has classified **4 high-probability failed payments** representing **₹70,498 in recoverable revenue** (Average recovery probability: **85.7%**).

**Priority Recovery Breakdown:**
1. **Aarav Sharma — ₹14,999** (Failed 12m ago | HDFC Netbanking Timeout | *92% Recovery Chance*)
   - *Strategy:* Automated 1-Click WhatsApp Pay-by-link with 15% incentive token.
2. **Vikramaditya Rao — ₹45,000** (Failed 1.5h ago | Daily Bank UPI Cap Exceeded | *85% Recovery Chance*)
   - *Strategy:* Alternative routing via 0-cost Cardless EMI & Corporate Netbanking.
3. **Priya Iyer — ₹8,500** (Failed 45m ago | Insufficient Funds for Mandate | *78% Recovery Chance*)
   - *Strategy:* Scheduled recurring retry queued for 09:30 AM tomorrow.
4. **Ananya Deshmukh — ₹1,999** (Failed 3h ago | Abandoned 3DS OTP | *88% Recovery Chance*)
   - *Strategy:* Direct UPI Intent push notification (GPay/PhonePe).

**Policy Guardrail Validation:**
All 4 items have verified cart stock holds, opt-in communication consent, and duplicate charge protection tokens generated.`;
  }

  if (q.includes('suspicious') || q.includes('risk') || q.includes('fraud') || q.includes('attack') || q.includes('chargeback')) {
    return `### 🛡️ [Risk Analyst] Threat Detection & Cluster Findings

MERCURY Risk Intelligence detected **2 active threat clusters** requiring merchant attention:

1. **Card Testing Velocity Wave (Severity: Critical | Risk Score: 96/100)**
   - **Pattern:** 48 micro-transactions (₹99 - ₹199) in 380 seconds from Tor ASN 13335 (CIDR 185.220.101.0/24).
   - **Target:** Visa BIN 411111 with 91.6% CVV mismatch rate.
   - **Total Exposure:** ₹9,600 (+ ₹35,000 avoided dispute penalty fees).
   - **Recommended Action:** *Quarantine CIDR block 185.220.101.0/24 & enforce Step-Up CAPTCHA.*

2. **Repeat Refund Abuse on Digital Vouchers (Severity: High | Risk Score: 82/100)**
   - **Pattern:** 3 accounts created with disposable \`@mailinator.com\` inboxes redeemed vouchers 4 minutes prior to filing instant refund claims.
   - **Exposure:** ₹24,500.
   - **Recommended Action:** *Hold pending refund under 48h investigation clause.*

**Guardrail Notice:** Subnet quarantine requires digital sign-off and checks that 0 past legitimate users exist in the IP range.`;
  }

  if (q.includes('reconcile') || q.includes('reconciliation') || q.includes('mismatch') || q.includes('exception') || q.includes('finance')) {
    return `### ⚖️ [Reconciliation Officer] 4-Way Matching Audit

**Reconciliation Score:** **98.2%** | **Open Exceptions:** **4 items totaling ₹47,211**

**Unresolved Discrepancies:**
1. **Fee Overcharge (ORD-8812 / ₹50,000 payment)**
   - *Issue:* Gateway billed standard 2.36% MDR instead of negotiated Schedule B 1.85% Enterprise rate.
   - *Variance:* **₹512 overcharged**.
   - *Fix:* Auto-file fee dispute ticket with Razorpay Partner Desk.
2. **Uncaptured Authorization Near Expiry (ORD-8742 / ₹24,999)**
   - *Issue:* High-value order verified delivered via BlueDart #91823, but payment remains uncaptured (Auto-voids in 4h 12m).
   - *Fix:* Deterministic 1-click capture execution.
3. **Delayed Settlement Queue (ORD-8790 / ₹18,500)**
   - *Issue:* T+1 clearing cycle delayed by bank holiday queue. Escrow confirmed safe.
4. **NPCI Double Debit Match (ORD-8610 / ₹3,200)**
   - *Issue:* Unlinked bank return reference RRN #32910488 matched with 100% confidence.

**Deterministic Proof:**
\`\`\`
Orders Logged: ₹1,48,24,500 | Gateway Settled: ₹1,47,77,289 | Variance: ₹47,211 (0.31%)
\`\`\``;
  }

  if (q.includes('conversion') || q.includes('growth') || q.includes('checkout') || q.includes('improve')) {
    return `### 🚀 [Growth Advisor] Conversion Optimization Opportunities

Analysis of **4,280 checkout sessions** identified **2 major conversion leakage points** with an estimated **+₹11,00,000 monthly revenue lift**:

1. **Activate Native Turbo UPI Intent (Projected Lift: +₹4,20,000 / +8.4% Conversion)**
   - *Observation:* 26.2% of mobile shoppers drop off when forced to manually type a VPA (@upi ID).
   - *Solution:* Direct deep-linking opens GPay/PhonePe instantly without manual input.
   - *Historical Test Result:* Conversion rises from 73.8% ➔ 88.5%.

2. **Enable 0-Cost Cardless EMI for Carts > ₹8,000 (Projected Lift: +₹6,80,000 / +14.2% Conversion)**
   - *Observation:* Carts between ₹8,000 - ₹35,000 have a 38% liquidity abandonment rate.
   - *Solution:* Introduce pre-approved Cardless EMI (ZestMoney, FlexiPay) with ₹1,499/mo affordability display.
   - *Margin Guardrail:* Verified that order margin (> 22%) fully absorbs the 1.2% merchant subvention fee.

**1-Click Implementation:**
Both playbooks can be activated with safe A/B traffic ramp and automatic fallback.`;
  }

  return `### 🤖 [MERCURY Command Centre]

I have analyzed your live merchant telemetry across **Revenue, Recovery, Risk, Finance, and Growth**:

- **Total Revenue:** ₹1,48,24,500 (*-6.4% due to HDFC Netbanking dip*)
- **Revenue at Risk:** ₹14,28,000 (*₹70,498 in immediate 1-click recoverable payments*)
- **Risk Posture:** 1 critical card testing velocity wave mitigated; 1 refund abuse cluster flagged.
- **Reconciliation Rate:** 98.2% with 4 open exceptions.

**How can I assist you right now?**
- *"Why did my revenue fall yesterday?"*
- *"Find payments that can potentially be recovered."*
- *"Are there suspicious transactions?"*
- *"Reconcile yesterday's payments."*
- *"How can I improve checkout conversion?"*`;
}

// Start Server and Mount Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MERCURY Server running on http://localhost:${PORT}`);
  });
}

startServer();
