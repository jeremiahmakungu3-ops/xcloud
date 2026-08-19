import React, { useState } from 'react';
import { Ticket, X, Sparkles, Printer, Layers, Check, FileText } from 'lucide-react';
import { BillingPlan, Voucher, AgentUser } from '../types';

interface VoucherGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: BillingPlan[];
  agents: AgentUser[];
  onGenerate: (newVouchers: Voucher[], printMode?: 'thermal' | 'pdf') => void;
  language: 'sw' | 'en';
}

export const VoucherGeneratorModal: React.FC<VoucherGeneratorModalProps> = ({
  isOpen,
  onClose,
  plans,
  agents,
  onGenerate,
  language,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(20);
  const [prefix, setPrefix] = useState<string>('TZ-941-');
  const [codeType, setCodeType] = useState<'numeric' | 'alphanumeric'>('numeric');
  const [codeLength, setCodeLength] = useState<number>(4);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [actionAfter, setActionAfter] = useState<'none' | 'thermal' | 'pdf'>('thermal');

  if (!isOpen) return null;

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];
  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const batchId = `BATCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 900 + 100)}`;
    const newVouchers: Voucher[] = [];

    for (let i = 0; i < quantity; i++) {
      let randomSuffix = '';
      if (codeType === 'numeric') {
        randomSuffix = Math.floor(Math.random() * Math.pow(10, codeLength)).toString().padStart(codeLength, '0');
      } else {
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        for (let c = 0; c < codeLength; c++) {
          randomSuffix += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }

      const voucherCode = `${prefix}${randomSuffix}`;
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      newVouchers.push({
        id: `vch-${Date.now()}-${i}`,
        code: voucherCode,
        planId: selectedPlan.id,
        planName: selectedPlan.nameSwahili || selectedPlan.name,
        priceTzs: selectedPlan.priceTzs,
        durationDisplay: selectedPlan.durationDisplay,
        dataLimitDisplay: selectedPlan.dataLimitMb ? `${selectedPlan.dataLimitMb >= 1000 ? `${selectedPlan.dataLimitMb / 1000} GB` : `${selectedPlan.dataLimitMb} MB`}` : 'Unlimited',
        speedLimit: selectedPlan.rateLimit,
        status: 'unused',
        createdAt: dateStr,
        agentId: selectedAgent?.id,
        agentName: selectedAgent?.name,
        batchId: batchId,
      });
    }

    onGenerate(newVouchers, actionAfter !== 'none' ? actionAfter : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {language === 'sw' ? 'Tengeneza Vocha kwa Mkupuo (Batch Voucher Gen)' : 'Generate Batch Hotspot Vouchers'}
              </h3>
              <p className="text-xs text-slate-400">
                MikroTik RB941 Hotspot & Thermal POS Printing
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Plan Picker */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              {language === 'sw' ? 'Chagua Bando la Vocha:' : 'Select Hotspot Plan:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {plans.filter(p => p.isActive).map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`p-2.5 rounded-xl text-left border transition ${
                    selectedPlanId === p.id
                      ? 'bg-sky-950/60 border-sky-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold block truncate text-slate-200">{p.nameSwahili || p.name}</span>
                  <span className="font-mono text-emerald-400 font-bold block text-xs">TSh {p.priceTzs.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block">{p.durationDisplay} • {p.rateLimit}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Format */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {language === 'sw' ? 'Idadi ya Vocha (Quantity):' : 'Batch Quantity:'}
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(+e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono font-bold outline-none focus:border-sky-500"
              >
                <option value="5">Vocha 5 (Kujaribu)</option>
                <option value="10">Vocha 10</option>
                <option value="20">Vocha 20 (Standard Sheet)</option>
                <option value="50">Vocha 50</option>
                <option value="100">Vocha 100 (Thermal Roll)</option>
                <option value="500">Vocha 500 (Mkupuo Mkubwa)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {language === 'sw' ? 'Mtindo wa Namba (Format):' : 'Code Format:'}
              </label>
              <select
                value={codeType}
                onChange={(e) => setCodeType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-sky-500"
              >
                <option value="numeric">Nambari Pekee (mfano: 4920)</option>
                <option value="alphanumeric">Herufi & Namba (mfano: 7K9P)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {language === 'sw' ? 'Herufi za Mwanzo (Prefix):' : 'Code Prefix:'}
              </label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="mfano: TZ-941- au KKO-"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {language === 'sw' ? 'Wakala / Muuzaji (POS Agent):' : 'Assign to Agent:'}
              </label>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-sky-500"
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action After Generating */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <label className="block text-slate-300 font-semibold mb-2">
              {language === 'sw' ? 'Hatua Baada ya Kutengeneza:' : 'Action After Generation:'}
            </label>
            <div className="flex flex-wrap gap-2">
              <label className={`flex-1 p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition ${actionAfter === 'thermal' ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                <input
                  type="radio"
                  name="actionAfter"
                  checked={actionAfter === 'thermal'}
                  onChange={() => setActionAfter('thermal')}
                  className="hidden"
                />
                <Printer className="w-4 h-4" />
                <span className="font-semibold">Thermal POS (58mm)</span>
              </label>

              <label className={`flex-1 p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition ${actionAfter === 'pdf' ? 'bg-sky-950/40 border-sky-500 text-sky-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                <input
                  type="radio"
                  name="actionAfter"
                  checked={actionAfter === 'pdf'}
                  onChange={() => setActionAfter('pdf')}
                  className="hidden"
                />
                <FileText className="w-4 h-4" />
                <span className="font-semibold">Karatasi ya PDF (A4)</span>
              </label>

              <label className={`p-2 rounded-lg border flex items-center gap-2 cursor-pointer transition ${actionAfter === 'none' ? 'bg-purple-950/40 border-purple-500 text-purple-300' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                <input
                  type="radio"
                  name="actionAfter"
                  checked={actionAfter === 'none'}
                  onChange={() => setActionAfter('none')}
                  className="hidden"
                />
                <span className="font-semibold">Hifadhi Tu</span>
              </label>
            </div>
          </div>

          {/* Summary Box */}
          <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Thamani ya Vocha:</span>
            <span className="font-mono font-black text-emerald-400 text-sm">
              TSh {((selectedPlan?.priceTzs || 0) * quantity).toLocaleString()}
            </span>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
            >
              Ghairi / Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/25 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'sw' ? 'Tengeneza na Sawazisha RB941' : 'Generate & Sync Router'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
