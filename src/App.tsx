import React, { useState, useEffect } from 'react';
import { 
  initialRouter, 
  initialPlans, 
  initialVouchers, 
  initialActiveSessions, 
  initialTransactions, 
  initialPortalConfig, 
  initialAgents 
} from './data/mockData';
import { 
  RouterDevice, 
  BillingPlan, 
  Voucher, 
  ActiveSession, 
  MobileMoneyTransaction, 
  CaptivePortalConfig, 
  AgentUser, 
  UserRole 
} from './types';

import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { VouchersList } from './components/VouchersList';
import { ActiveSessionsMonitor } from './components/ActiveSessionsMonitor';
import { PlansManager } from './components/PlansManager';
import { CaptivePortalStudio } from './components/CaptivePortalStudio';
import { PaymentGatewaySettings } from './components/PaymentGatewaySettings';
import { WireGuardRemoteManager } from './components/WireGuardRemoteManager';
import { RBACAgentsManager } from './components/RBACAgentsManager';

import { VoucherGeneratorModal } from './components/VoucherGeneratorModal';
import { RouterSetupModal } from './components/RouterSetupModal';
import { ThermalPrintView } from './components/ThermalPrintView';
import { PdfVoucherGrid } from './components/PdfVoucherGrid';

export default function App() {
  const [language, setLanguage] = useState<'sw' | 'en'>('sw');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('super_admin');

  // Core State with Local Storage or Defaults
  const [router, setRouter] = useState<RouterDevice>(() => {
    const saved = localStorage.getItem('xcloud_router');
    return saved ? JSON.parse(saved) : initialRouter;
  });

  const [plans, setPlans] = useState<BillingPlan[]>(() => {
    const saved = localStorage.getItem('xcloud_plans');
    return saved ? JSON.parse(saved) : initialPlans;
  });

  const [vouchers, setVouchers] = useState<Voucher[]>(() => {
    const saved = localStorage.getItem('xcloud_vouchers');
    return saved ? JSON.parse(saved) : initialVouchers;
  });

  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(() => {
    const saved = localStorage.getItem('xcloud_sessions');
    return saved ? JSON.parse(saved) : initialActiveSessions;
  });

  const [transactions, setTransactions] = useState<MobileMoneyTransaction[]>(() => {
    const saved = localStorage.getItem('xcloud_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [portalConfig, setPortalConfig] = useState<CaptivePortalConfig>(() => {
    const saved = localStorage.getItem('xcloud_portal');
    return saved ? JSON.parse(saved) : initialPortalConfig;
  });

  const [agents, setAgents] = useState<AgentUser[]>(() => {
    const saved = localStorage.getItem('xcloud_agents');
    return saved ? JSON.parse(saved) : initialAgents;
  });

  // Modals
  const [isVoucherGenOpen, setIsVoucherGenOpen] = useState(false);
  const [isRouterModalOpen, setIsRouterModalOpen] = useState(false);
  const [thermalPrintVouchers, setThermalPrintVouchers] = useState<Voucher[] | null>(null);
  const [pdfPrintVouchers, setPdfPrintVouchers] = useState<Voucher[] | null>(null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('xcloud_router', JSON.stringify(router));
  }, [router]);

  useEffect(() => {
    localStorage.setItem('xcloud_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('xcloud_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('xcloud_sessions', JSON.stringify(activeSessions));
  }, [activeSessions]);

  useEffect(() => {
    localStorage.setItem('xcloud_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('xcloud_portal', JSON.stringify(portalConfig));
  }, [portalConfig]);

  useEffect(() => {
    localStorage.setItem('xcloud_agents', JSON.stringify(agents));
  }, [agents]);

  // Handlers
  const handleBatchGenerateVouchers = (newVouchers: Voucher[], printMode?: 'thermal' | 'pdf') => {
    setVouchers((prev) => [...newVouchers, ...prev]);
    if (printMode === 'thermal') {
      setThermalPrintVouchers(newVouchers);
    } else if (printMode === 'pdf') {
      setPdfPrintVouchers(newVouchers);
    }
  };

  const handleDeleteVouchers = (voucherIds: string[]) => {
    setVouchers((prev) => prev.filter((v) => !voucherIds.includes(v.id)));
  };

  const handleSavePlan = (plan: BillingPlan) => {
    setPlans((prev) => {
      const idx = prev.findIndex((p) => p.id === plan.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = plan;
        return next;
      }
      return [plan, ...prev];
    });
  };

  const handleDeletePlan = (planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
  };

  const handleKickUser = (sessionId: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleExtendTime = (sessionId: string) => {
    setActiveSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          return { ...s, timeLeft: '01:59:59', uptime: s.uptime + ' (+1h)' };
        }
        return s;
      })
    );
  };

  const handleAddTransaction = (tx: MobileMoneyTransaction, newVoucher: Voucher) => {
    setTransactions((prev) => [tx, ...prev]);
    setVouchers((prev) => [newVoucher, ...prev]);
    // Also add to active sessions
    const newSession: ActiveSession = {
      id: `sess-${Date.now()}`,
      username: newVoucher.code,
      ipAddress: '192.168.88.102',
      macAddress: '84:C7:EA:21:49:10',
      deviceName: 'M-Pesa Customer Phone',
      planName: newVoucher.planName,
      uptime: '00:01:10',
      timeLeft: newVoucher.durationDisplay,
      bytesIn: 1024000,
      bytesOut: 8500000,
      rateLimit: newVoucher.speedLimit,
      signalStrengthDbm: -52,
      loginMethod: 'mobile_money',
    };
    setActiveSessions((prev) => [newSession, ...prev]);
  };

  const handleSaveAgent = (agent: AgentUser) => {
    setAgents((prev) => [agent, ...prev]);
  };

  // Calculate total revenue
  const totalRevenueTzs =
    transactions.reduce((acc, t) => acc + (t.status === 'completed' ? t.amountTzs : 0), 0) +
    vouchers.filter((v) => v.status === 'active' || v.status === 'expired').reduce((acc, v) => acc + v.priceTzs, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        router={router}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        totalRevenueTzs={totalRevenueTzs}
        openRouterModal={() => setIsRouterModalOpen(true)}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            router={router}
            vouchers={vouchers}
            activeSessions={activeSessions}
            transactions={transactions}
            plans={plans}
            openVoucherModal={() => setIsVoucherGenOpen(true)}
            openRouterModal={() => setIsRouterModalOpen(true)}
            setActiveTab={setActiveTab}
            language={language}
          />
        )}

        {activeTab === 'vouchers' && (
          <VouchersList
            vouchers={vouchers}
            plans={plans}
            router={router}
            onOpenGenerator={() => setIsVoucherGenOpen(true)}
            onPrintThermal={(selected) => setThermalPrintVouchers(selected)}
            onPrintPdf={(selected) => setPdfPrintVouchers(selected)}
            onDeleteVouchers={handleDeleteVouchers}
            language={language}
          />
        )}

        {activeTab === 'sessions' && (
          <ActiveSessionsMonitor
            sessions={activeSessions}
            router={router}
            onKickUser={handleKickUser}
            onExtendTime={handleExtendTime}
            language={language}
          />
        )}

        {activeTab === 'plans' && (
          <PlansManager
            plans={plans}
            onSavePlan={handleSavePlan}
            onDeletePlan={handleDeletePlan}
            language={language}
          />
        )}

        {activeTab === 'portal' && (
          <CaptivePortalStudio
            portalConfig={portalConfig}
            onUpdateConfig={setPortalConfig}
            plans={plans}
            language={language}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentGatewaySettings
            transactions={transactions}
            plans={plans}
            onAddTransaction={handleAddTransaction}
            language={language}
          />
        )}

        {activeTab === 'wireguard' && (
          <WireGuardRemoteManager
            router={router}
            onUpdateRouter={setRouter}
            language={language}
          />
        )}

        {activeTab === 'agents' && (
          <RBACAgentsManager
            agents={agents}
            onSaveAgent={handleSaveAgent}
            language={language}
          />
        )}
      </main>

      {/* Global Modals */}
      <VoucherGeneratorModal
        isOpen={isVoucherGenOpen}
        onClose={() => setIsVoucherGenOpen(false)}
        plans={plans}
        agents={agents}
        onGenerate={handleBatchGenerateVouchers}
        language={language}
      />

      <RouterSetupModal
        isOpen={isRouterModalOpen}
        onClose={() => setIsRouterModalOpen(false)}
        router={router}
        plans={plans}
        onUpdateRouter={setRouter}
        language={language}
      />

      {thermalPrintVouchers && (
        <ThermalPrintView
          vouchers={thermalPrintVouchers}
          router={router}
          onClose={() => setThermalPrintVouchers(null)}
          language={language}
        />
      )}

      {pdfPrintVouchers && (
        <PdfVoucherGrid
          vouchers={pdfPrintVouchers}
          router={router}
          onClose={() => setPdfPrintVouchers(null)}
          language={language}
        />
      )}
    </div>
  );
}
