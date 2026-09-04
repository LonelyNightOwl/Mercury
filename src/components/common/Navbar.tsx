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
  ExternalLink,
  Palette
} from 'lucide-react';
import { useMerchant } from '../../context/MerchantContext';
import type { MercuryTheme } from '../../App';

interface NavbarProps {
  onOpenSimulator: () => void;
  theme: MercuryTheme;
  onThemeChange: (theme: MercuryTheme) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSimulator, theme, onThemeChange }) => {
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
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const activeAlerts = alerts.filter(a => a.status === 'active');

  const toggleEnvironment = () => {
    setProfile(prev => ({
      ...prev,
      environment: prev.environment === 'test' ? 'live' : 'test'
    }));
  };

  return (
    <header className="z-30 flex min-h-[84px] shrink-0 items-center justify-between border-b border-[#dde4df] bg-[#fdfefd]/90 px-4 shadow-sm backdrop-blur-xl sm:px-7">
      {/* Left: Logo & Branding */}
      <div className="flex min-w-0 items-center gap-4 sm:gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0d766d]">Merchant OS</p>
          <h1 className="text-lg font-bold leading-5 tracking-tight text-[#172033] sm:text-xl">Command Center</h1>
        </div>

        {/* Merchant Store Selector */}
        <span className="hidden rounded-full border border-[#cde8a2] bg-[#f1f9df] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#527b1b] xl:inline-flex">MVP / v1.0.4</span>
        <div className="relative hidden lg:block">
          <button 
            id="merchant-selector-btn"
            onClick={() => setShowMerchantMenu(!showMerchantMenu)}
            className="flex min-w-[270px] items-center justify-between gap-2 rounded-xl border border-[#dde4df] bg-white/70 px-3.5 py-2.5 text-sm text-slate-700 shadow-sm hover:bg-white"
          >
            <div className="h-2 w-2 rounded-full bg-[#0d766d] shadow-[0_0_0_4px_rgba(13,118,109,0.12)]"></div>
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
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Timeframe Filter */}
        <div className="hidden items-center gap-1 rounded-xl border border-[#dde4df] bg-white/60 p-1 text-xs 2xl:flex">
          {(['today', 'yesterday', '7d', '30d'] as const).map((tf) => (
            <button
              key={tf}
              id={`timeframe-btn-${tf}`}
              onClick={() => setSelectedTimeframe(tf)}
              className={`rounded-md px-3 py-1.5 font-medium transition-all ${
                selectedTimeframe === tf
                    ? 'bg-[#172033] text-white font-semibold shadow-sm'
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
          className={`flex min-h-[42px] items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
            profile.environment === 'test'
              ? 'border-[#f4c95d] bg-[#fff8df] text-[#98720c] hover:bg-[#fff2c2]'
              : 'border-[#bfe3b5] bg-[#edf9e9] text-[#36733b] hover:bg-[#e2f5dd]'
          }`}
        >
          <Radio className="h-3.5 w-3.5" />
          <span className="capitalize">{profile.environment} Mode</span>
        </button>

        {/* Webhook Simulator */}
        <button
          id="open-webhook-simulator-btn"
          onClick={onOpenSimulator}
          className="flex min-h-[42px] items-center gap-2 rounded-xl border border-[#b8ddd8] bg-[#eaf7f5] px-3 py-2 text-xs font-bold text-[#0d766d] hover:bg-[#dff1ee]"
        >
          <Zap className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Simulate</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            id="notifications-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#dde4df] bg-white/70 text-slate-600 shadow-sm hover:bg-white"
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
          className={`hidden min-h-[42px] items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all xl:flex ${
            activeModule === 'copilot'
              ? 'bg-[#172033] text-white'
              : 'border border-[#dde4df] bg-white/70 text-slate-700 hover:bg-white'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">AI</span>
        </button>

        {/* Theme control */}
        <div className="relative">
          <button
            id="theme-selector-btn"
            aria-label={`${theme} theme`}
            title={`${theme} theme`}
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#cde8a2] bg-[#f1f9df] text-[#527b1b] shadow-sm hover:bg-[#e5f5c7]"
          >
            <Palette className="h-4 w-4" />
          </button>

          {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#dde4df] bg-white p-2 shadow-xl">
                <button
                  onClick={() => {
                    onThemeChange('sage');
                    setShowThemeMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold ${theme === 'sage' ? 'bg-[#f1f9df] text-[#527b1b]' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>Sage</span>
                  <span className="h-2 w-2 rounded-full bg-[#0d766d]" />
                </button>
                <button
                  onClick={() => {
                    onThemeChange('deep-space');
                    setShowThemeMenu(false);
                  }}
                  className={`mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold ${theme === 'deep-space' ? 'bg-[#111a31] text-[#42e8ff]' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>Deep Space</span>
                  <span className="h-2 w-2 rounded-full bg-[#42e8ff]" />
                </button>
                <button
                  onClick={() => {
                    onThemeChange('titanium');
                    setShowThemeMenu(false);
                  }}
                  className={`mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold ${theme === 'titanium' ? 'bg-[#eef2f8] text-[#315bff]' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>MERCURY TITANIUM</span>
                  <span className="h-2 w-2 rounded-full bg-[#315bff]" />
                </button>
                <button
                  onClick={() => {
                    onThemeChange('scrip');
                    setShowThemeMenu(false);
                  }}
                  className={`mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold ${theme === 'scrip' ? 'bg-[#111614] text-[#39b982]' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>SCRIP</span>
                  <span className="h-2 w-2 rounded-full bg-[#39b982]" />
                </button>
                <button
                  onClick={() => {
                    onThemeChange('obsidian');
                    setShowThemeMenu(false);
                  }}
                  className={`mt-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold ${theme === 'obsidian' ? 'bg-[#1d2024] text-[#f2f3f1]' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>OBSIDIAN</span>
                  <span className="h-2 w-2 rounded-full bg-[#6c9fe8]" />
                </button>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-[#172033] text-xs font-bold text-[#b7e36c] shadow-lg shadow-slate-900/10 transition-shadow hover:shadow-xl">
          M
        </div>
      </div>
    </header>
  );
};
