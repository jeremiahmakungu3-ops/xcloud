import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  Send, 
  RefreshCw, 
  DollarSign, 
  ShieldCheck, 
  ArrowUpRight,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MobileMoneyTransaction, BillingPlan, Voucher } from '../types';

interface PaymentGatewaySettingsProps {
  transactions: MobileMoneyTransaction[];
  plans: BillingPlan[];
  onAddTransaction: (tx: MobileMoneyTransaction, newVoucher: Voucher) => void;
  language: 'sw' | 'en';
}

export const PaymentGatewaySettings: React.FC<PaymentGatewaySettingsProps> = ({
  transactions,
  plans,
  onAddTransaction,
  language,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<'mpesa' | 'tigopesa' | 'airtel' | 'halopesa'>('mpesa');
  const [testPhone, setTestPhone] = useState('+255 754 882 119');
  const [testPlanId, setTestPlanId] = useState(plans[0]?.id || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Gateway credentials state
  const [gateways, setGateways] = useState({
    mpesa: {
      enabled: true,
      apiKey: 'voda_sec_tz_8941049281',
      shortCode: '554433',
      tillNumber: '884920',
      consumerSecret: '••••••••••••••••••••',
    },
    tigopesa: {
      enabled: true,
      apiKey: 'tigo_mixx_tz_294819',
      merchantId: 'TIGO_PAY_9912',
      pin: '••••',
    },
    airtel: {
      enabled: true,
      clientId: 'airtel_tz_client_441',
      merchantCode: 'AIRTEL_HOTSPOT',
    },
    halopesa: {
      enabled: true,
      merchantId: 'HALO_PAY_881',
    },
  });

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const plan = plans.find((p) => p.id === testPlanId) || plans[0];
    if (!plan) return;

    setIsProcessing(true);
    setSuccessNotice(null);

    setTimeout(() => {
      setIsProcessing(false);
      const voucherCode = `TZ-941-${Math.floor(Math.random() * 8999 + 1000)}`;
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newTx: MobileMoneyTransaction = {
        id: `tx-${Date.now()}`,
        receiptNumber: `TZ-${selectedProvider.toUpperCase()}-${Math.floor(Math.random() * 89999 + 10000)}`,
        provider: selectedProvider,
        phoneNumber: testPhone,
        customerName: 'Mteja Hotspot TZ',
        amountTzs: plan.priceTzs,
        planId: plan.id,
        planName: plan.nameSwahili || plan.name,
        voucherCode: voucherCode,
        status: 'completed',
        timestamp: dateStr,
        referenceId: `REF_${Math.floor(Math.random() * 900000 + 100000)}`,
      };

      const newVoucher: Voucher = {
        id: `vch-${Date.now()}`,
        code: voucherCode,
        planId: plan.id,
        planName: plan.nameSwahili || plan.name,
        priceTzs: plan.priceTzs,
        durationDisplay: plan.durationDisplay,
        dataLimitDisplay: plan.dataLimitMb ? `${plan.dataLimitMb} MB` : 'Unlimited',
        speedLimit: plan.rateLimit,
        status: 'active',
        createdAt: dateStr,
        activatedAt: dateStr,
        agentName: `Online Self-Service (${selectedProvider.toUpperCase()})`,
        usedByIp: '192.168.88.102',
      };

      onAddTransaction(newTx, newVoucher);
      setSuccessNotice(
        `✅ Malipo yamekamilika! Vocha ${voucherCode} imetolewa na mteja ameunganishwa moja kwa moja kwenye Router!`
      );
      confetti({ particleCount: 90, spread: 60 });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white">
              {language === 'sw' ? 'Milango ya Malipo ya Tanzania (Mobile Money APIs)' : 'Tanzania Mobile Money Gateways'}
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            {language === 'sw'
              ? 'Sanidi Vodacom M-Pesa, Tigo Pesa / Mixx, Airtel Money, na HaloPesa kwa ajili ya wateja kununua bando moja kwa moja.'
              : 'Automate instant voucher issuance via STK Push callbacks and webhook notifications.'}
          </p>
        </div>
      </div>

      {/* Gateway Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vodacom M-Pesa */}
        <div className="bg-slate-900 border border-red-900/40 p-5 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="h-1.5 w-full bg-red-500 absolute top-0 left-0" />
          <div className="flex justify-between items-start mb-3">
            <span className="font-bold text-white text-sm">Vodacom M-Pesa</span>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
              ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">Daraja API / Lipa Namba / USSD Push</p>
          <div className="space-y-1 text-xs text-slate-300 font-mono">
            <div>ShortCode: <b className="text-white">{gateways.mpesa.shortCode}</b></div>
            <div>Till: <b className="text-white">{gateways.mpesa.tillNumber}</b></div>
          </div>
        </div>

        {/* Tigo Pesa */}
        <div className="bg-slate-900 border border-blue-900/40 p-5 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="h-1.5 w-full bg-blue-500 absolute top-0 left-0" />
          <div className="flex justify-between items-start mb-3">
            <span className="font-bold text-white text-sm">Tigo Pesa / Mixx</span>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
              ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">Lipa Kwa Simu / USSD Push</p>
          <div className="space-y-1 text-xs text-slate-300 font-mono">
            <div>Merchant ID: <b className="text-white">{gateways.tigopesa.merchantId}</b></div>
            <div>Webhook: <b className="text-sky-400">/api/v1/tigo/cb</b></div>
          </div>
        </div>

        {/* Airtel Money */}
        <div className="bg-slate-900 border border-amber-900/40 p-5 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="h-1.5 w-full bg-amber-500 absolute top-0 left-0" />
          <div className="flex justify-between items-start mb-3">
            <span className="font-bold text-white text-sm">Airtel Money</span>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
              ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">Airtel Money Merchant API</p>
          <div className="space-y-1 text-xs text-slate-300 font-mono">
            <div>Merchant: <b className="text-white">{gateways.airtel.merchantCode}</b></div>
            <div>Status: <b className="text-emerald-400">Connected</b></div>
          </div>
        </div>

        {/* HaloPesa */}
        <div className="bg-slate-900 border border-orange-900/40 p-5 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="h-1.5 w-full bg-orange-500 absolute top-0 left-0" />
          <div className="flex justify-between items-start mb-3">
            <span className="font-bold text-white text-sm">HaloPesa</span>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
              ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">Halotel Merchant Webhook</p>
          <div className="space-y-1 text-xs text-slate-300 font-mono">
            <div>Merchant: <b className="text-white">{gateways.halopesa.merchantId}</b></div>
            <div>Status: <b className="text-emerald-400">Connected</b></div>
          </div>
        </div>
      </div>

      {/* Interactive Live STK Push Tester & Webhook Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">
              {language === 'sw' ? 'Jaribu Kutuma Malipo ya STK Push (Live Gateway Tester)' : 'Live STK Push & Webhook Simulator'}
            </h3>
          </div>
          <span className="text-xs text-slate-400">Jaribu jinsi wateja wanavyolipia na kupokea vocha moja kwa moja</span>
        </div>

        {successNotice && (
          <div className="bg-emerald-950/70 border border-emerald-500/40 p-3 rounded-xl text-xs text-emerald-300 font-mono">
            {successNotice}
          </div>
        )}

        <form onSubmit={handleSimulatePayment} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Chagua Mtandao:</label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-medium outline-none focus:border-sky-500"
            >
              <option value="mpesa">Vodacom M-Pesa</option>
              <option value="tigopesa">Tigo Pesa / Mixx</option>
              <option value="airtel">Airtel Money</option>
              <option value="halopesa">HaloPesa</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Namba ya Simu:</label>
            <input
              type="text"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Chagua Bando:</label>
            <select
              value={testPlanId}
              onChange={(e) => setTestPlanId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-medium outline-none focus:border-sky-500"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameSwahili} - TSh {p.priceTzs.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition shadow disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Inalipa...' : 'Tuma STK Push'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Transaction History */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Historia ya Miamala ya Simu (Mobile Money Logs)</h3>
          <span className="text-xs text-slate-400 font-mono">{transactions.length} Miamala</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Risiti / Receipt</th>
                <th className="p-4">Mtandao</th>
                <th className="p-4">Simu ya Mteja</th>
                <th className="p-4">Bando & Vocha</th>
                <th className="p-4">Kiasi (TZS)</th>
                <th className="p-4">Hali</th>
                <th className="p-4">Muda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-4 font-mono font-bold text-white">{tx.receiptNumber}</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tx.provider === 'mpesa' ? 'bg-red-950 text-red-400 border border-red-800' :
                      tx.provider === 'tigopesa' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                      tx.provider === 'airtel' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-orange-950 text-orange-400 border border-orange-800'
                    }`}>
                      {tx.provider.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-200">{tx.phoneNumber}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-200">{tx.planName}</div>
                    <div className="text-[10px] font-mono text-sky-400">Vocha: {tx.voucherCode}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-emerald-400">
                    TSh {tx.amountTzs.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                      <CheckCircle className="w-3 h-3" />
                      <span>Imekamilika</span>
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">{tx.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
