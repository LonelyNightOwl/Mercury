import React from 'react';
import { 
  Rocket, 
  TrendingUp, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone, 
  CreditCard, 
  Lock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useMerchant } from '../../context/MerchantContext';

export const GrowthIntelligence: React.FC = () => {
  const { 
    growthOpportunities, 
    formatCurrency, 
    setPendingAction 
  } = useMerchant();

  const funnelSteps = [
    { name: 'Cart View', sessions: 4280, dropOff: '12%', rate: '100%' },
    { name: 'Checkout Initiated', sessions: 3766, dropOff: '8%', rate: '88.0%' },
    { name: 'Payment Method Selected', sessions: 3464, dropOff: '19% (Leakage)', rate: '81.0%' },
    { name: '3DS OTP / UPI App Switch', sessions: 2805, dropOff: '24% (Major Leak)', rate: '65.5%' },
    { name: 'Payment Successful', sessions: 2132, dropOff: '—', rate: '49.8% Overall' }
  ];

  return (
    <div className="mercury-module mercury-growth space-y-6 pb-8">
      
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Growth Intelligence</h1>
          <p className="text-sm text-slate-600 mt-1">Optimize your checkout funnel and increase conversion rates</p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 flex items-center space-x-2 font-mono">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span>Projected Pipeline Lift: <strong className="text-emerald-600 font-bold">+₹11,00,000/mo</strong></span>
          </div>
        </div>
      </div>

      {/* Checkout Funnel Leakage Visualizer */}
      <div className="rounded border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">
              Checkout & Payment Stage Conversion Funnel
            </h3>
            <p className="text-[11px] text-slate-500">
              Telemetry from 4,280 tracked customer checkout sessions
            </p>
          </div>
          <span className="text-[11px] text-rose-600 font-bold">
            2 Critical Leakage Points
          </span>
        </div>

        {/* Funnel Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
          {funnelSteps.map((step, idx) => (
            <div
              key={idx}
              className={`rounded border p-2.5 space-y-1 ${
                idx === 2 || idx === 3
                  ? 'border-amber-300 bg-amber-50/60'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-semibold text-slate-500">Step {idx + 1}</span>
                <span className="font-mono font-bold text-slate-800">{step.rate}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 truncate">{step.name}</h4>
              <div className="font-mono text-xs font-semibold text-slate-700">
                {step.sessions.toLocaleString()} users
              </div>
              <div className={`text-[10px] font-bold ${
                idx === 2 || idx === 3 ? 'text-amber-700' : 'text-slate-400'
              }`}>
                Drop: {step.dropOff}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Growth Opportunities Stream */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">
          Recommended Merchant Growth Playbooks ({growthOpportunities.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {growthOpportunities.map(opp => {
            const isImplemented = opp.status === 'implemented';

            return (
              <div
                key={opp.id}
                className={`rounded border p-4 space-y-3 transition-all flex flex-col justify-between shadow-xs ${
                  isImplemented
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-700 border border-indigo-100">
                      {opp.category.replace('_', ' ')}
                    </span>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-emerald-600 block">
                        +{formatCurrency(opp.potentialRevenueLift)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        +{opp.conversionLiftPercentage}% Conversion Lift
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900">{opp.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{opp.description}</p>

                  {/* Actionable Steps List */}
                  <div className="rounded bg-slate-50 p-2.5 space-y-1 text-xs border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Implementation Blueprint:</span>
                    <ul className="space-y-0.5 text-xs text-slate-600">
                      {opp.actionableSteps.map((s, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Action Trigger */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Confidence Score: <strong className="text-slate-800">{opp.confidenceScore}%</strong>
                  </span>

                  {isImplemented ? (
                    <span className="flex items-center space-x-1 rounded bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Playbook Active</span>
                    </span>
                  ) : (
                    <button
                      id={`enable-growth-opp-${opp.id}`}
                      onClick={() => setPendingAction(opp.recommendedAction)}
                      className="flex items-center space-x-1.5 rounded bg-emerald-500 text-slate-950 px-3 py-1 text-xs font-bold shadow-xs hover:bg-emerald-400 transition-colors cursor-pointer"
                    >
                      <Zap className="h-3 w-3" />
                      <span>Deploy Playbook</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
