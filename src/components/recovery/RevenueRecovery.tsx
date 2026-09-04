import React, { useState } from 'react';
import { 
  RefreshCw, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Filter, 
  ShieldCheck, 
  Lock,
  MessageSquare,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { useMerchant } from '../../context/MerchantContext';
import { RecoveryItem, FailureCategory } from '../../types';

export const RevenueRecovery: React.FC = () => {
  const { 
    recoveryItems, 
    formatCurrency, 
    setPendingAction, 
    triggerBatchRecovery,
    metrics
  } = useMerchant();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isBatchRunning, setIsBatchRunning] = useState(false);

  const filteredItems = recoveryItems.filter(item => {
    if (filterCategory === 'all') return true;
    return item.failureCategory === filterCategory;
  });

  const recoverableItems = recoveryItems.filter(i => i.status === 'recoverable');
  const totalRecoverableAmount = recoverableItems.reduce((sum, i) => sum + i.amount, 0);

  const handleRunBatchRecovery = async () => {
    setIsBatchRunning(true);
    try {
      await triggerBatchRecovery();
    } finally {
      setIsBatchRunning(false);
    }
  };

  const getFailureBadge = (cat: FailureCategory) => {
    switch (cat) {
      case 'technical_gateway':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">Technical / Timeout</span>;
      case 'insufficient_funds':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">Insufficient Balance</span>;
      case 'daily_limit_exceeded':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">Bank Daily UPI Cap</span>;
      case 'user_dropped_3ds':
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">3DS OTP Drop-off</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">{cat}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-8">
      
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Revenue Recovery</h1>
          <p className="text-sm text-slate-600 mt-1">Recover failed payments with smart retry logic and recovery links</p>
        </div>

        {/* Batch Recovery Trigger */}
        {recoverableItems.length > 0 && (
          <button
            id="batch-recovery-btn"
            onClick={handleRunBatchRecovery}
            disabled={isBatchRunning}
            className="flex items-center space-x-1.5 rounded bg-emerald-500 text-slate-950 px-3.5 py-2 text-xs font-bold shadow-xs hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            {isBatchRunning ? (
              <>
                <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                <span>Executing Batch Recovery...</span>
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5" />
                <span>Recover All {recoverableItems.length} Payments ({formatCurrency(totalRecoverableAmount)})</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Recovery Metrics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded border border-slate-200 p-3 shadow-xs border-l-4 border-l-rose-500 space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-slate-500">Total Recoverable Pool</span>
          <div className="font-mono text-lg font-bold text-rose-600 tracking-tight">
            {formatCurrency(totalRecoverableAmount)}
          </div>
          <div className="text-[10px] text-slate-400">
            {recoverableItems.length} high-intent failed payments
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 p-3 shadow-xs border-l-4 border-l-emerald-500 space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-slate-500">Total Revenue Recovered</span>
          <div className="font-mono text-lg font-bold text-emerald-600 tracking-tight">
            {formatCurrency(metrics.revenueRecovered)}
          </div>
          <div className="text-[10px] text-emerald-600 font-mono">
            +{metrics.revenueRecoveredDelta}% this billing cycle
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 p-3 shadow-xs border-l-4 border-l-indigo-500 space-y-0.5">
          <span className="text-[10px] font-bold uppercase text-slate-500">Average Recovery Success Rate</span>
          <div className="font-mono text-lg font-bold text-slate-900 tracking-tight">
            85.7%
          </div>
          <div className="text-[10px] text-slate-400">
            Smart Retry + WhatsApp Pay-by-link
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
        <div className="flex items-center space-x-1 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Failed Payments' },
            { id: 'technical_gateway', label: 'Technical / Gateway Outage' },
            { id: 'insufficient_funds', label: 'Insufficient Funds' },
            { id: 'daily_limit_exceeded', label: 'Daily Bank Limit' },
            { id: 'user_dropped_3ds', label: 'OTP Drop-offs' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`rounded px-2.5 py-1 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Showing {filteredItems.length} items
        </span>
      </div>

      {/* Recovery Items Stream */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded border border-slate-200 p-8 text-center space-y-2 shadow-xs">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
            <h3 className="text-xs font-bold text-slate-900">All Payments in this Category Recovered</h3>
            <p className="text-xs text-slate-500">
              MERCURY's automated recovery playbooks have cleared all recoverable exceptions.
            </p>
          </div>
        ) : (
          filteredItems.map(item => {
            const isRecovered = item.status === 'recovered';

            return (
              <div
                key={item.id}
                className={`rounded border p-3.5 space-y-2.5 shadow-xs transition-all ${
                  isRecovered
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                  
                  {/* Customer & Failure Info */}
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{item.customerName}</span>
                      <span className="text-xs text-slate-400 font-mono">{item.customerEmail}</span>
                      {getFailureBadge(item.failureCategory)}
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>Failure Reason: </strong> {item.failureReason}
                    </p>
                    <div className="text-[10px] text-slate-400 flex items-center space-x-2 font-mono">
                      <span>ID: {item.paymentId}</span>
                      <span>•</span>
                      <span>Failed {item.failedAt}</span>
                    </div>
                  </div>

                  {/* Amount & Recovery Probability */}
                  <div className="flex items-center justify-between md:justify-end space-x-3 shrink-0">
                    <div className="text-left md:text-right">
                      <div className="font-mono text-sm font-bold text-slate-900">
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="text-[10px] font-semibold text-emerald-600">
                        {item.recoveryProbability}% Recovery Likelihood
                      </div>
                    </div>

                    {/* Action Trigger Button */}
                    {isRecovered ? (
                      <span className="flex items-center space-x-1 rounded bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Recovered</span>
                      </span>
                    ) : (
                      <button
                        id={`recover-item-${item.id}`}
                        onClick={() => setPendingAction(item.recommendedAction)}
                        className="flex items-center space-x-1.5 rounded bg-emerald-500 text-slate-950 px-3 py-1.5 text-xs font-bold shadow-xs hover:bg-emerald-400 transition-colors cursor-pointer"
                      >
                        <Zap className="h-3 w-3" />
                        <span>Execute Recovery</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Recovery Strategy & Guardrail Blueprint */}
                <div className="rounded bg-slate-50 p-2 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border border-slate-100">
                  <div className="text-slate-600">
                    <span className="text-slate-900 font-semibold">Recommended AI Playbook: </span>
                    {item.recommendedAction.title}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Policy Pre-Flight: {item.recommendedAction.guardrailChecks.length} Checks Validated
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
