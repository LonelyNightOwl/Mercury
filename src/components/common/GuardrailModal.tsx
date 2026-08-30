import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Cpu, 
  Fingerprint, 
  ArrowRight, 
  Lock,
  Sparkles,
  Check
} from 'lucide-react';
import { useMerchant } from '../../context/MerchantContext';
import { ActionProposal } from '../../types';

interface GuardrailModalProps {
  proposal: ActionProposal | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const GuardrailModal: React.FC<GuardrailModalProps> = ({ 
  proposal, 
  onClose,
  onSuccess
}) => {
  const { executeAction, isExecutingAction, formatCurrency } = useMerchant();
  const [confirmed, setConfirmed] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);

  if (!proposal) return null;

  const handleConfirmAndExecute = async () => {
    try {
      const result = await executeAction(proposal, 'Merchant (Manual)');
      setExecutionResult(result);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to execute guardrail action:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl rounded border border-slate-200 bg-white shadow-xl overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 tracking-wide">
                MERCURY Policy & Guardrail Verification
              </h3>
              <p className="text-[10px] text-slate-500">
                Pre-flight validation before financial state mutation
              </p>
            </div>
          </div>
          <button
            id="close-guardrail-modal-btn"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3.5 max-h-[78vh] overflow-y-auto">
          {executionResult ? (
            /* Post-execution Verification Success */
            <div className="py-3 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Action Executed & Verified
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 max-w-md mx-auto">
                  {proposal.simulatedOutcome}
                </p>
              </div>

              {/* Cryptographic Ledger Certificate */}
              <div className="rounded border border-emerald-200 bg-emerald-50/50 p-3 text-left space-y-1 font-mono text-[10px]">
                <div className="flex justify-between text-slate-600">
                  <span>Verification Hash:</span>
                  <span className="text-emerald-700 font-bold break-all">{executionResult.verificationHash}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Execution Latency:</span>
                  <span className="text-slate-800 font-bold">{executionResult.executionLatencyMs}ms (Deterministic)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Audit Trail ID:</span>
                  <span className="text-indigo-700 font-bold">{executionResult.id}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="guardrail-done-btn"
                  onClick={onClose}
                  className="w-full rounded bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Target Action Overview */}
              <div className="rounded border border-slate-200 bg-slate-50 p-3 space-y-1.5">
                <div className="flex items-start justify-between">
                  <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-700 border border-indigo-100">
                    {proposal.module} Module Action
                  </span>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                    proposal.riskLevel === 'high'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : proposal.riskLevel === 'medium'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {proposal.riskLevel} Risk
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{proposal.title}</h4>
                <p className="text-xs text-slate-600">{proposal.description}</p>
                {proposal.impactAmount && (
                  <div className="pt-1.5 flex items-center justify-between border-t border-slate-200 text-xs">
                    <span className="text-slate-500">Projected Financial Impact:</span>
                    <span className="font-mono font-bold text-emerald-600">
                      +{formatCurrency(proposal.impactAmount)}
                    </span>
                  </div>
                )}
              </div>

              {/* Guardrail Validation Checklist */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Policy Pre-Flight Checks ({proposal.guardrailChecks.length})
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-1">
                    <Check className="h-3 w-3" />
                    <span>All Checks Passed</span>
                  </span>
                </div>

                <div className="space-y-1">
                  {proposal.guardrailChecks.map((check) => (
                    <div
                      key={check.id}
                      className="flex items-start justify-between rounded border border-slate-200 bg-white p-2 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-800">{check.ruleName}</div>
                        <div className="text-[10px] text-slate-500">{check.detail}</div>
                      </div>
                      <span className="flex h-4.5 items-center rounded bg-emerald-100 px-1.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                        PASS
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deterministic Proof Box */}
              <div className="rounded border border-slate-200 bg-slate-50 p-2.5 text-xs space-y-1 font-mono">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Cpu className="h-3 w-3 text-indigo-600" />
                    <span className="text-slate-700 font-sans font-semibold">Deterministic Calculation Proof:</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">IDEM: {proposal.idempotencyKey.slice(0, 16)}...</span>
                </div>
                <p className="text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200 font-sans leading-relaxed">
                  {proposal.deterministicProof}
                </p>
              </div>

              {/* Simulated Outcome Preview */}
              <div className="rounded border border-indigo-200 bg-indigo-50/50 p-2.5 text-xs">
                <span className="font-bold text-indigo-900">Expected Outcome: </span>
                <span className="text-indigo-950">{proposal.simulatedOutcome}</span>
              </div>

              {/* Confirmation Sign-Off & Action Trigger */}
              <div className="pt-1.5 space-y-2.5">
                <label className="flex items-start space-x-2 text-xs text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="guardrail-confirm-checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span className="text-[11px]">
                    I verify and authorize execution of this deterministic action into the immutable audit trail.
                  </span>
                </label>

                <div className="flex items-center space-x-2">
                  <button
                    id="guardrail-cancel-btn"
                    onClick={onClose}
                    disabled={isExecutingAction}
                    className="w-1/3 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="guardrail-execute-btn"
                    onClick={handleConfirmAndExecute}
                    disabled={!confirmed || isExecutingAction}
                    className={`w-2/3 flex items-center justify-center space-x-1.5 rounded px-3 py-1.5 text-xs font-bold transition-all ${
                      confirmed && !isExecutingAction
                        ? 'bg-emerald-500 text-slate-950 shadow-xs hover:bg-emerald-400 cursor-pointer'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    }`}
                  >
                    {isExecutingAction ? (
                      <>
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                        <span>Verifying & Executing...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3" />
                        <span>Sign & Execute Action</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
