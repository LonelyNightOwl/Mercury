import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  RefreshCw, 
  ShieldAlert, 
  Scale, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Zap, 
  Bot, 
  Lock,
  ChevronRight,
  Clock,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useMerchant } from '../../context/MerchantContext';

export const OverviewDashboard: React.FC = () => {
  const { 
    metrics, 
    alerts, 
    recoveryItems, 
    riskClusters, 
    reconciliationExceptions, 
    growthOpportunities,
    auditLogs,
    formatCurrency, 
    setPendingAction,
    setActiveModule
  } = useMerchant();

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const recoverableCount = recoveryItems.filter(i => i.status === 'recoverable').length;
  const activeRiskCount = riskClusters.filter(r => r.status === 'active').length;
  const openExceptionsCount = reconciliationExceptions.filter(e => e.status === 'open').length;

  return (
    <div className="mercury-dashboard space-y-4 pb-8">
      
      {/* Top Banner: High Density Executive Briefing Terminal */}
      <div className="mercury-briefing rounded-2xl border border-slate-800 bg-slate-900 p-4 text-slate-100 shadow-xl shadow-slate-900/10 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white tracking-tight">
                  MERCURY Daily Executive Briefing
                </h2>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 uppercase font-mono border border-slate-700">
                  AI Orchestrator Live
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-4xl leading-relaxed">
                Merchant revenue dipped <strong className="text-amber-300">6.4%</strong> due to an afternoon HDFC Netbanking 3DS outage. MERCURY has identified <strong className="text-emerald-300">{recoverableCount} recoverable payments</strong> totaling <strong className="text-emerald-300">{formatCurrency(metrics.revenueAtRisk)}</strong>, mitigated <strong className="text-indigo-300">1 Tor card-testing attack</strong>, and flagged <strong className="text-amber-300">{openExceptionsCount} reconciliation exceptions</strong> for 1-click deterministic resolution.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center space-x-2">
            <button
              id="overview-ask-copilot-btn"
              onClick={() => setActiveModule('copilot')}
              className="flex items-center space-x-1.5 rounded bg-emerald-500 text-slate-950 px-3 py-1.5 text-xs font-bold shadow-xs hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Ask Copilot</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div onClick={() => setActiveModule('revenue')} className="bg-white p-3 rounded border border-slate-200 shadow-xs border-l-4 border-l-slate-800 hover:border-slate-300 transition-all cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-tight"><span>Total Revenue</span><TrendingUp className="h-3.5 w-3.5 text-slate-400" /></div>
          <div className="mt-1 font-mono text-lg font-bold text-slate-900 tracking-tight">{formatCurrency(metrics.totalRevenue)}</div>
          <div className="mt-1 flex items-center space-x-1 text-[10px]"><span className="flex items-center text-rose-600 font-semibold font-mono"><TrendingDown className="h-2.5 w-2.5 mr-0.5 inline" />{metrics.totalRevenueDelta}%</span><span className="text-slate-400">vs yesterday norm</span></div>
        </div>
        <div onClick={() => setActiveModule('recovery')} className="bg-white p-3 rounded border border-slate-200 shadow-xs border-l-4 border-l-rose-500 hover:border-slate-300 transition-all cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-tight"><span>Revenue at Risk</span><AlertTriangle className="h-3.5 w-3.5 text-rose-500" /></div>
          <div className="mt-1 font-mono text-lg font-bold text-rose-600 tracking-tight">{formatCurrency(metrics.revenueAtRisk)}</div>
          <div className="mt-1 flex items-center space-x-1 text-[10px]"><span className="text-rose-600 font-semibold font-mono">{recoverableCount} payments</span><span className="text-slate-400">recoverable now</span></div>
        </div>
        <div onClick={() => setActiveModule('recovery')} className="bg-white p-3 rounded border border-slate-200 shadow-xs border-l-4 border-l-emerald-500 hover:border-slate-300 transition-all cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-tight"><span>Revenue Recovered</span><RefreshCw className="h-3.5 w-3.5 text-emerald-500" /></div>
          <div className="mt-1 font-mono text-lg font-bold text-emerald-600 tracking-tight">{formatCurrency(metrics.revenueRecovered)}</div>
          <div className="mt-1 flex items-center space-x-1 text-[10px]"><span className="text-emerald-600 font-semibold font-mono">+{metrics.revenueRecoveredDelta}%</span><span className="text-slate-400">via Smart Retries</span></div>
        </div>
        <div onClick={() => setActiveModule('revenue')} className="bg-white p-3 rounded border border-slate-200 shadow-xs border-l-4 border-l-indigo-500 hover:border-slate-300 transition-all cursor-pointer">
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-tight"><span>Payment Success Rate</span><Activity className="h-3.5 w-3.5 text-indigo-500" /></div>
          <div className="mt-1 font-mono text-lg font-bold text-slate-900 tracking-tight">{metrics.paymentSuccessRate}%</div>
          <div className="mt-1 flex items-center space-x-1 text-[10px]"><span className="text-rose-600 font-semibold font-mono">{metrics.successRateDelta}%</span><span className="text-slate-400">Benchmark: 88.4%</span></div>
        </div>

        {/* Metric 5: Reconciliation Rate */}
        <div 
          onClick={() => setActiveModule('finance')}
          className="bg-white p-3 rounded border border-slate-200 shadow-xs border-l-4 border-l-blue-500 hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-tight">
            <span>Reconciliation Rate</span>
            <Scale className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-slate-900 tracking-tight">
            {metrics.reconciliationRate}%
          </div>
          <div className="mt-1 flex items-center space-x-1 text-[10px]">
            <span className="text-emerald-600 font-semibold font-mono">
              +{metrics.reconciliationRateDelta}%
            </span>
            <span className="text-slate-400">4-Way Matched</span>
          </div>
        </div>

        {/* Metric 6: Risk Alerts */}
        <div 
          onClick={() => setActiveModule('risk')}
          className="bg-white p-3 rounded border border-slate-200 shadow-xs border-l-4 border-l-rose-600 hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-tight">
            <span>Risk Alerts</span>
            <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-rose-600 tracking-tight">
            {metrics.riskAlertCount}
          </div>
          <div className="mt-1 flex items-center space-x-1 text-[10px]">
            <span className="text-rose-600 font-semibold">1 Critical</span>
            <span className="text-slate-400">Carding attack</span>
          </div>
        </div>

        {/* Metric 7: Open Exceptions */}
        <div 
          onClick={() => setActiveModule('finance')}
          className="bg-white p-3 rounded border border-slate-200 shadow-xs border-l-4 border-l-amber-500 hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-tight">
            <span>Open Exceptions</span>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-amber-600 tracking-tight">
            {metrics.openExceptionsCount}
          </div>
          <div className="mt-1 flex items-center space-x-1 text-[10px]">
            <span className="text-amber-600 font-semibold">₹47,211</span>
            <span className="text-slate-400">in variance</span>
          </div>
        </div>

        {/* Metric 8: Recent AI Actions */}
        <div 
          onClick={() => setActiveModule('audit')}
          className="bg-white p-3 rounded border border-slate-200 shadow-xs border-l-4 border-l-emerald-600 hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-bold tracking-tight">
            <span>Recent AI Actions</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="mt-1 font-mono text-lg font-bold text-emerald-600 tracking-tight">
            {metrics.recentActionCount}
          </div>
          <div className="mt-1 flex items-center space-x-1 text-[10px]">
            <span className="text-emerald-600 font-semibold">100% Policy Verified</span>
          </div>
        </div>

      </div>

      {/* Main Row: Active Anomalies Stream & Gateway Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Active Anomaly Stream & Recommended Guardrail Actions */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                Live Anomaly Stream & Action Centre
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {activeAlerts.length} active items requiring action
            </span>
          </div>

          <div className="space-y-2.5">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white rounded border border-slate-200 p-3.5 space-y-2.5 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                      alert.severity === 'high'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {alert.module}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">{alert.title}</h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{alert.detectedAt}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {alert.description}
                </p>

                {/* Root Cause & Financial Exposure */}
                <div className="rounded bg-slate-50 p-2.5 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Identified Root Cause:</span>
                    <span className="text-[11px] text-slate-700 font-medium">{alert.rootCause}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Financial Exposure:</span>
                    <span className="text-[11px] font-mono text-indigo-600 font-bold">{alert.impactLabel}</span>
                  </div>
                </div>

                {/* Suggested Action Bar */}
                {alert.suggestedAction && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="text-xs text-slate-700">
                      <span className="font-semibold text-slate-900">Recommended Action: </span>
                      {alert.suggestedAction.title}
                    </div>

                    <button
                      id={`execute-alert-action-${alert.id}`}
                      onClick={() => setPendingAction(alert.suggestedAction!)}
                      className="flex shrink-0 items-center justify-center space-x-1.5 rounded bg-emerald-500 text-slate-950 px-3 py-1.5 text-xs font-bold hover:bg-emerald-400 transition-colors cursor-pointer shadow-xs"
                    >
                      <Lock className="h-3 w-3" />
                      <span>Review & Execute</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Gateway Health & Payment Method Matrix */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="h-4 w-4 text-slate-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                Payment Channel Health
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Live Telemetry</span>
          </div>

          <div className="bg-white rounded border border-slate-200 p-3.5 space-y-3 shadow-xs">
            {/* UPI Intent */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">UPI Intent (GPay / PhonePe)</span>
                <span className="font-mono text-emerald-600 font-bold">92.4%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92.4%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Avg Latency: 2.1s</span>
                <span>Share: 46% of Volume</span>
              </div>
            </div>

            {/* Credit & Debit Cards */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">Credit / Debit Cards</span>
                <span className="font-mono text-indigo-600 font-bold">86.1%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '86.1%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Avg Latency: 4.8s</span>
                <span>Share: 31% of Volume</span>
              </div>
            </div>

            {/* Netbanking (Degraded) */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-rose-600">Netbanking (HDFC / ICICI)</span>
                <span className="font-mono text-rose-600 font-bold">60.8% (Degraded)</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '60.8%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-rose-600 font-mono">
                <span>3DS Outage Active</span>
                <span>Share: 14% of Volume</span>
              </div>
            </div>

            {/* UPI Collect (Manual VPA) */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-600">UPI Collect (Manual VPA)</span>
                <span className="font-mono text-amber-600 font-bold">73.8%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '73.8%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>26.2% Abandonment</span>
                <span>Share: 9% of Volume</span>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-100">
              <button
                onClick={() => setActiveModule('revenue')}
                className="w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 py-1"
              >
                Deep-Dive Gateway Routing →
              </button>
            </div>
          </div>

          {/* Quick Specialist Actions Card */}
          <div className="bg-white rounded border border-slate-200 p-3 space-y-2 shadow-xs">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Specialist Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setActiveModule('recovery')}
                className="flex items-center space-x-1.5 rounded bg-slate-50 p-2 text-left text-xs text-slate-700 hover:bg-slate-100 transition-colors border border-slate-100"
              >
                <RefreshCw className="h-3 w-3 text-emerald-600 shrink-0" />
                <span className="truncate">Recover ₹70k</span>
              </button>
              <button
                onClick={() => setActiveModule('risk')}
                className="flex items-center space-x-1.5 rounded bg-slate-50 p-2 text-left text-xs text-slate-700 hover:bg-slate-100 transition-colors border border-slate-100"
              >
                <ShieldAlert className="h-3 w-3 text-rose-600 shrink-0" />
                <span className="truncate">Block Tor IPs</span>
              </button>
              <button
                onClick={() => setActiveModule('finance')}
                className="flex items-center space-x-1.5 rounded bg-slate-50 p-2 text-left text-xs text-slate-700 hover:bg-slate-100 transition-colors border border-slate-100"
              >
                <Scale className="h-3 w-3 text-blue-600 shrink-0" />
                <span className="truncate">Reconcile (4)</span>
              </button>
              <button
                onClick={() => setActiveModule('growth')}
                className="flex items-center space-x-1.5 rounded bg-slate-50 p-2 text-left text-xs text-slate-700 hover:bg-slate-100 transition-colors border border-slate-100"
              >
                <Zap className="h-3 w-3 text-indigo-600 shrink-0" />
                <span className="truncate">Turbo UPI</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Recent Audit Trail Feed */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
              Recent Deterministically Verified Actions
            </h3>
          </div>
          <button
            onClick={() => setActiveModule('audit')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>View Full Immutable Audit Trail</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto rounded border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3">Action Title</th>
                <th className="py-2.5 px-3">Verification Hash</th>
                <th className="py-2.5 px-3 text-right">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.slice(0, 4).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">{log.actor}</td>
                  <td className="py-2.5 px-3 uppercase text-[9px] font-bold text-slate-600">{log.module}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{log.title}</td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                    {log.verificationHash.slice(0, 14)}...
                  </td>
                  <td className="py-2.5 px-3 font-mono text-right font-bold text-emerald-600 whitespace-nowrap">
                    {log.financialImpact ? `+${formatCurrency(log.financialImpact)}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
