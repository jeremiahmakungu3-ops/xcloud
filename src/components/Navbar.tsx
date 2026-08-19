import React from 'react';
import { 
  Wifi, 
  Server, 
  ShieldCheck, 
  Activity, 
  CreditCard, 
  Ticket, 
  Sliders, 
  Users, 
  Radio, 
  Palette, 
  Printer, 
  Layers,
  ChevronDown
} from 'lucide-react';
import { RouterDevice, UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  router: RouterDevice;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  totalRevenueTzs: number;
  openRouterModal: () => void;
  language: 'sw' | 'en';
  setLanguage: (lang: 'sw' | 'en') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  router,
  currentRole,
  setCurrentRole,
  totalRevenueTzs,
  openRouterModal,
  language,
  setLanguage,
}) => {
  const tabs = [
    { id: 'dashboard', label: language === 'sw' ? 'Dashibodi Kuu' : 'Dashboard', icon: Activity },
    { id: 'vouchers', label: language === 'sw' ? 'Vocha & Tiketi' : 'Vouchers & POS', icon: Ticket },
    { id: 'sessions', label: language === 'sw' ? 'Watumiaji Hewani' : 'Active Sessions', icon: Users },
    { id: 'plans', label: language === 'sw' ? 'Mabando / Packages' : 'Billing Plans', icon: Sliders },
    { id: 'portal', label: language === 'sw' ? 'Studio ya Portal' : 'Captive Studio', icon: Palette },
    { id: 'payments', label: language === 'sw' ? 'Malipo M-Pesa/Tigo' : 'Payment Gateways', icon: CreditCard },
    { id: 'wireguard', label: language === 'sw' ? 'XCloud Remote' : 'Cloud WireGuard', icon: Radio },
    { id: 'agents', label: language === 'sw' ? 'Mawakala / Agents' : 'Agents & RBAC', icon: Layers },
  ];

  // Restrict tabs if in Sales Agent mode
  const filteredTabs = currentRole === 'sales_agent' 
    ? tabs.filter(t => ['vouchers', 'sessions', 'dashboard'].includes(t.id))
    : tabs;

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-slate-100 shadow-md">
      {/* Top micro bar */}
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between text-xs border-b border-slate-800/80 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-300">MikroTik RB941:</span>
            <button 
              onClick={openRouterModal}
              className="text-emerald-400 hover:text-emerald-300 hover:underline font-mono flex items-center gap-1"
            >
              {router.tunnelIp} ({router.wireguardStatus.latencyMs}ms)
            </button>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">
            CPU: <b className="text-slate-200">{router.cpuUsage}%</b> | RAM: <b className="text-slate-200">{router.ramUsage}MB/{router.ramTotal}MB</b>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Total revenue badge */}
          <div className="bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1.5">
            <span className="text-slate-400 font-sans">{language === 'sw' ? 'Mauzo Leo:' : 'Today Sales:'}</span>
            <span className="font-bold">TSh {totalRevenueTzs.toLocaleString()}</span>
          </div>

          {/* Language Selector */}
          <button
            onClick={() => setLanguage(language === 'sw' ? 'en' : 'sw')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-medium transition"
            title="Toggle Swahili / English"
          >
            {language === 'sw' ? '🇹🇿 Kiswahili' : '🇬🇧 English'}
          </button>

          {/* Role selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer font-medium"
            >
              <option value="super_admin" className="bg-slate-900 text-slate-100">Super Admin (HQ)</option>
              <option value="hotspot_manager" className="bg-slate-900 text-slate-100">Hotspot Manager</option>
              <option value="sales_agent" className="bg-slate-900 text-slate-100">Wakala / Agent POS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-sky-500/20 flex items-center justify-center">
            <Wifi className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-white font-mono">XCLOUD<span className="text-sky-400">.TZ</span></span>
              <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.2 rounded">RB941 BILLING</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Tanzania MikroTik Hotspot & Captive Studio</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={openRouterModal}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <Server className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">{language === 'sw' ? 'Sanidi Router' : 'Router Setup'}</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 flex space-x-1 overflow-x-auto scrollbar-none border-t border-slate-800/60">
        {filteredTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition ${
                isActive
                  ? 'border-sky-400 text-sky-400 bg-sky-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
