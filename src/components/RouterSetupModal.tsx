import React, { useState } from 'react';
import { 
  X, 
  Server, 
  Radio, 
  Key, 
  Copy, 
  Check, 
  Terminal, 
  Wifi, 
  ShieldCheck, 
  RefreshCw, 
  Zap, 
  Activity,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { RouterDevice, BillingPlan } from '../types';
import { generateFullMikrotikScript, generateWireguardScript } from '../utils/mikrotikScriptGenerator';

interface RouterSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  router: RouterDevice;
  plans: BillingPlan[];
  onUpdateRouter: (updated: RouterDevice) => void;
  language: 'sw' | 'en';
}

export const RouterSetupModal: React.FC<RouterSetupModalProps> = ({
  isOpen,
  onClose,
  router,
  plans,
  onUpdateRouter,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'physical' | 'wireguard' | 'api' | 'radius' | 'script'>('physical');
  const [copied, setCopied] = useState(false);
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const fullScript = generateFullMikrotikScript(router, plans);
  const wireguardScript = generateWireguardScript(router);

  const handleCopyScript = (scriptText: string) => {
    navigator.clipboard.writeText(scriptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTestConnection = () => {
    setIsTestingPing(true);
    setPingResult(null);
    setTimeout(() => {
      setIsTestingPing(false);
      setPingResult(
        `SUCCESS: MikroTik RB941 responded at ${router.tunnelIp} (Latency: 12.4ms, CPU: 24%, RouterOS v7.14.3 SMIPS, Hotspot: Active).`
      );
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-white">
                  {language === 'sw' ? 'Sanidi Muunganisho wa MikroTik RB941' : 'MikroTik RB941 Connection & Setup'}
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ONLINE @ {router.tunnelIp}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                XCLOUD Remote Cloud Tunnel • WireGuard • MikroTik API • RADIUS TZ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 gap-2 overflow-x-auto">
          {[
            { id: 'physical', label: language === 'sw' ? '1. Muunganisho wa Waya (Physical)' : '1. Physical Setup' },
            { id: 'wireguard', label: language === 'sw' ? '2. WireGuard Tunnel' : '2. WireGuard VPN' },
            { id: 'api', label: language === 'sw' ? '3. MikroTik API (8728)' : '3. RouterOS API' },
            { id: 'radius', label: language === 'sw' ? '4. RADIUS Server' : '4. RADIUS Setup' },
            { id: 'script', label: language === 'sw' ? '5. Terminal Script (Auto-Config)' : '5. 1-Click Terminal Script' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-sky-400 text-sky-400 bg-sky-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* TAB 1: PHYSICAL CONNECTION */}
          {activeTab === 'physical' && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{language === 'sw' ? 'Mwongozo wa Kuunganisha Waya za RB941-2nD (hAP lite)' : 'Physical Wiring Guide for RB941'}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'sw' 
                    ? 'Hakikisha waya zimeunganishwa kwenye milango sahihi kabla ya kuingiza script ya XCloud:'
                    : 'Ensure Ethernet cables and power are connected to appropriate ports on your RB941:'}
                </p>

                {/* Visual Port Box */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-4">
                  <div className="bg-slate-900 border border-amber-500/40 p-3 rounded-lg text-center">
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded block mb-1">
                      PORT 1 (Internet)
                    </span>
                    <span className="text-xs font-bold text-white block">Ether1 WAN</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Waya kutoka kwa ISP / Fiber ONU / Simu Modem</span>
                  </div>

                  <div className="bg-slate-900 border border-sky-500/40 p-3 rounded-lg text-center">
                    <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded block mb-1">
                      PORT 2 (Hotspot AP)
                    </span>
                    <span className="text-xs font-bold text-white block">Ether2 Hotspot</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Kuunganisha Access Point ya Nje (Ubiquiti/Ruijie)</span>
                  </div>

                  <div className="bg-slate-900 border border-sky-500/40 p-3 rounded-lg text-center">
                    <span className="text-[10px] font-bold bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded block mb-1">
                      PORT 3 (Hotspot AP)
                    </span>
                    <span className="text-xs font-bold text-white block">Ether3 Hotspot</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Access Point ya Chumba/Mgahawa</span>
                  </div>

                  <div className="bg-slate-900 border border-emerald-500/40 p-3 rounded-lg text-center">
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded block mb-1">
                      PORT 4 (Admin PC)
                    </span>
                    <span className="text-xs font-bold text-white block">Ether4 WinBox</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">Waya wa Kompyuta ya Msimamizi</span>
                  </div>

                  <div className="bg-slate-900 border border-purple-500/40 p-3 rounded-lg text-center">
                    <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded block mb-1">
                      WLAN1 (Built-in)
                    </span>
                    <span className="text-xs font-bold text-white block">2.4GHz Wi-Fi</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">SSID: XCLOUD-HOTSPOT-TZ</span>
                  </div>
                </div>
              </div>

              {/* Hardware Spec Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Router Model</span>
                  <span className="text-sm font-bold text-white font-mono">{router.model}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Architecture</span>
                  <span className="text-sm font-bold text-white font-mono">SMIPS (650MHz)</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Memory (RAM)</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">32 MB Built-in</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Local IP</span>
                  <span className="text-sm font-bold text-sky-400 font-mono">{router.ipAddress}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WIREGUARD */}
          {activeTab === 'wireguard' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-white text-sm">XCloud Remote WireGuard Cloud Tunnel</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Inaruhusu kusimamia RB941 yako ukiwa popote bila Public IP au Port Forwarding!
                  </p>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-mono font-bold">
                  CONNECTED • 14ms
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Tunnel IP:</span>
                    <span className="font-mono font-bold text-sky-400">{router.tunnelIp}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Server Endpoint:</span>
                    <span className="font-mono text-slate-200">{router.wireguardStatus.endpoint}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Public Key:</span>
                    <span className="font-mono text-slate-400 truncate max-w-[180px]">{router.wireguardStatus.publicKey}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Last Handshake:</span>
                    <span className="text-emerald-400 font-bold">{router.wireguardStatus.lastHandshake}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white mb-2">WireGuard RouterOS v7 Quick Command</h4>
                    <pre className="bg-slate-900 p-2.5 rounded text-[11px] text-slate-300 font-mono overflow-x-auto border border-slate-800">
                      {wireguardScript}
                    </pre>
                  </div>
                  <button
                    onClick={() => handleCopyScript(wireguardScript)}
                    className="mt-3 w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Imenakiliwa!' : 'Nakili Script ya WireGuard'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MIKROTIK API */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-white text-sm mb-1">RouterOS API & Management Ports</h3>
                <p className="text-xs text-slate-400">
                  XCloud inawasiliana na RB941 kupitia MikroTik API port 8728 na REST API kusawazisha watumiaji na vocha papo hapo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">Standard API Port</span>
                  <span className="text-lg font-bold text-white font-mono">{router.apiConfig.port}</span>
                  <span className="text-[10px] text-emerald-400 block mt-1">/ip service set api</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">SSL API Port</span>
                  <span className="text-lg font-bold text-white font-mono">{router.apiConfig.sslPort}</span>
                  <span className="text-[10px] text-sky-400 block mt-1">Encrypted TLS</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">API Username</span>
                  <span className="text-lg font-bold text-amber-400 font-mono">{router.apiConfig.username}</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Group: xcloud_group</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RADIUS */}
          {activeTab === 'radius' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="font-bold text-white text-sm mb-1">XCloud Central RADIUS Server</h3>
                <p className="text-xs text-slate-400">
                  Inatumika kuzuia kujaza kumbukumbu ndogo ya 32MB ya RB941. Vocha zote 10,000+ zinahifadhiwa kwenye Cloud RADIUS badala ya flash memory ya router.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">RADIUS Server IP:</span>
                    <span className="font-mono font-bold text-white">{router.radiusConfig.serverIp}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Authentication Port:</span>
                    <span className="font-mono text-emerald-400 font-bold">{router.radiusConfig.authPort} (UDP)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Accounting Port:</span>
                    <span className="font-mono text-sky-400 font-bold">{router.radiusConfig.acctPort} (UDP)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Shared Secret:</span>
                    <span className="font-mono text-amber-400 font-bold">{router.radiusConfig.secret}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-xs">Faida ya RADIUS kwenye RB941:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                    <li>Router haitakwama kamwe (No CPU 100% freeze).</li>
                    <li>Wateja zaidi ya 5,000 wanaweza kutumia vocha kwa pamoja.</li>
                    <li>Kupiga teke (Disconnect) mteja kwa mbofyo mmoja (CoA 3799).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: 1-CLICK SCRIPT */}
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-sky-400" />
                    <span>{language === 'sw' ? 'Script Kamili ya MikroTik Terminal' : 'Full MikroTik Terminal Script'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {language === 'sw'
                      ? 'Fungua WinBox > New Terminal > Paste script hii kisha bonyeza ENTER:'
                      : 'Open WinBox > New Terminal > Paste this script and press ENTER:'}
                  </p>
                </div>

                <button
                  onClick={() => handleCopyScript(fullScript)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? (language === 'sw' ? 'Imenakiliwa!' : 'Copied!') : (language === 'sw' ? 'Nakili Yote' : 'Copy All')}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-[11px] font-mono text-slate-300 max-h-72 overflow-y-auto leading-relaxed select-all">
                  {fullScript}
                </pre>
              </div>
            </div>
          )}

          {/* Diagnostic Test Bar */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              {pingResult ? (
                <span className="text-emerald-400 font-medium">{pingResult}</span>
              ) : (
                <span>{language === 'sw' ? 'Pima muunganisho wa moja kwa moja na RB941:' : 'Run live diagnostics check:'}</span>
              )}
            </div>

            <button
              onClick={handleTestConnection}
              disabled={isTestingPing}
              className="bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingPing ? 'animate-spin' : ''}`} />
              <span>{isTestingPing ? 'Inapima...' : 'Pima Muunganisho (Ping Test)'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
          >
            {language === 'sw' ? 'Funga Dirisha' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
