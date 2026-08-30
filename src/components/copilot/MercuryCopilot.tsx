import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Scale, 
  Rocket, 
  TrendingUp, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Cpu, 
  CornerDownLeft,
  User
} from 'lucide-react';
import { useMerchant } from '../../context/MerchantContext';
import { CopilotMessage, ActionProposal } from '../../types';

export const MercuryCopilot: React.FC = () => {
  const { 
    copilotMessages, 
    sendCopilotQuery, 
    isCopilotThinking, 
    setPendingAction, 
    formatCurrency 
  } = useMerchant();

  const [inputQuery, setInputQuery] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { text: "Why did revenue drop today?", specialist: "Revenue Intelligence" },
    { text: "Show failed payments worth recovering right now", specialist: "Revenue Recovery" },
    { text: "Is there any card testing or fraud attack happening?", specialist: "Risk Defense" },
    { text: "Reconcile my settlements and find fee overcharges", specialist: "Finance Controller" },
    { text: "How can I improve my checkout UPI conversion rate?", specialist: "Growth Intelligence" },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages, isCopilotThinking]);

  const handleSend = (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || isCopilotThinking) return;

    sendCopilotQuery(text, selectedSpecialist === 'all' ? undefined : selectedSpecialist);
    setInputQuery('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] space-y-3 pb-1">
      
      {/* Copilot Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 text-white font-bold">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xs font-bold text-slate-900 tracking-tight">MERCURY Copilot</h1>
              <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-700 border border-indigo-100">
                Specialist AI Orchestrator
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Natural language intelligence across Revenue, Recovery, Risk, Finance, and Growth.
            </p>
          </div>
        </div>

        {/* Specialist Focus Filter */}
        <div className="flex items-center space-x-1 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Specialists' },
            { id: 'revenue', label: 'Revenue' },
            { id: 'recovery', label: 'Recovery' },
            { id: 'risk', label: 'Risk' },
            { id: 'finance', label: 'Finance' },
            { id: 'growth', label: 'Growth' },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSpecialist(s.id)}
              className={`rounded px-2 py-0.5 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedSpecialist === s.id
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message Chat Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {copilotMessages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-700 border border-slate-200">
                  <Bot className="h-3.5 w-3.5" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded p-3.5 space-y-2.5 text-xs shadow-xs ${
                  isUser
                    ? 'bg-slate-800 text-white'
                    : 'border border-slate-200 bg-white text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] opacity-75">
                  <span className="font-semibold">
                    {isUser ? 'You (Merchant Admin)' : 'MERCURY Specialist Engine'}
                  </span>
                  <span className="font-mono">{msg.timestamp}</span>
                </div>

                <p className="leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>

                {/* Structured Key Findings */}
                {msg.keyFindings && msg.keyFindings.length > 0 && (
                  <div className="rounded border border-slate-100 bg-slate-50 p-2.5 space-y-1 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                      Key Telemetry Findings:
                    </span>
                    <ul className="space-y-0.5 text-slate-700">
                      {msg.keyFindings.map((finding, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested Action Proposal Card with Guardrail Sign-Off */}
                {msg.suggestedAction && (
                  <div className="rounded border border-slate-200 bg-slate-50 p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-700 border border-indigo-100">
                        {msg.suggestedAction.module} Action Proposal
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">
                        {msg.suggestedAction.impactAmount ? `+${formatCurrency(msg.suggestedAction.impactAmount)}` : 'Policy Verified'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{msg.suggestedAction.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{msg.suggestedAction.description}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                      <span className="text-[10px] text-slate-400 font-mono">
                        Policy Pre-Flight: {msg.suggestedAction.guardrailChecks.length} Passed
                      </span>

                      <button
                        id={`copilot-action-${msg.suggestedAction.id}`}
                        onClick={() => setPendingAction(msg.suggestedAction!)}
                        className="flex items-center space-x-1 rounded bg-emerald-500 text-slate-950 px-2.5 py-1 text-xs font-bold shadow-xs hover:bg-emerald-400 transition-colors cursor-pointer"
                      >
                        <Lock className="h-3 w-3" />
                        <span>Review & Execute</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-slate-200 text-slate-700">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isCopilotThinking && (
          <div className="flex items-center space-x-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-100 text-slate-700 border border-slate-200">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="rounded border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 flex items-center space-x-2 shadow-xs">
              <div className="h-3 w-3 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
              <span>MERCURY Specialist analyzing merchant telemetry...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompt Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Suggestions:
        </span>
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            id={`quick-prompt-${i}`}
            onClick={() => handleSend(qp.text)}
            className="flex items-center space-x-1 rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all shrink-0 cursor-pointer shadow-xs"
          >
            <Sparkles className="h-2.5 w-2.5 text-indigo-500 shrink-0" />
            <span>{qp.text}</span>
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="relative rounded border border-slate-200 bg-white p-2 shadow-xs focus-within:border-slate-400 transition-colors">
        <textarea
          id="copilot-input-field"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask MERCURY anything about your revenue, failed payments, carding attacks, settlements, or conversion..."
          rows={2}
          className="w-full resize-none bg-transparent px-2 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
        />

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 px-1 text-xs">
          <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
            <Lock className="h-3 w-3 text-emerald-600" />
            <span>Deterministic Policy Guardrail active</span>
          </div>

          <button
            id="copilot-submit-btn"
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isCopilotThinking}
            className={`flex items-center space-x-1 rounded px-3 py-1 text-xs font-bold transition-all ${
              inputQuery.trim() && !isCopilotThinking
                ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Ask Specialist</span>
            <Send className="h-2.5 w-2.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
