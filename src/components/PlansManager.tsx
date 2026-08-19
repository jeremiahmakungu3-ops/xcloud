import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  Clock, 
  Wifi, 
  HardDrive, 
  Users, 
  Zap, 
  CheckCircle2, 
  X,
  Sparkles
} from 'lucide-react';
import { BillingPlan } from '../types';

interface PlansManagerProps {
  plans: BillingPlan[];
  onSavePlan: (plan: BillingPlan) => void;
  onDeletePlan: (planId: string) => void;
  language: 'sw' | 'en';
}

export const PlansManager: React.FC<PlansManagerProps> = ({
  plans,
  onSavePlan,
  onDeletePlan,
  language,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<BillingPlan>>({
    name: '',
    nameSwahili: '',
    priceTzs: 1000,
    durationDisplay: '3 Hours',
    validityMinutes: 180,
    dataLimitMb: 1500,
    rateLimit: '3M/3M',
    sharedUsers: 1,
    description: '',
    badge: 'Popular',
    color: 'sky',
    isActive: true,
  });

  const handleOpenNew = () => {
    setEditingPlan({
      id: `plan-${Date.now()}`,
      name: 'New Custom Plan',
      nameSwahili: 'Bando Jipya',
      priceTzs: 1000,
      durationDisplay: '2 Hours',
      validityMinutes: 120,
      uptimeLimitMinutes: 120,
      dataLimitMb: 1000,
      rateLimit: '3M/3M',
      sharedUsers: 1,
      description: 'Hotspot high speed access',
      badge: 'Special',
      color: 'emerald',
      isActive: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (plan: BillingPlan) => {
    setEditingPlan({ ...plan });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan.name || !editingPlan.priceTzs) return;
    onSavePlan(editingPlan as BillingPlan);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-black text-white">
              {language === 'sw' ? 'Mipango ya Mabando (Billing Plans TZ)' : 'Hotspot Billing Plans & Bandwidth'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            {language === 'sw'
              ? 'Tengeneza na rekebisha vifurushi vya intaneti kwa bei ya Kitanzania (TSh), viwango vya kasi (Rate Limit) na muda wa matumizi.'
              : 'Create, modify and push rate-limits directly to MikroTik /ip hotspot user profile.'}
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 text-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'sw' ? 'Ongeza Bando Jipya' : 'Add New Plan'}</span>
        </button>
      </div>

      {/* Grid of Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-slate-900 border ${plan.isActive ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/40 opacity-60'} rounded-2xl p-5 relative overflow-hidden transition shadow-lg flex flex-col justify-between`}
          >
            {/* Top Accent line */}
            <div className={`h-1.5 w-full absolute top-0 left-0 ${
              plan.color === 'emerald' ? 'bg-emerald-500' :
              plan.color === 'sky' ? 'bg-sky-500' :
              plan.color === 'amber' ? 'bg-amber-500' :
              plan.color === 'indigo' ? 'bg-indigo-500' : 'bg-purple-500'
            }`} />

            <div>
              {/* Badge & Status */}
              <div className="flex justify-between items-center mb-3">
                {plan.badge && (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700">
                    {plan.badge}
                  </span>
                )}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  plan.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                }`}>
                  {plan.isActive ? 'INATUMIKA' : 'IMESITISHWA'}
                </span>
              </div>

              {/* Title & Price */}
              <h3 className="text-lg font-black text-white">{plan.nameSwahili || plan.name}</h3>
              <p className="text-xs text-slate-400 mb-3">{plan.name}</p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 mb-4 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    TSh {plan.priceTzs.toLocaleString()}
                  </span>
                </div>
                <span className="text-xs text-slate-300 font-medium bg-slate-800 px-2 py-1 rounded">
                  {plan.durationDisplay}
                </span>
              </div>

              {/* Specs */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-sky-400" /> Kasi (Rate Limit):
                  </span>
                  <span className="font-mono font-bold text-white">{plan.rateLimit} (RX/TX)</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-amber-400" /> Kikomo cha Data:
                  </span>
                  <span className="font-bold text-slate-200">
                    {plan.dataLimitMb ? `${plan.dataLimitMb >= 1000 ? `${plan.dataLimitMb / 1000} GB` : `${plan.dataLimitMb} MB`}` : 'Unlimited (Bila Kikomo)'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-purple-400" /> Vifaa kwa Vocha:
                  </span>
                  <span className="font-bold text-slate-200">{plan.sharedUsers} Kifaa / Device</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">ID: {plan.id}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEdit(plan)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg transition"
                  title="Hariri Bando"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeletePlan(plan.id)}
                  className="p-2 bg-slate-800 hover:bg-red-950 text-red-400 rounded-lg transition"
                  title="Futa Bando"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingPlan.id ? 'Hariri Bando la Hotspot' : 'Unda Bando Jipya'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Jina kwa Kiswahili:</label>
                  <input
                    type="text"
                    value={editingPlan.nameSwahili || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, nameSwahili: e.target.value })}
                    placeholder="mfano: Masaa 3 Bando Safi"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:border-sky-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">English Name:</label>
                  <input
                    type="text"
                    value={editingPlan.name || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    placeholder="e.g., 3 Hours Standard"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:border-sky-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Bei (TSh Tanzanian Shillings):</label>
                  <input
                    type="number"
                    value={editingPlan.priceTzs || 0}
                    onChange={(e) => setEditingPlan({ ...editingPlan, priceTzs: +e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-emerald-400 font-mono font-bold text-xs focus:border-sky-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Muda wa Matumizi (Display):</label>
                  <input
                    type="text"
                    value={editingPlan.durationDisplay || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, durationDisplay: e.target.value })}
                    placeholder="mfano: 3 Hours, 24 Hours, 7 Days"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-xs focus:border-sky-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Kasi ya MikroTik (Rate Limit):</label>
                  <input
                    type="text"
                    value={editingPlan.rateLimit || '3M/3M'}
                    onChange={(e) => setEditingPlan({ ...editingPlan, rateLimit: e.target.value })}
                    placeholder="2M/2M au 5M/5M"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sky-400 font-mono text-xs focus:border-sky-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Muda wa Dakika (Validity Mins):</label>
                  <input
                    type="number"
                    value={editingPlan.validityMinutes || 60}
                    onChange={(e) => setEditingPlan({ ...editingPlan, validityMinutes: +e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-sky-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Kikomo cha MB (0 = Unlimited):</label>
                  <input
                    type="number"
                    value={editingPlan.dataLimitMb || 0}
                    onChange={(e) => setEditingPlan({ ...editingPlan, dataLimitMb: +e.target.value })}
                    placeholder="1024 kwa 1GB"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-sky-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Vifaa kwa Vocha (Shared Users):</label>
                  <input
                    type="number"
                    value={editingPlan.sharedUsers || 1}
                    onChange={(e) => setEditingPlan({ ...editingPlan, sharedUsers: +e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono text-xs focus:border-sky-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActivePlan"
                  checked={editingPlan.isActive || false}
                  onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                  className="rounded border-slate-700 text-sky-500 focus:ring-0"
                />
                <label htmlFor="isActivePlan" className="text-slate-300">Washa bando hili ili lionekane kwenye Captive Portal</label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Ghairi / Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold shadow"
                >
                  Hifadhi Bando / Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
