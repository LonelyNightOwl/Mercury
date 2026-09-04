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
    <nav className="w-56 bg-white flex flex-col shrink-0 border-r border-slate-100 select-none z-20">
      {/* Brand Header */}
      <div className="px-5 py-6 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-base font-semibold text-slate-900">Mercury</h2>
        </div>
        <p className="text-xs text-slate-500 mt-2">Merchant Intelligence</p>
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-3 flex flex-col space-y-1 overflow-y-auto px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;

          return (
            <div
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveModule(item.id)}
              className={`px-3 py-2.5 flex items-center justify-between cursor-pointer rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3 truncate min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-blue-600' : 'text-slate-400'
                }`} />
                <div className="truncate min-w-0">
                  <p className="text-sm font-medium truncate">{item.label}</p>
                  <p className="text-[11px] text-slate-500 truncate">{item.sublabel}</p>
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
      <div className="p-4 bg-slate-50 text-xs text-slate-600 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <span>Environment</span>
          <span className={`font-medium capitalize ${
            profile.environment === 'test' ? 'text-amber-600' : 'text-emerald-600'
          }`}>
            {profile.environment}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Status</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-700 font-medium">Live</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
