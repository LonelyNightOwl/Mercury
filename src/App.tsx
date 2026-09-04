import React, { useState } from 'react';
import { MerchantProvider, useMerchant } from './context/MerchantContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { GuardrailModal } from './components/common/GuardrailModal';
import { WebhookSimulatorDrawer } from './components/common/WebhookSimulatorDrawer';

// Module Components
import { OverviewDashboard } from './components/overview/OverviewDashboard';
import { RevenueIntelligence } from './components/revenue/RevenueIntelligence';
import { RevenueRecovery } from './components/recovery/RevenueRecovery';
import { RiskIntelligence } from './components/risk/RiskIntelligence';
import { FinanceController } from './components/finance/FinanceController';
import { GrowthIntelligence } from './components/growth/GrowthIntelligence';
import { MercuryCopilot } from './components/copilot/MercuryCopilot';
import { AuditTrail } from './components/audit/AuditTrail';

export type MercuryTheme = 'sage' | 'deep-space' | 'titanium' | 'scrip' | 'obsidian';

const MainLayout: React.FC = () => {
  const { activeModule, pendingAction, setPendingAction } = useMerchant();
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [theme, setTheme] = useState<MercuryTheme>('sage');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'overview':
        return <OverviewDashboard />;
      case 'revenue':
        return <RevenueIntelligence />;
      case 'recovery':
        return <RevenueRecovery />;
      case 'risk':
        return <RiskIntelligence />;
      case 'finance':
        return <FinanceController />;
      case 'growth':
        return <GrowthIntelligence />;
      case 'copilot':
        return <MercuryCopilot />;
      case 'audit':
        return <AuditTrail />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className={`mercury-app theme-${theme} flex h-screen w-full overflow-hidden font-sans antialiased selection:bg-lime-200 selection:text-slate-900`}>
      {/* Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f4f6f2]">
        {/* Top Navigation Bar */}
        <Navbar
          onOpenSimulator={() => setIsSimulatorOpen(true)}
          theme={theme}
          onThemeChange={setTheme}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f4f6f2]">
          <div className="mx-auto max-w-[1480px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
            {renderActiveModule()}
          </div>
        </main>
      </div>

      {/* Global Policy Guardrail Modal */}
      {pendingAction && (
        <GuardrailModal
          proposal={pendingAction}
          onClose={() => setPendingAction(null)}
        />
      )}

      {/* Webhook Simulator Drawer */}
      <WebhookSimulatorDrawer
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <MerchantProvider>
      <MainLayout />
    </MerchantProvider>
  );
}
