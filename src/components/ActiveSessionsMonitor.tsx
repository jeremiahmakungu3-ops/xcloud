import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Wifi, 
  Clock, 
  ArrowDown, 
  ArrowUp, 
  UserX, 
  PlusCircle, 
  ShieldAlert, 
  Smartphone, 
  Laptop, 
  RefreshCw,
  Signal,
  SlidersHorizontal
} from 'lucide-react';
import { ActiveSession, RouterDevice } from '../types';

interface ActiveSessionsMonitorProps {
  sessions: ActiveSession[];
  router: RouterDevice;
  onKickUser: (sessionId: string) => void;
  onExtendTime: (sessionId: string) => void;
  language: 'sw' | 'en';
}

export const ActiveSessionsMonitor: React.FC<ActiveSessionsMonitorProps> = ({
  sessions,
  router,
  onKickUser,
  onExtendTime,
  language,
}) => {
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredSessions = sessions.filter(
    (s) =>
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.ipAddress.includes(search) ||
      s.macAddress.toLowerCase().includes(search.toLowerCase()) ||
      s.deviceName.toLowerCase().includes(search.toLowerCase())
  );

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${bytes} B`;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white">
              {language === 'sw' ? 'Watumiaji Waliounganishwa Sasa (Live Hotspot Sessions)' : 'Active MikroTik Hotspot Sessions'}
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Router: <span className="text-sky-300 font-mono">{router.name}</span> • Wateja {sessions.length} hewani
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Inaboresha...' : 'Sasisha / Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'sw' ? 'Tafuta mteja kwa IP, MAC, namba ya vocha au simu...' : 'Search by IP, MAC, voucher or phone...'}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">{language === 'sw' ? 'Kifaa & Mtumiaji' : 'Client & Device'}</th>
                <th className="p-4">IP / MAC Address</th>
                <th className="p-4">{language === 'sw' ? 'Bando & Kasi' : 'Plan & Rate Limit'}</th>
                <th className="p-4">{language === 'sw' ? 'Muda Uliotumika / Uliobaki' : 'Uptime / Time Left'}</th>
                <th className="p-4">{language === 'sw' ? 'Matumizi ya Data' : 'Bytes In / Out'}</th>
                <th className="p-4">{language === 'sw' ? 'Mwangwi (Signal)' : 'Signal'}</th>
                <th className="p-4 text-right">{language === 'sw' ? 'Udhibiti' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Hakuna mteja hewani kwa sasa.
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-800/50 transition">
                    {/* Device & User */}
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-slate-800 rounded-lg text-sky-400">
                          {session.deviceName.toLowerCase().includes('laptop') || session.deviceName.toLowerCase().includes('ubuntu') ? (
                            <Laptop className="w-4 h-4" />
                          ) : (
                            <Smartphone className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{session.deviceName}</div>
                          <div className="font-mono text-[11px] text-sky-400">
                            Vocha: <b>{session.username}</b>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* IP & MAC */}
                    <td className="p-4 font-mono text-[11px]">
                      <div className="text-slate-200 font-semibold">{session.ipAddress}</div>
                      <div className="text-slate-500 text-[10px]">{session.macAddress}</div>
                    </td>

                    {/* Plan */}
                    <td className="p-4">
                      <div className="font-semibold text-slate-200">{session.planName}</div>
                      <div className="font-mono text-emerald-400 font-bold text-[10px]">{session.rateLimit}</div>
                    </td>

                    {/* Uptime & Time Left */}
                    <td className="p-4 font-mono text-[11px]">
                      <div className="text-slate-300">Uptime: {session.uptime}</div>
                      <div className="text-emerald-400 font-bold">Baki: {session.timeLeft}</div>
                    </td>

                    {/* Bytes */}
                    <td className="p-4 font-mono text-[11px]">
                      <div className="text-slate-300 flex items-center gap-1">
                        <ArrowDown className="w-3 h-3 text-emerald-400" /> {formatBytes(session.bytesOut)}
                      </div>
                      <div className="text-slate-500 flex items-center gap-1 text-[10px]">
                        <ArrowUp className="w-3 h-3 text-sky-400" /> {formatBytes(session.bytesIn)}
                      </div>
                    </td>

                    {/* Signal dBm */}
                    <td className="p-4 font-mono text-[11px]">
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        session.signalStrengthDbm >= -55 ? 'text-emerald-400' :
                        session.signalStrengthDbm >= -65 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        <Signal className="w-3.5 h-3.5" />
                        {session.signalStrengthDbm} dBm
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onExtendTime(session.id)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-950 text-emerald-400 border border-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                          title="Ongeza Saa 1 ya Ziada"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>+1 Saa</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Una uhakika unataka kutoa mtumiaji huyu (${session.username}) kwenye hotspot?`)) {
                              onKickUser(session.id);
                            }
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-red-950 text-red-400 border border-slate-700 rounded-lg transition"
                          title="Piga Teke (Disconnect / Kick User)"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
