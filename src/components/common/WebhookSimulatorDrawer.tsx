import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  RefreshCw, 
  ShieldAlert, 
  Scale, 
  CheckCircle2, 
  ArrowRight, 
  Send,
  Radio
} from 'lucide-react';
import { useMerchant } from '../../context/MerchantContext';

interface WebhookSimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WebhookSimulatorDrawer: React.FC<WebhookSimulatorDrawerProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { triggerWebhookSimulation } = useMerchant();
  const [lastFiredEvent, setLastFiredEvent] = useState<string | null>(null);

  if (!isOpen) return null;

  const events = [
    {
      type: 'payment.failed' as const,
      name: 'payment.failed (Bank 3DS Outage)',
      description: 'Simulates a high-ticket transaction dropping due to ICICI Bank 3DS OTP timeout.',
      moduleTarget: 'Revenue Recovery',
      badge: 'High Intent Recovery'
    },
    {
      type: 'dispute.created' as const,
      name: 'dispute.created (Chargeback Notice)',
      description: 'Simulates an incoming dispute notice for unauthorized card charge under Reason Code 4837.',
      moduleTarget: 'Risk Intelligence',
      badge: 'Dispute Defense'
    },
    {
      type: 'settlement.delayed' as const,
      name: 'settlement.delayed (Nodal Queue)',
      description: 'Simulates an acquiring bank payout lag over the weekend clearing window.',
      moduleTarget: 'Finance Controller',
      badge: 'Reconciliation'
    }
  ];

  const handleFireEvent = (type: any, name: string) => {
    triggerWebhookSimulation(type);
    setLastFiredEvent(name);
    setTimeout(() => {
      setLastFiredEvent(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between h-full">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-amber-50 text-amber-600 border border-amber-200">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Razorpay Webhook Sandbox Simulator
              </h3>
              <p className="text-[10px] text-slate-500">
                Trigger synthetic gateway webhook payloads in real time
              </p>
            </div>
          </div>
          <button
            id="close-simulator-drawer-btn"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {/* Status Feedback */}
          {lastFiredEvent && (
            <div className="flex items-center space-x-2 rounded border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 animate-pulse">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                Fired <strong>{lastFiredEvent}</strong> into MERCURY. Module telemetry updated!
              </span>
            </div>
          )}

          <div className="rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 space-y-1 leading-relaxed">
            <div className="flex items-center space-x-1.5 text-indigo-700 font-semibold">
              <Radio className="h-3.5 w-3.5 animate-pulse text-indigo-600" />
              <span>Live Test-Bed Engine</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Fire test events to see MERCURY's real-time AI anomaly detection, recovery playbooks, risk defenses, and reconciliation updates in action.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Available Webhook Events
            </div>

            {events.map((evt) => (
              <div
                key={evt.type}
                className="rounded border border-slate-200 bg-white p-3 hover:border-slate-300 transition-all space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {evt.name}
                  </span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-slate-600 border border-slate-200">
                    {evt.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {evt.description}
                </p>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    Target: <strong className="text-slate-700">{evt.moduleTarget}</strong>
                  </span>
                  <button
                    id={`fire-webhook-${evt.type}`}
                    onClick={() => handleFireEvent(evt.type, evt.name)}
                    className="flex items-center space-x-1 rounded bg-slate-900 px-2.5 py-1 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                  >
                    <Send className="h-2.5 w-2.5" />
                    <span>Fire Payload</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 p-3 text-[10px] text-slate-400 text-center font-mono">
          MERCURY Test Environment • Razorpay Sandbox v2.4
        </div>
      </div>
    </div>
  );
};
