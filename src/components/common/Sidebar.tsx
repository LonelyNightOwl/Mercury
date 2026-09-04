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
    <nav className="flex w-16 shrink-0 select-none flex-col border-r border-slate-800 bg-[#172033] text-white shadow-2xl shadow-slate-900/10 md:w-64">
      {/* Brand Header */}
      <div className="border-b border-white/10 px-2 py-5 md:px-5 md:py-6">
        <div className="flex items-center">
          <div className="hidden min-w-0 md:block">
            <h2 className="mercury-brand-name text-[1.08rem] font-medium uppercase leading-none tracking-[0.28em] text-white">MERCURY</h2>
            <p className="mercury-brand-subtitle mt-1.5 whitespace-nowrap text-[8px] font-medium uppercase leading-none tracking-[0.27em] text-slate-400">Merchant Currency</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex flex-1 flex-col space-y-1 overflow-y-auto px-2 py-5 md:px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <div
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveModule(item.id)}
              title={item.label}
              className={`group flex cursor-pointer items-center justify-between rounded-xl px-2 py-3 transition-all md:px-3 ${
                isActive
                  ? 'bg-white text-[#172033] shadow-lg shadow-black/10'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex min-w-0 items-center justify-center space-x-3 truncate md:justify-start">
                <Icon className={`h-4 w-4 shrink-0 ${
                  isActive ? 'text-[#0d766d]' : 'text-slate-500 group-hover:text-[#b7e36c]'
                }`} />
                <div className="hidden min-w-0 truncate md:block">
                  <p className="truncate text-sm font-medium">{item.label}</p>
                  <p className={`truncate text-[11px] ${isActive ? 'text-slate-500' : 'text-slate-500'}`}>{item.sublabel}</p>
                </div>
              </div>

              {/* Badge */}
              {item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span
                  className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold shrink-0 ml-2 ${
                    item.badgeVariant === 'danger'
                      ? 'bg-rose-100 text-rose-700'
                      : item.badgeVariant === 'warning'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {item.badgeCount}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Status */}
      <div className="hidden space-y-3 border-t border-white/10 bg-black/10 p-4 text-xs text-slate-300 md:block">
        <div className="flex items-center justify-between">
          <span>Environment</span>
            <span className={`font-semibold capitalize ${
            profile.environment === 'test' ? 'text-[#f4c95d]' : 'text-[#b7e36c]'
          }`}>
            {profile.environment}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Status</span>
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#b7e36c]"></span>
            <span className="font-medium text-[#b7e36c]">Live</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
