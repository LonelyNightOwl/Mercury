import React, { useState } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  Clock, 
  Cpu, 
  RefreshCw,
  Coins
} from 'lucide-react';
import { useMerchant } from '../../context/MerchantContext';
import { ReconciliationException } from '../../types';

export const FinanceController: React.FC = () => {
  const { 
    reconciliationExceptions, 
    formatCurrency, 
    setPendingAction, 
    metrics 
  } = useMerchant();

  const [activeFilter, setActiveFilter] = useState<string>('all');

  const openExceptions = reconciliationExceptions.filter(e => e.status === 'open');
  const filteredExceptions = reconciliationExceptions.filter(e => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'open') return e.status === 'open';
    if (activeFilter === 'reconciled') return e.status === 'reconciled';
    return true;
  });

  const getDiscrepancyBadge = (type: string) => {
    switch (type) {
      case 'fee_overcharge':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">Gateway Fee Overcharge</span>;
      case 'uncaptured_authorization':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">Uncaptured Authorization</span>;
      case 'delayed_settlement':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">Delayed Nodal Settlement</span>;
      case 'double_debit_refund_mismatch':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">NPCI Return Mismatch</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">{type}</span>;
    }
  };

  return (
    <div className="space-y-4 pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">Finance & Reconciliation Controller</h1>
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700 uppercase font-mono border border-blue-100">
              4-Way Matching Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated reconciliation across Orders, Payments, Refunds, and Bank Settlements. Resolve exceptions deterministically.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="rounded border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 flex items-center space-x-2 font-mono">
            <Coins className="h-4 w-4 text-indigo-600" />
            <span>Reconciled Rate: <strong className="text-emerald-600">{metrics.reconciliationRate}%</strong></span>
          </div>
        </div>
      </div>

      {/* 4-Way Matching Matrix Overview */}
      <div className="rounded border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">
            Automated 4-Way Ledger Reconciliation Matrix
          </h3>
          <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>98.2% Total Match</span>
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          <div className="rounded border border-slate-200 bg-slate-50 p-2.5 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">1. Order Subsystem</span>
            <div className="font-mono text-sm font-bold text-slate-900">₹1,48,24,500</div>
            <div className="text-[10px] text-slate-400 font-mono">4,280 Orders in OMS</div>
          </div>

          <div className="rounded border border-slate-200 bg-slate-50 p-2.5 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">2. Gateway Charges</span>
            <div className="font-mono text-sm font-bold text-slate-900">₹1,48,01,100</div>
            <div className="text-[10px] text-slate-400 font-mono">3,621 Captured</div>
          </div>

          <div className="rounded border border-slate-200 bg-slate-50 p-2.5 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">3. Refunds & Disputes</span>
            <div className="font-mono text-sm font-bold text-amber-600">₹1,12,400</div>
            <div className="text-[10px] text-slate-400 font-mono">18 Processed / 3 Disputes</div>
          </div>

          <div className="rounded border border-slate-200 bg-slate-50 p-2.5 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">4. Bank Settlement Payout</span>
            <div className="font-mono text-sm font-bold text-emerald-600">₹1,44,77,289</div>
            <div className="text-[10px] text-slate-400 font-mono">UTR Matched in HDFC/Axis</div>
          </div>
        </div>
      </div>

      {/* Exception Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            All Exceptions ({reconciliationExceptions.length})
          </button>
          <button
            onClick={() => setActiveFilter('open')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'open' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Open Discrepancies ({openExceptions.length})
          </button>
          <button
            onClick={() => setActiveFilter('reconciled')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'reconciled' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Reconciled
          </button>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">
          Total Open Variance: <strong className="text-amber-600 font-bold">₹47,211</strong>
        </span>
      </div>

      {/* Exceptions Stream */}
      <div className="space-y-2.5">
        {filteredExceptions.map(exc => {
          const isResolved = exc.status === 'reconciled';

          return (
            <div
              key={exc.id}
              className={`rounded border p-3.5 space-y-2.5 shadow-xs transition-all ${
                isResolved
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 font-mono">{exc.orderId}</span>
                    <span className="text-xs text-slate-400 font-mono">{exc.paymentId}</span>
                    {getDiscrepancyBadge(exc.discrepancyType)}
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Likely Cause: </strong> {exc.likelyCause}
                  </p>
                  <div className="text-[10px] text-slate-400 flex items-center space-x-2 font-mono">
                    <span>Gateway: {exc.gateway}</span>
                    {exc.bankUtr && <span>• UTR: {exc.bankUtr}</span>}
                    <span>• Detected: {exc.detectedAt}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end space-x-3 shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Discrepancy</span>
                    <div className="font-mono text-sm font-bold text-amber-600">
                      {formatCurrency(exc.discrepancyAmount)}
                    </div>
                  </div>

                  {isResolved ? (
                    <span className="flex items-center space-x-1 rounded bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Reconciled</span>
                    </span>
                  ) : (
                    <button
                      id={`resolve-exception-${exc.id}`}
                      onClick={() => setPendingAction(exc.recommendedAction)}
                      className="flex items-center space-x-1.5 rounded bg-emerald-500 text-slate-950 px-3 py-1.5 text-xs font-bold shadow-xs hover:bg-emerald-400 transition-colors cursor-pointer"
                    >
                      <Cpu className="h-3 w-3" />
                      <span>Execute 1-Click Fix</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Recommended Fix Box */}
              <div className="rounded bg-slate-50 p-2 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border border-slate-100">
                <div className="text-slate-600">
                  <span className="text-slate-900 font-semibold">Recommended Fix: </span>
                  {exc.recommendedAction.title}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Deterministic Proof Ready
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
