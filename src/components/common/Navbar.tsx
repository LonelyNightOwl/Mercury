import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Radio, 
  Sparkles, 
  Bell, 
  ChevronDown, 
  RotateCw, 
  AlertTriangle, 
  Zap,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { useMerchant } from '../../context/MerchantContext';

interface NavbarProps {
  onOpenSimulator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSimulator }) => {
  const { 
    profile, 
    setProfile, 
    alerts, 
    selectedTimeframe, 
    setSelectedTimeframe,
    setActiveModule,
    activeModule
  } = useMerchant();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMerchantMenu, setShowMerchantMenu] = useState(false);

  const activeAlerts = alerts.filter(a => a.status === 'active');

  const toggleEnvironment = () => {
    setProfile(prev => ({
      ...prev,
      environment: prev.environment === 'test' ? 'live' : 'test'
    }));
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 shadow-2xs">
      {/* Left: Section Title & Version Badge */}
      <div className="flex items-center space-x-3">
        <h1 className="text-sm font-semibold text-slate-700">Merchant Command Center</h1>
        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-wider">
          v1.0.4-MVP
        </span>

        {/* Merchant Store Selector */}
        <div className="relative hidden md:block ml-2">
          <button 
            id="merchant-selector-btn"
            onClick={() => setShowMerchantMenu(!showMerchantMenu)}
            className="flex items-center space-x-2 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <span className="font-medium max-w-[140px] truncate">{profile.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showMerchantMenu && (
            <div className="absolute left-0 mt-1.5 w-56 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl z-50">
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Active Organization
              </div>
              <div className="rounded-md bg-slate-50 px-2 py-2 text-xs text-slate-800">
                <p className="font-semibold">{profile.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">MID: {profile.id}</p>
              </div>
              <div className="mt-1 border-t border-slate-100 pt-1">
                <div className="px-2 py-1 text-[11px] text-slate-500">
                  Gateway: Razorpay Enterprise
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Controls, Test Mode, Webhook Simulator & AI Status */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Timeframe Filter */}
        <div className="hidden lg:flex items-center rounded border border-slate-200 bg-slate-100 p-0.5 text-xs">
          {(['today', 'yesterday', '7d', '30d'] as const).map((tf) => (
            <button
              key={tf}
              id={`timeframe-btn-${tf}`}
              onClick={() => setSelectedTimeframe(tf)}
              className={`rounded px-2.5 py-1 font-medium transition-all ${
                selectedTimeframe === tf
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tf === 'today' ? 'Today' : tf === 'yesterday' ? 'Yesterday' : tf === '7d' ? 'Last 7D' : 'Last 30D'}
            </button>
          ))}
        </div>

        {/* AI Agent Active Indicator */}
        <div className="hidden sm:flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-medium text-slate-500 italic">AI Agent Active</span>
        </div>

        {/* Razorpay Test Mode Badge / Toggle */}
        <button
          id="toggle-environment-btn"
          onClick={toggleEnvironment}
          className={`flex items-center space-x-1.5 rounded px-2.5 py-1 text-xs font-semibold transition-all border ${
            profile.environment === 'test'
              ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
          }`}
          title="Toggle between Razorpay Test Sandbox and Live Production telemetry"
        >
          <Radio className="h-3 w-3" />
          <span className="capitalize">{profile.environment} Mode</span>
        </button>

        {/* Webhook Sandbox Simulator Button */}
        <button
          id="open-webhook-simulator-btn"
          onClick={onOpenSimulator}
          className="flex items-center space-x-1.5 rounded border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors shadow-2xs"
          title="Simulate incoming Razorpay webhook events"
        >
          <Zap className="h-3.5 w-3.5 text-indigo-600" />
          <span className="hidden md:inline">Simulate Events</span>
        </button>

        {/* Notifications & Anomaly Bell */}
        <div className="relative">
          <button
            id="notifications-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white animate-pulse">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {/* Anomaly Alerts Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50 text-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold text-slate-800">Live AI Merchant Alerts</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {activeAlerts.length} active anomalies
                </span>
              </div>

              <div className="mt-2 max-h-72 space-y-2 overflow-y-auto">
                {activeAlerts.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-500">
                    No active anomalies. All merchant systems operating normally.
                  </p>
                ) : (
                  activeAlerts.map(alert => (
                    <div 
                      key={alert.id}
                      className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 hover:border-slate-200 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                          alert.severity === 'high' 
                            ? 'bg-rose-100 text-rose-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {alert.module} • {alert.severity}
                        </span>
                        <span className="text-[10px] text-slate-400">{alert.detectedAt}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-800 mt-1">{alert.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{alert.description}</p>
                      <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-200">
                        <span className="text-[11px] font-mono text-indigo-600 font-bold">{alert.impactLabel}</span>
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            setActiveModule(alert.module as any);
                          }}
                          className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                        >
                          Investigate →
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Shortcut to Copilot */}
        <button
          id="nav-copilot-shortcut-btn"
          onClick={() => setActiveModule('copilot')}
          className={`flex items-center space-x-1.5 rounded px-2.5 py-1 text-xs font-semibold transition-all ${
            activeModule === 'copilot'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Ask Copilot</span>
        </button>

        {/* Merchant Avatar */}
        <div className="w-8 h-8 rounded bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
          M
        </div>
      </div>
    </header>
  );
};
