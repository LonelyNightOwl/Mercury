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

const MainLayout: React.FC = () => {
  const { activeModule, pendingAction, setPendingAction } = useMerchant();
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

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
    <div className="flex h-screen w-full bg-slate-50 font-sans overflow-hidden text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Left Sidebar Navigation (Deep Dark High-Density) */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top High Density Header */}
        <Navbar onOpenSimulator={() => setIsSimulatorOpen(true)} />

        {/* Center Main Stage Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6 bg-slate-50">
          <div className="mx-auto max-w-[1600px] w-full">
            {renderActiveModule()}
          </div>
        </main>
      </div>

      {/* Global Policy Guardrail Verification Modal */}
      {pendingAction && (
        <GuardrailModal
          proposal={pendingAction}
          onClose={() => setPendingAction(null)}
        />
      )}

      {/* Razorpay Webhook Sandbox Simulator Drawer */}
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
