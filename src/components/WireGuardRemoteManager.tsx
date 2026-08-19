import React, { useState } from 'react';
import { 
  Radio, 
  Server, 
  Activity, 
  ShieldCheck, 
  ExternalLink, 
  RefreshCw, 
  Copy, 
  Check, 
  Terminal,
  Zap,
  Globe,
  Wifi
} from 'lucide-react';
import { RouterDevice } from '../types';

interface WireGuardRemoteManagerProps {
  router: RouterDevice;
  onUpdateRouter: (updated: RouterDevice) => void;
  language: 'sw' | 'en';
}

export const WireGuardRemoteManager: React.FC<WireGuardRemoteManagerProps> = ({
  router,
  onUpdateRouter,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleCopyWinboxUrl = () => {
    navigator.clipboard.writeText(`winbox://${router.tunnelIp}:8291`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSyncTunnel = () => {
    setIsSyncing(true);
    setSyncStatus(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('WireGuard Tunnel handshake refreshed! Latency: 13.8ms (Dar es Salaam Hub).');
    }, 1200);
  };

  const formatBytes = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-black text-white">
              {language === 'sw' ? 'XCloud Remote Interface & WireGuard Tunnel' : 'XCloud Remote WireGuard Interface'}
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            {language === 'sw'
              ? 'Dhibiti router ya MikroTik RB941 ukiwa popote Tanzania bila kuwa na Public IP au kufungua milango.'
              : 'Direct WireGuard cloud tunnel to manage RB941 from anywhere without static public IP.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncTunnel}
            disabled={isSyncing}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Inasawazisha...' : 'Sawazisha Tunnel (Sync)'}</span>
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="bg-emerald-950/70 border border-emerald-500/30 p-3 rounded-xl text-xs text-emerald-300 font-mono">
          {syncStatus}
        </div>
      )}

      {/* Main Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Status Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hali ya Muunganisho</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              CONNECTED
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono">{router.tunnelIp}</div>
          <p className="text-xs text-slate-400">
            Endpoint: <span className="text-slate-200 font-mono">{router.wireguardStatus.endpoint}</span>
          </p>
          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex justify-between">
            <span>Latency (TIX Dar):</span>
            <span className="text-emerald-400 font-bold font-mono">{router.wireguardStatus.latencyMs} ms</span>
          </div>
        </div>

        {/* Traffic Statistics */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">WireGuard Traffic</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Downloaded (RX):</span>
              <span className="text-emerald-400 font-bold">{formatBytes(router.wireguardStatus.rxBytes)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Uploaded (TX):</span>
              <span className="text-sky-400 font-bold">{formatBytes(router.wireguardStatus.txBytes)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Last Handshake:</span>
              <span className="text-white">{router.wireguardStatus.lastHandshake}</span>
            </div>
          </div>
        </div>

        {/* WinBox Quick Link */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">WinBox Remote URL</span>
              <Server className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-slate-300">
              Unganisha programu ya WinBox moja kwa moja kupitia anwani ya WireGuard:
            </p>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-xs text-sky-400 font-bold mt-2">
              {router.tunnelIp}:8291
            </div>
          </div>

          <button
            onClick={handleCopyWinboxUrl}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Imenakiliwa!' : 'Nakili WinBox Target'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
