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
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-30 shadow-sm">
      {/* Left: Logo & Branding */}
      <div className="flex items-center space-x-5">
        <div>
          <h1 className="text-[20px] font-bold leading-6 text-slate-700">Merchant<br />Command Center</h1>
        </div>

        {/* Merchant Store Selector */}
        <span className="hidden xl:inline-flex rounded-md bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-600">V1.0.4 – MVP</span>
        <div className="relative hidden lg:block">
          <button 
            id="merchant-selector-btn"
            onClick={() => setShowMerchantMenu(!showMerchantMenu)}
            className="flex min-w-[300px] items-center justify-between space-x-2 rounded-md border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 hover:bg-white transition-colors"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <span className="font-medium max-w-[160px] truncate">{profile.name}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {showMerchantMenu && (
            <div className="absolute left-0 mt-2 w-64 rounded-xl border border-slate-100 bg-white p-3 shadow-lg z-50">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Merchant Account
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-3 text-sm text-slate-900">
                <p className="font-semibold">{profile.name}</p>
                <p className="text-xs text-slate-600 mt-1">ID: {profile.id}</p>
                <p className="text-xs text-slate-600 mt-1">Gateway: Razorpay Enterprise</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Controls & Actions */}
      <div className="flex items-center space-x-4">
        {/* Timeframe Filter */}
        <div className="hidden 2xl:flex items-center rounded-lg bg-slate-100 p-1 text-xs gap-1">
          {(['today', 'yesterday', '7d', '30d'] as const).map((tf) => (
            <button
              key={tf}
              id={`timeframe-btn-${tf}`}
              onClick={() => setSelectedTimeframe(tf)}
              className={`rounded-md px-3 py-1.5 font-medium transition-all ${
                selectedTimeframe === tf
                  ? 'bg-white text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf === 'today' ? 'Today' : tf === 'yesterday' ? 'Yesterday' : tf === '7d' ? '7 days' : '30 days'}
            </button>
          ))}
        </div>

        {/* Environment Toggle */}
        <button
          id="toggle-environment-btn"
          onClick={toggleEnvironment}
          className={`flex min-h-[48px] items-center space-x-2 rounded-md border px-4 py-2 text-sm font-semibold transition-all ${
            profile.environment === 'test'
              ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          <Radio className="h-3.5 w-3.5" />
          <span className="capitalize">{profile.environment} Mode</span>
        </button>

        {/* Webhook Simulator */}
        <button
          id="open-webhook-simulator-btn"
          onClick={onOpenSimulator}
          className="flex min-h-[48px] items-center space-x-2 rounded-md border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 text-sm font-semibold transition-colors"
        >
          <Zap className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Simulate</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            id="notifications-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors relative"
          >
            <Bell className="h-4 w-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                {activeAlerts.length > 9 ? '9+' : activeAlerts.length}
              </span>
            )}
          </button>

          {/* Alerts Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 rounded-xl border border-slate-100 bg-white p-4 shadow-lg z-50">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Alerts</h3>
                <span className="text-xs font-medium text-slate-500">
                  {activeAlerts.length} active
                </span>
              </div>

              <div className="max-h-80 space-y-2 overflow-y-auto">
                {activeAlerts.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    All systems normal
                  </p>
                ) : (
                  activeAlerts.map(alert => (
                    <div 
                      key={alert.id}
                      className="rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setShowNotifications(false);
                        setActiveModule(alert.module as any);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-xs font-semibold text-slate-900">{alert.title}</h4>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{alert.description}</p>
                        </div>
                        <span className={`text-[9px] font-semibold px-2 py-1 rounded whitespace-nowrap ${
                          alert.severity === 'high' 
                            ? 'bg-rose-100 text-rose-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Copilot Button */}
        <button
          id="nav-copilot-shortcut-btn"
          onClick={() => setActiveModule('copilot')}
          className={`hidden xl:flex min-h-[48px] items-center space-x-2 rounded-md px-4 py-2 text-sm font-semibold transition-all ${
            activeModule === 'copilot'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">AI</span>
        </button>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center text-xs font-bold text-white hover:shadow-md transition-shadow cursor-pointer">
          M
        </div>
      </div>
    </header>
  );
};
