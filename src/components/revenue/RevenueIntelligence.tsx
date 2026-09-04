import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Activity, 
  Zap, 
  Layers, 
  Server, 
  ShieldCheck, 
  Clock,
  ArrowRight,
  Filter,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { useMerchant } from '../../context/MerchantContext';

export const RevenueIntelligence: React.FC = () => {
  const { 
    metrics, 
    alerts, 
    formatCurrency, 
    setPendingAction, 
    selectedTimeframe, 
    setSelectedTimeframe,
    setActiveModule
  } = useMerchant();

  const [selectedGateway, setSelectedGateway] = useState<string>('all');

  const revenueAlert = alerts.find(a => a.module === 'revenue' && a.status === 'active');

  const hourlyData = [
    { hour: '00:00', volume: 142000, successRate: 89.2, anomaly: false },
    { hour: '03:00', volume: 88000, successRate: 91.0, anomaly: false },
    { hour: '06:00', volume: 210000, successRate: 88.5, anomaly: false },
    { hour: '09:00', volume: 840000, successRate: 87.9, anomaly: false },
    { hour: '12:00', volume: 1420000, successRate: 86.4, anomaly: false },
    { hour: '15:00', volume: 920000, successRate: 60.8, anomaly: true }, // Anomaly dip!
    { hour: '18:00', volume: 1240000, successRate: 84.1, anomaly: false },
    { hour: '21:00', volume: 1680000, successRate: 88.7, anomaly: false },
  ];

  const causeBreakdown = [
    {
      title: 'HDFC Netbanking 3DS Gateway Timeout',
      share: '68% of lost revenue',
      impact: '₹3,45,000',
      reason: 'Issuer Bank Netbanking 3DS callback timeout (HTTP 504 on bank end)',
      severity: 'high',
      recoverable: true
    },
    {
      title: 'UPI Collect VPA Input Drop-off',
      share: '22% of lost revenue',
      impact: '₹1,12,000',
      reason: 'Shoppers abandoned checkout during manual @upi ID entry & banking app switch',
      severity: 'medium',
      recoverable: true
    },
    {
      title: 'Insufficient Card Credit Limits on High AOV',
      share: '10% of lost revenue',
      impact: '₹51,000',
      reason: 'Transactions > ₹25,000 declined due to monthly limit caps without EMI fallback',
      severity: 'low',
      recoverable: true
    }
  ];

  return (
    <div className="mercury-module mercury-revenue space-y-6 pb-8">
      
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Revenue Intelligence</h1>
          <p className="text-sm text-slate-600 mt-1">Monitor payment trends and identify revenue drop causes</p>
        </div>

        {/* Timeframe Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-slate-100 p-1 gap-1 text-xs">
            {(['today', 'yesterday', '7d', '30d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  selectedTimeframe === tf
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tf === 'today' ? 'Today' : tf === 'yesterday' ? 'Yesterday' : tf === '7d' ? 'Last 7D' : 'Last 30D'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Anomaly Callout Banner (If active) */}
      {revenueAlert && (
        <div className="rounded border border-rose-200 bg-rose-50/50 p-3.5 shadow-xs space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-rose-100 text-rose-600 border border-rose-200">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-rose-600">
                  Unusual Revenue Anomaly Detected
                </span>
                <h3 className="text-xs font-bold text-slate-900">{revenueAlert.title}</h3>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200">
              {revenueAlert.impactLabel}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {revenueAlert.description}
          </p>

          {revenueAlert.suggestedAction && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-rose-100">
              <div className="text-xs text-slate-600">
                <strong>Recommended Mitigation: </strong> {revenueAlert.suggestedAction.title}
              </div>
              <button
                onClick={() => setPendingAction(revenueAlert.suggestedAction!)}
                className="flex items-center space-x-1.5 rounded bg-emerald-500 text-slate-950 px-3 py-1.5 text-xs font-bold shadow-xs hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                <span>Review & Execute Failover</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded border border-slate-200 p-3 shadow-xs border-l-4 border-l-slate-800 space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-slate-500">Monitored Revenue</span>
          <div className="font-mono text-lg font-bold text-slate-900 tracking-tight">
            {formatCurrency(metrics.totalRevenue)}
          </div>
          <div className="text-[10px] text-rose-600 font-mono flex items-center">
            <TrendingDown className="h-2.5 w-2.5 mr-0.5 inline" />
            -6.4% vs expected volume
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 p-3 shadow-xs border-l-4 border-l-indigo-500 space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-slate-500">Current Success Rate</span>
          <div className="font-mono text-lg font-bold text-slate-900 tracking-tight">
            {metrics.paymentSuccessRate}%
          </div>
          <div className="text-[10px] text-slate-400">
            Norm benchmark: <strong className="text-slate-600">88.4%</strong>
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 p-3 shadow-xs border-l-4 border-l-rose-500 space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-slate-500">Estimated Revenue at Risk</span>
          <div className="font-mono text-lg font-bold text-rose-600 tracking-tight">
            {formatCurrency(metrics.revenueAtRisk)}
          </div>
          <div className="text-[10px] text-emerald-600 font-mono">
            {formatCurrency(metrics.revenueRecovered)} already recovered
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 p-3 shadow-xs border-l-4 border-l-slate-700 space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-slate-500">Total Processed Transactions</span>
          <div className="font-mono text-lg font-bold text-slate-900 tracking-tight">
            {metrics.transactionCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">
            Failed / Dropped: <strong className="text-rose-600">659</strong> (15.4%)
          </div>
        </div>
      </div>

      {/* Hourly Trend Graph & Anomaly Visualizer */}
      <div className="bg-white rounded border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
              Hourly Transaction Volume & Success Rate Trajectory
            </h3>
            <p className="text-xs text-slate-500">
              Interactive timeline with AI anomaly markers
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="h-2.5 w-2.5 rounded bg-indigo-500" />
              <span className="text-slate-600 text-xs">Volume (₹)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="text-rose-600 text-xs font-semibold">Anomaly Dip (60.8%)</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-3 pb-1 border-t border-slate-100">
          <div className="grid grid-cols-8 gap-2 h-40 items-end">
            {hourlyData.map((d) => {
              const heightPercent = Math.max((d.volume / 1700000) * 100, 15);

              return (
                <div key={d.hour} className="flex flex-col items-center h-full justify-end group">
                  <div className="w-full relative flex flex-col items-center justify-end h-full">
                    {d.anomaly && (
                      <span className="absolute -top-5 text-[9px] font-bold text-rose-700 bg-rose-100 px-1 rounded border border-rose-200">
                        Dip
                      </span>
                    )}
                    <div
                      className={`w-full rounded-t transition-all ${
                        d.anomaly
                          ? 'bg-rose-500 shadow-xs'
                          : 'bg-indigo-500/80 group-hover:bg-indigo-600'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-1.5">{d.hour}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Root Cause Decomposition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Major Causes Breakdown (2 Cols) */}
        <div className="lg:col-span-2 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
              Major Root Causes Behind Revenue Changes
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Deterministic attribution</span>
          </div>

          <div className="space-y-2">
            {causeBreakdown.map((cause, idx) => (
              <div
                key={idx}
                className="bg-white rounded border border-slate-200 p-3 space-y-2 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">{cause.title}</h4>
                    <p className="text-xs text-slate-500">{cause.reason}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs font-bold text-rose-600">{cause.impact}</div>
                    <span className="text-[10px] text-slate-400">{cause.share}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                  <span className="text-emerald-600 font-semibold text-[11px] flex items-center space-x-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Auto-recoverable via MERCURY Recovery engine</span>
                  </span>
                  <button
                    onClick={() => setActiveModule('recovery')}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold text-[11px] cursor-pointer"
                  >
                    View in Recovery →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Gateway Matrix */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
            Acquiring Gateway Latency
          </h3>

          <div className="bg-white rounded border border-slate-200 p-3 space-y-2.5 text-xs shadow-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
              <span>Gateway Node</span>
              <span>Latency / SR</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-800 font-medium">Razorpay Direct UPI</span>
              <div className="text-right font-mono">
                <span className="text-emerald-600 font-bold">1.8s</span>
                <span className="text-slate-400 text-[10px] ml-2">(94.2% SR)</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
              <span className="text-slate-800 font-medium">ICICI Cards Aggregator</span>
              <div className="text-right font-mono">
                <span className="text-indigo-600 font-bold">3.2s</span>
                <span className="text-slate-400 text-[10px] ml-2">(89.5% SR)</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
              <span className="text-rose-600 font-semibold">HDFC Netbanking Direct</span>
              <div className="text-right font-mono">
                <span className="text-rose-600 font-bold">14.8s (Timeout)</span>
                <span className="text-slate-400 text-[10px] ml-2">(60.8% SR)</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
              <span className="text-slate-800 font-medium">Axis Bank Gateway</span>
              <div className="text-right font-mono">
                <span className="text-emerald-600 font-bold">2.4s</span>
                <span className="text-slate-400 text-[10px] ml-2">(91.1% SR)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
