import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  Ticket, 
  Cpu, 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  PlusCircle, 
  Printer, 
  Smartphone, 
  ShieldCheck, 
  HardDrive, 
  Sparkles,
  RefreshCw,
  Clock,
  Radio
} from 'lucide-react';
import { RouterDevice, Voucher, ActiveSession, MobileMoneyTransaction, BillingPlan } from '../types';

interface DashboardOverviewProps {
  router: RouterDevice;
  vouchers: Voucher[];
  activeSessions: ActiveSession[];
  transactions: MobileMoneyTransaction[];
  plans: BillingPlan[];
  openVoucherModal: () => void;
  openRouterModal: () => void;
  setActiveTab: (tab: string) => void;
  language: 'sw' | 'en';
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  router,
  vouchers,
  activeSessions,
  transactions,
  plans,
  openVoucherModal,
  openRouterModal,
  setActiveTab,
  language,
}) => {
  // Live bandwidth simulation
  const [downloadRate, setDownloadRate] = useState(14.8); // Mbps
  const [uploadRate, setUploadRate] = useState(4.2); // Mbps
  const [trafficHistory, setTrafficHistory] = useState<number[]>([12, 14, 11, 15, 18, 16, 14, 19, 21, 17, 14.8]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newRx = +(Math.random() * 8 + 10).toFixed(1);
      const newTx = +(Math.random() * 4 + 2).toFixed(1);
      setDownloadRate(newRx);
      setUploadRate(newTx);
      setTrafficHistory((prev) => [...prev.slice(1), newRx]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalRevenue = transactions.reduce((acc, t) => acc + (t.status === 'completed' ? t.amountTzs : 0), 0) + 
    vouchers.filter(v => v.status === 'active' || v.status === 'expired').reduce((acc, v) => acc + v.priceTzs, 0);

  const activeVouchersCount = vouchers.filter((v) => v.status === 'active').length;
  const unusedVouchersCount = vouchers.filter((v) => v.status === 'unused').length;

  return (
    <div className="space-y-6">
      {/* Banner / Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {router.model} ONLINE
            </span>
            <span className="text-slate-400 text-xs font-mono">Location: {router.name}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {language === 'sw' ? 'XCLOUD MIKROTIK BILLING TANZANIA' : 'XCLOUD MIKROTIK BILLING TANZANIA'}
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            {language === 'sw' 
              ? 'Mfumo wa kisasa wa kusimamia Hotspot, Vocha za TSh, malipo ya M-Pesa, Tigo Pesa, Airtel & HaloPesa, na WireGuard tunnel kwenye RB941.'
              : 'Enterprise-grade hotspot billing platform with mobile money auto-invoicing, thermal voucher printer, and real-time RouterOS session synchronization.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={openVoucherModal}
            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-sky-500/25 transition transform active:scale-95 text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'sw' ? 'Tengeneza Vocha Mpya' : 'Generate Vouchers'}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('vouchers')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition text-sm"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>{language === 'sw' ? 'Chapisha Thermal POS' : 'Print Thermal POS'}</span>
          </button>

          <button
            onClick={openRouterModal}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition text-sm"
          >
            <Radio className="w-4 h-4 text-sky-400" />
            <span>{language === 'sw' ? 'Sanidi WireGuard' : 'WireGuard Sync'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl shadow-sm hover:border-slate-700 transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {language === 'sw' ? 'Mapato Jumla (TZS)' : 'Total Revenue (TZS)'}
              </p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                TSh {totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/20 rounded-xl text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +24% wiki hii
            </span>
            <span>{transactions.length} M-Pesa / Tigo TX</span>
          </div>
        </div>

        {/* Active Hotspot Sessions */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl shadow-sm hover:border-slate-700 transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {language === 'sw' ? 'Watumiaji Hewani' : 'Active Connected Users'}
              </p>
              <h3 className="text-2xl font-black text-sky-400 mt-1 font-mono">
                {activeSessions.length} <span className="text-sm font-normal text-slate-400">Wateja</span>
              </h3>
            </div>
            <div className="p-2.5 bg-sky-950/60 border border-sky-500/20 rounded-xl text-sky-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span className="text-sky-300 font-medium">RB941 wlan1 bridge</span>
            <button 
              onClick={() => setActiveTab('sessions')}
              className="text-sky-400 hover:underline font-semibold"
            >
              {language === 'sw' ? 'Tazama wote' : 'View all'}
            </button>
          </div>
        </div>

        {/* Vouchers in Circulation */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl shadow-sm hover:border-slate-700 transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {language === 'sw' ? 'Hali ya Vocha' : 'Voucher Inventory'}
              </p>
              <h3 className="text-2xl font-black text-amber-400 mt-1 font-mono">
                {unusedVouchersCount} <span className="text-sm font-normal text-slate-400">Zinazofaa / {vouchers.length}</span>
              </h3>
            </div>
            <div className="p-2.5 bg-amber-950/60 border border-amber-500/20 rounded-xl text-amber-400">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span className="text-emerald-400 font-medium">{activeVouchersCount} Zinatumika Sasa</span>
            <button onClick={() => setActiveTab('vouchers')} className="text-amber-400 hover:underline font-semibold">
              POS / Print
            </button>
          </div>
        </div>

        {/* MikroTik RB941 Hardware Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl shadow-sm hover:border-slate-700 transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {language === 'sw' ? 'Afya ya Router (RB941)' : 'RB941 Hardware Health'}
              </p>
              <h3 className="text-2xl font-black text-purple-400 mt-1 font-mono">
                {router.cpuUsage}% <span className="text-sm font-normal text-slate-400">CPU Load</span>
              </h3>
            </div>
            <div className="p-2.5 bg-purple-950/60 border border-purple-500/20 rounded-xl text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span>RAM: {router.ramUsage}MB / {router.ramTotal}MB</span>
            <span className="text-emerald-400 font-mono">{router.temperature}°C ({router.voltage}V)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Bandwidth Monitor + Tanzania Payment Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-Time Bandwidth & Router Live Traffic */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
                <h3 className="font-bold text-white text-base">
                  {language === 'sw' ? 'Bandwidth ya Moja kwa Moja (Live RB941 Traffic)' : 'Real-Time Bandwidth & Queue Monitor'}
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                MikroTik Hotspot Interface: <span className="text-sky-300 font-mono">{router.hotspotInterface}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">Download:</span>
                <span className="font-bold text-emerald-400">{downloadRate} Mbps</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-slate-400">Upload:</span>
                <span className="font-bold text-sky-400">{uploadRate} Mbps</span>
              </div>
            </div>
          </div>

          {/* Simple Visual Traffic Bars / Sparkline */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-end gap-1.5 h-32 w-full pt-4">
              {trafficHistory.map((val, idx) => {
                const heightPercent = Math.min(100, Math.max(15, (val / 30) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div 
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-sky-600 to-emerald-400 rounded-t transition-all duration-500 hover:brightness-125 relative"
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] text-white font-mono px-1.5 py-0.5 rounded shadow whitespace-nowrap z-10 transition">
                        {val} Mbps
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
              <span>-30 sec ago</span>
              <span>-15 sec ago</span>
              <span>Sasa Hivi / Real-Time Live</span>
            </div>
          </div>

          {/* Connected Plans Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {plans.slice(0, 3).map((plan) => (
              <div key={plan.id} className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
                <span className="text-xs font-semibold text-slate-300 block truncate">{plan.nameSwahili}</span>
                <div className="flex justify-between items-baseline mt-1">
                  <span className="text-emerald-400 font-bold font-mono text-sm">TSh {plan.priceTzs.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{plan.rateLimit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tanzania Mobile Money Gateway Live Status & Payments */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  {language === 'sw' ? 'Malipo ya Simu (TZ)' : 'Mobile Money Gateways'}
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                AUTO STK ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              {language === 'sw' 
                ? 'Mgawanyo wa wateja wanaonunua bando moja kwa moja kupitia simu:'
                : 'Automated self-service purchases via Tanzanian telco gateways:'}
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-red-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span> Vodacom M-Pesa (64%)
                  </span>
                  <span className="text-slate-300 font-mono">TSh 95,000</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-blue-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span> Tigo Pesa / Mixx (22%)
                  </span>
                  <span className="text-slate-300 font-mono">TSh 32,500</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '22%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span> Airtel Money (10%)
                  </span>
                  <span className="text-slate-300 font-mono">TSh 15,000</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-orange-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-orange-500"></span> HaloPesa (4%)
                  </span>
                  <span className="text-slate-300 font-mono">TSh 6,000</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '4%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('payments')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <span>{language === 'sw' ? 'Sanidi Daraja / USSD Webhook' : 'Configure Gateway APIs'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Recent Transactions & Connected Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent M-Pesa / Tigo Transactions */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span>{language === 'sw' ? 'Miamala ya Hivi Karibuni' : 'Recent Mobile Money Payments'}</span>
            </h3>
            <button
              onClick={() => setActiveTab('payments')}
              className="text-xs text-sky-400 hover:underline"
            >
              {language === 'sw' ? 'Tazama yote' : 'View all'}
            </button>
          </div>

          <div className="divide-y divide-slate-800 overflow-x-auto">
            {transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg font-bold text-[10px] ${
                    tx.provider === 'mpesa' ? 'bg-red-950 text-red-400 border border-red-800/50' :
                    tx.provider === 'tigopesa' ? 'bg-blue-950 text-blue-400 border border-blue-800/50' :
                    tx.provider === 'airtel' ? 'bg-amber-950 text-amber-400 border border-amber-800/50' :
                    'bg-orange-950 text-orange-400 border border-orange-800/50'
                  }`}>
                    {tx.provider.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{tx.phoneNumber} ({tx.customerName})</div>
                    <div className="text-[11px] text-slate-400">{tx.planName} • <span className="font-mono text-sky-300">{tx.voucherCode}</span></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400 font-mono">TSh {tx.amountTzs.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-500">{tx.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hotspot Devices Active */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>{language === 'sw' ? 'Wateja Waliopo Kwenye Mtandao' : 'Live Hotspot Clients on RB941'}</span>
            </h3>
            <button
              onClick={() => setActiveTab('sessions')}
              className="text-xs text-emerald-400 hover:underline"
            >
              {language === 'sw' ? 'Simamia wateja' : 'Manage sessions'}
            </button>
          </div>

          <div className="divide-y divide-slate-800 overflow-x-auto">
            {activeSessions.slice(0, 4).map((sess) => (
              <div key={sess.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span>{sess.deviceName}</span>
                    <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                      {sess.ipAddress}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    MAC: {sess.macAddress} | Vocha: <span className="text-sky-300">{sess.username}</span>
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-slate-300 text-[11px]">Uptime: {sess.uptime}</div>
                  <div className="text-emerald-400 font-bold text-[10px]">Baki: {sess.timeLeft}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
