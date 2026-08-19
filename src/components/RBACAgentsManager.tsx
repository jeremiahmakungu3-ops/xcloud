import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  DollarSign, 
  Ticket, 
  Percent, 
  MapPin, 
  Phone, 
  Mail, 
  UserCheck, 
  UserX,
  X
} from 'lucide-react';
import { AgentUser, UserRole } from '../types';

interface RBACAgentsManagerProps {
  agents: AgentUser[];
  onSaveAgent: (agent: AgentUser) => void;
  language: 'sw' | 'en';
}

export const RBACAgentsManager: React.FC<RBACAgentsManagerProps> = ({
  agents,
  onSaveAgent,
  language,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newAgent, setNewAgent] = useState<Partial<AgentUser>>({
    name: '',
    phoneNumber: '+255 ',
    email: '',
    role: 'sales_agent',
    location: '',
    commissionRate: 10,
    status: 'active',
  });

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgent.name || !newAgent.phoneNumber) return;

    const agent: AgentUser = {
      id: `agent-${Date.now()}`,
      name: newAgent.name,
      phoneNumber: newAgent.phoneNumber,
      email: newAgent.email || `${newAgent.name?.toLowerCase().replace(/\s+/g, '')}@xcloud.co.tz`,
      role: newAgent.role || 'sales_agent',
      location: newAgent.location || 'Dar es Salaam',
      commissionRate: newAgent.commissionRate || 10,
      totalSalesTzs: 0,
      vouchersGenerated: 0,
      status: 'active',
    };

    onSaveAgent(agent);
    setIsAdding(false);
    setNewAgent({
      name: '',
      phoneNumber: '+255 ',
      email: '',
      role: 'sales_agent',
      location: '',
      commissionRate: 10,
      status: 'active',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-black text-white">
              {language === 'sw' ? 'Mawakala & Udhibiti wa Majukumu (RBAC Security)' : 'Agents & Role-Based Access Control'}
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            {language === 'sw'
              ? 'Weka mawakala wa mauzo, maduka ya vocha (POS Resellers), na wasimamizi wenye mamlaka tofauti.'
              : 'Manage sales agents, POS store accounts, commissions, and multi-tier role permissions.'}
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 text-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'sw' ? 'Sajili Wakala Mpya' : 'Add New Agent'}</span>
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  agent.role === 'super_admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                  agent.role === 'hotspot_manager' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {agent.role === 'super_admin' ? 'SUPER ADMIN' : agent.role === 'hotspot_manager' ? 'MANAGER' : 'WAKALA (POS)'}
                </span>

                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Hai
                </span>
              </div>

              <h3 className="font-bold text-white text-base">{agent.name}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span className="truncate">{agent.location}</span>
              </p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 my-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Mauzo Jumla:</span>
                  <span className="font-bold text-emerald-400 font-mono">TSh {agent.totalSalesTzs.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Vocha Alizouza:</span>
                  <span className="font-bold text-white font-mono">{agent.vouchersGenerated}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Gawio (Commission):</span>
                  <span className="font-bold text-amber-400 font-mono">{agent.commissionRate}%</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span>{agent.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-500" />
                  <span className="truncate">{agent.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
              <span>ID: {agent.id}</span>
              <button className="text-sky-400 hover:underline font-bold">Hariri / Edit</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Sajili Wakala Mpya wa Vocha</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAgent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Jina Kamili:</label>
                <input
                  type="text"
                  value={newAgent.name || ''}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  placeholder="mfano: Rashidi Salum"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-sky-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Namba ya Simu (M-Pesa / Tigo):</label>
                <input
                  type="text"
                  value={newAgent.phoneNumber || ''}
                  onChange={(e) => setNewAgent({ ...newAgent, phoneNumber: e.target.value })}
                  placeholder="+255 754 XXX XXX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:border-sky-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Eneo / Duka (Location):</label>
                <input
                  type="text"
                  value={newAgent.location || ''}
                  onChange={(e) => setNewAgent({ ...newAgent, location: e.target.value })}
                  placeholder="mfano: Kariakoo Msimbazi Duka #4"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:border-sky-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Jukumu (Role):</label>
                  <select
                    value={newAgent.role || 'sales_agent'}
                    onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-sky-500"
                  >
                    <option value="sales_agent">Wakala wa Vocha (POS)</option>
                    <option value="hotspot_manager">Msimamizi wa Hotspot</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Gawio (% Commission):</label>
                  <input
                    type="number"
                    value={newAgent.commissionRate || 10}
                    onChange={(e) => setNewAgent({ ...newAgent, commissionRate: +e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow"
                >
                  Sajili Wakala
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
