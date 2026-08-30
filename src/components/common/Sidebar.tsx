import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  RefreshCw,
  ShieldAlert,
  Scale,
  Rocket,
  Bot,
  ScrollText,
  CheckCircle2,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { useMerchant } from '../../context/MerchantContext';
import { ActiveModule } from '../../types';

interface NavItem {
  id: ActiveModule;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  badgeCount?: number;
  badgeVariant?: 'danger' | 'warning' | 'info' | 'success';
}

export const Sidebar: React.FC = () => {
  const { 
    activeModule, 
    setActiveModule, 
    recoveryItems, 
    riskClusters, 
    reconciliationExceptions, 
    growthOpportunities,
    alerts,
    profile
  } = useMerchant();

  const recoverableCount = recoveryItems.filter(i => i.status === 'recoverable').length;
  const activeRiskCount = riskClusters.filter(r => r.status === 'active').length;
  const openExceptionsCount = reconciliationExceptions.filter(e => e.status === 'open').length;
  const growthCount = growthOpportunities.filter(g => g.status === 'available').length;

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      sublabel: 'Command Center',
      icon: LayoutDashboard
    },
    {
      id: 'revenue',
      label: 'Revenue',
      sublabel: 'Trends & Outages',
      icon: TrendingUp,
      badgeCount: alerts.filter(a => a.module === 'revenue' && a.status === 'active').length || undefined,
      badgeVariant: 'danger'
    },
    {
      id: 'recovery',
      label: 'Recovery',
      sublabel: 'Smart Retries & Links',
      icon: RefreshCw,
      badgeCount: recoverableCount || undefined,
      badgeVariant: 'warning'
    },
    {
      id: 'risk',
      label: 'Risk Control',
      sublabel: 'Fraud & Velocity',
      icon: ShieldAlert,
      badgeCount: activeRiskCount || undefined,
      badgeVariant: 'danger'
    },
    {
      id: 'finance',
      label: 'Reconciliation',
      sublabel: '4-Way Match',
      icon: Scale,
      badgeCount: openExceptionsCount || undefined,
      badgeVariant: 'warning'
    },
    {
      id: 'growth',
      label: 'Growth',
      sublabel: 'Checkout Funnel',
      icon: Rocket,
      badgeCount: growthCount || undefined,
      badgeVariant: 'info'
    },
    {
      id: 'copilot',
      label: 'MERCURY Copilot',
      sublabel: 'Specialist AI',
      icon: Bot,
      badgeVariant: 'success'
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      sublabel: 'Verified Actions',
      icon: ScrollText
    }
  ];

  return (
    <nav className="w-60 bg-slate-900 flex flex-col shrink-0 border-r border-slate-800 select-none z-20">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="text-emerald-400 font-bold text-xl tracking-tighter flex items-center space-x-2">
          <span>MERCURY</span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-semibold uppercase">
            PRO
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-1">
          Intelligence Layer
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-3 flex flex-col space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <div
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveModule(item.id)}
              className={`px-4 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                isActive
                  ? 'bg-slate-800 text-white font-medium shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                {isActive ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
                ) : (
                  <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className="text-sm tracking-tight truncate">{item.label}</span>
              </div>

              {/* Badge */}
              {item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span
                  className={`flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                    item.badgeVariant === 'danger'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : item.badgeVariant === 'warning'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {item.badgeCount}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Status Block */}
      <div className="p-4 bg-slate-950/60 text-[11px] text-slate-500 border-t border-slate-800 space-y-1.5">
        <div className="flex justify-between items-center">
          <span>API Mode</span>
          <span className={`font-semibold capitalize ${
            profile.environment === 'test' ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            Razorpay {profile.environment}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Telemetry Status</span>
          <span className="text-emerald-400 font-semibold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Synced (Live)</span>
          </span>
        </div>
      </div>
    </nav>
  );
};
