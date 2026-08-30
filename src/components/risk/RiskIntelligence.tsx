import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Ban, 
  Fingerprint, 
  Globe, 
  Clock, 
  Eye, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Check
} from 'lucide-react';
import { useMerchant } from '../../context/MerchantContext';
import { RiskCluster } from '../../types';

export const RiskIntelligence: React.FC = () => {
  const { 
    riskClusters, 
    formatCurrency, 
    setPendingAction, 
    metrics 
  } = useMerchant();

  const [activeTab, setActiveTab] = useState<'clusters' | 'rules' | 'chargebacks'>('clusters');

  const activeClusters = riskClusters.filter(r => r.status === 'active');

  return (
    <div className="space-y-4 pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">Risk Intelligence & Fraud Defense</h1>
            <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 uppercase font-mono border border-rose-100">
              Heuristic & Velocity Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Detect suspicious transaction clusters, mitigate card testing attacks, prevent refund abuse, and safeguard chargeback ratios.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Chargeback Ratio: <strong className="text-emerald-700 font-mono">0.08%</strong> (Safe &lt; 0.65%)</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded border border-slate-200 p-3 shadow-xs border-l-4 border-l-rose-600 space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-slate-500">Active Threat Clusters</span>
          <div className="font-mono text-lg font-bold text-rose-600 tracking-tight">
            {activeClusters.length}
          </div>
          <div className="text-[10px] text-slate-400">
            1 Critical Card Testing Wave
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 p-3 shadow-xs border-l-4 border-l-emerald-500 space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-slate-500">Total Fraud Exposure Prevented</span>
          <div className="font-mono text-lg font-bold text-emerald-600 tracking-tight">
            ₹1,30,500
          </div>
          <div className="text-[10px] text-emerald-600 font-mono">
            +₹35,000 saved dispute fees
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 p-3 shadow-xs border-l-4 border-l-indigo-500 space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-slate-500">Merchant Trust Index</span>
          <div className="font-mono text-lg font-bold text-slate-900 tracking-tight">
            94.8 / 100
          </div>
          <div className="text-[10px] text-slate-400">
            Razorpay Risk Tier: <strong className="text-emerald-600">Low Risk Tier 1</strong>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 text-xs">
        <button
          onClick={() => setActiveTab('clusters')}
          className={`pb-2.5 font-semibold text-xs transition-all cursor-pointer ${
            activeTab === 'clusters'
              ? 'text-slate-900 border-b-2 border-slate-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Suspicious Threat Clusters ({riskClusters.length})
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-2.5 font-semibold text-xs transition-all cursor-pointer ${
            activeTab === 'rules'
              ? 'text-slate-900 border-b-2 border-slate-900'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Active Velocity & Firewall Rules (6)
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'clusters' ? (
        <div className="space-y-3">
          {riskClusters.map(cluster => {
            const isBlocked = cluster.status === 'blocked';

            return (
              <div
                key={cluster.id}
                className={`rounded border p-4 space-y-3 shadow-xs transition-all ${
                  isBlocked
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded border ${
                      cluster.severity === 'critical'
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xs font-bold text-slate-900">{cluster.title}</h3>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                          cluster.severity === 'critical'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          Score: {cluster.riskScore}/100
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{cluster.description}</p>
                    </div>
                  </div>

                  {/* Status / Action */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-slate-400 font-semibold">Target Entity</div>
                      <span className="font-mono text-xs font-bold text-slate-800">{cluster.entityValue}</span>
                    </div>

                    {isBlocked ? (
                      <span className="flex items-center space-x-1 rounded bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Quarantined & Mitigated</span>
                      </span>
                    ) : (
                      <button
                        id={`quarantine-cluster-${cluster.id}`}
                        onClick={() => setPendingAction(cluster.recommendedAction)}
                        className="flex items-center space-x-1.5 rounded bg-rose-600 text-white px-3 py-1.5 text-xs font-bold shadow-xs hover:bg-rose-500 transition-colors cursor-pointer"
                      >
                        <Lock className="h-3 w-3" />
                        <span>Enforce Quarantine</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Explainable AI Findings Box */}
                <div className="rounded border border-slate-100 bg-slate-50 p-3 space-y-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-indigo-700 font-semibold text-[11px]">
                    <Fingerprint className="h-3.5 w-3.5" />
                    <span>Explainable AI Risk Reasoning:</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {cluster.explanation}
                  </p>

                  {/* Evidence Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 font-mono text-[11px]">
                    {cluster.evidence.map((ev, i) => (
                      <div key={i} className="rounded bg-white p-2 border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">{ev.label}</span>
                        <span className="text-slate-800 font-semibold">{ev.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guardrail Requirement */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Policy Guardrail: Enforces IP scope limitation & zero registered user impact.</span>
                  <span className="font-mono text-indigo-600 text-[10px] font-semibold">Idempotent Sign-Off Required</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Active Firewall Rules Tab */
        <div className="rounded border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">Configured Merchant Risk Guardrails</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-100">
              <div>
                <strong className="text-slate-800 block">Guest Velocity Throttle</strong>
                <span className="text-slate-500">Caps unauthenticated card attempts to max 3 per 60 minutes per fingerprint</span>
              </div>
              <span className="rounded bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold">ACTIVE</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-100">
              <div>
                <strong className="text-slate-800 block">Tor / Anonymous Proxy Blocker</strong>
                <span className="text-slate-500">Mandates 3DS 2.2 step-up challenge on all anonymized VPN/Tor exits</span>
              </div>
              <span className="rounded bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold">ACTIVE</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded bg-slate-50 border border-slate-100">
              <div>
                <strong className="text-slate-800 block">Disposable Email Filter</strong>
                <span className="text-slate-500">Flags accounts using temporary mailbox domains for digital voucher purchases</span>
              </div>
              <span className="rounded bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold">ACTIVE</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
