import React, { useState } from 'react';
import { 
  Palette, 
  Smartphone, 
  Monitor, 
  Download, 
  Sparkles, 
  Eye, 
  Check, 
  CreditCard, 
  Ticket, 
  Wifi, 
  HelpCircle, 
  Settings,
  PhoneCall,
  MapPin,
  RefreshCw,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CaptivePortalConfig, BillingPlan } from '../types';
import { generateMikrotikLoginHtml, generateMikrotikStatusHtml, downloadTextFile } from '../utils/exportPortal';

interface CaptivePortalStudioProps {
  portalConfig: CaptivePortalConfig;
  onUpdateConfig: (config: CaptivePortalConfig) => void;
  plans: BillingPlan[];
  language: 'sw' | 'en';
}

export const CaptivePortalStudio: React.FC<CaptivePortalStudioProps> = ({
  portalConfig,
  onUpdateConfig,
  plans,
  language,
}) => {
  const [config, setConfig] = useState<CaptivePortalConfig>({ ...portalConfig });
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [activeTab, setActiveTab] = useState<'voucher' | 'mpesa'>('voucher');
  
  // Interactive simulator states
  const [simulatedVoucherInput, setSimulatedVoucherInput] = useState('');
  const [simulatedPhoneInput, setSimulatedPhoneInput] = useState('');
  const [simulatedSelectedPlanId, setSimulatedSelectedPlanId] = useState(plans[0]?.id || '');
  const [isSimulatingStk, setIsSimulatingStk] = useState(false);
  const [stkSuccessMessage, setStkSuccessMessage] = useState<string | null>(null);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  const handleSave = () => {
    onUpdateConfig(config);
  };

  const handleExportLoginHtml = () => {
    const html = generateMikrotikLoginHtml(config, plans);
    downloadTextFile('login.html', html);
  };

  const handleExportStatusHtml = () => {
    const html = generateMikrotikStatusHtml(config);
    downloadTextFile('status.html', html);
  };

  const handleSimulateVoucherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedVoucherInput.trim()) return;
    setIsLoginSuccess(true);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  const handleSimulateMpesaStk = () => {
    if (!simulatedPhoneInput.trim()) return;
    setIsSimulatingStk(true);
    setStkSuccessMessage(null);

    setTimeout(() => {
      setIsSimulatingStk(false);
      setStkSuccessMessage(
        `STK PUSH IMEPOKELEWA! Pesa imekatwa, Vocha mpya imetolewa: TZ-941-${Math.floor(Math.random() * 8999 + 1000)} na umeunganishwa moja kwa moja!`
      );
      setIsLoginSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }, 2000);
  };

  const themes = [
    { id: 'modern_blue', name: 'Modern Blue (Standard)', color: '#0284c7' },
    { id: 'tanzania_safari', name: 'Safari TZ Emerald', color: '#059669' },
    { id: 'dar_sunset', name: 'Dar es Salaam Sunset', color: '#ea580c' },
    { id: 'cyber_dark', name: 'Cyberpunk Dark Neon', color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-black text-white">
              {language === 'sw' ? 'Studio ya Captive Portal (Hotspot Login TZ)' : 'Captive Portal Studio & Live Builder'}
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            {language === 'sw'
              ? 'Tengeneza na urekebishe ukurasa wa kuingia wa Hotspot (login.html) wenye lugha ya Kiswahili, malipo ya M-Pesa/Tigo na muundo wa kuvutia.'
              : 'Customize hotspot login portal with live Swahili/English copy, themes, and 1-click MikroTik export.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportLoginHtml}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition"
          >
            <Download className="w-4 h-4" />
            <span>Pakua login.html</span>
          </button>

          <button
            onClick={handleExportStatusHtml}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3.5 py-2 rounded-xl text-xs border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Pakua status.html</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Editor on Left, Live Simulator on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Controls & Settings (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-sky-400" />
              <span>{language === 'sw' ? 'Mipangilio ya Ukurasa' : 'Portal Customizer'}</span>
            </h3>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              {language === 'sw' ? 'Mtindo wa Rangi (Theme):' : 'Color Palette Theme:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setConfig({ ...config, theme: t.id as any, accentColor: t.color });
                    onUpdateConfig({ ...config, theme: t.id as any, accentColor: t.color });
                  }}
                  className={`p-2.5 rounded-xl text-left border flex items-center gap-2 transition text-xs font-semibold ${
                    config.theme === t.id
                      ? 'bg-slate-800 border-sky-400 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="truncate">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Name & Location */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Jina la Mtandao (Brand Name):
              </label>
              <input
                type="text"
                value={config.brandName}
                onChange={(e) => setConfig({ ...config, brandName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mahali (Location / Zone):
              </label>
              <input
                type="text"
                value={config.locationName}
                onChange={(e) => setConfig({ ...config, locationName: e.target.value })}
                placeholder="mfano: Kariakoo Hub / Mlimani City"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 outline-none"
              />
            </div>
          </div>

          {/* Kiswahili Tagline & Welcome */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Ujumbe Mkuu kwa Kiswahili (Swahili Tagline):
              </label>
              <input
                type="text"
                value={config.taglineSwahili}
                onChange={(e) => setConfig({ ...config, taglineSwahili: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nambari ya Simu ya Msaada (Support Hotline):
              </label>
              <input
                type="text"
                value={config.supportPhone}
                onChange={(e) => setConfig({ ...config, supportPhone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Masharti ya Huduma (Terms Text):
              </label>
              <textarea
                value={config.termsTextSwahili}
                onChange={(e) => setConfig({ ...config, termsTextSwahili: e.target.value })}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-sky-500 outline-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow"
            >
              {language === 'sw' ? 'Hifadhi Mabadiliko ya Portal' : 'Save Portal Config'}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Live Phone / Laptop Simulator (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-start space-y-4">
          {/* Simulator Toolbar */}
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white text-sm">
                {language === 'sw' ? 'Mwonekano wa Moja kwa Moja (Live Test Simulator)' : 'Live Interactive Test Preview'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-slate-800 rounded-lg p-1 text-xs">
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-1.5 rounded transition ${previewMode === 'mobile' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
                  title="Simu ya Mkononi (Mobile Phone)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-1.5 rounded transition ${previewMode === 'desktop' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
                  title="Kompyuta / Laptop"
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>

              {isLoginSuccess && (
                <button
                  onClick={() => {
                    setIsLoginSuccess(false);
                    setSimulatedVoucherInput('');
                    setStkSuccessMessage(null);
                  }}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Weka Upya</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Frame Wrapper */}
          <div
            style={{ width: previewMode === 'mobile' ? '360px' : '100%', maxWidth: previewMode === 'mobile' ? '360px' : '580px' }}
            className="bg-slate-950 border-4 border-slate-800 rounded-[28px] p-4 shadow-2xl transition-all duration-300 relative"
          >
            {/* Phone Notch/Speaker */}
            {previewMode === 'mobile' && (
              <div className="w-20 h-3.5 bg-slate-800 rounded-full mx-auto mb-3" />
            )}

            {/* Portal Content Screen */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-100 space-y-4">
              {isLoginSuccess ? (
                /* CONNECTED / STATUS VIEW */
                <div className="text-center py-6 space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full mx-auto flex items-center justify-center border border-emerald-500/30">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      UMEUNGANISHWA / CONNECTED
                    </span>
                    <h3 className="text-base font-black text-white mt-2">{config.brandName}</h3>
                    <p className="text-xs text-slate-400">Furahia intaneti ya kasi ya XCLOUD!</p>
                  </div>

                  {stkSuccessMessage && (
                    <div className="bg-emerald-950/60 border border-emerald-500/30 p-2.5 rounded-xl text-[11px] text-emerald-300 text-left font-mono">
                      {stkSuccessMessage}
                    </div>
                  )}

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs text-left">
                    <div className="flex justify-between text-slate-400">
                      <span>IP Yako:</span>
                      <span className="font-mono text-slate-200">192.168.88.102</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Muda Uliobaki:</span>
                      <span className="font-mono font-bold text-emerald-400">02:59:40</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Kasi (Speed):</span>
                      <span className="font-mono text-sky-400">5M / 5M</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsLoginSuccess(false)}
                    className="w-full bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 rounded-xl text-xs transition"
                  >
                    ONDOKA KWENYE MTANDAO (LOGOUT)
                  </button>
                </div>
              ) : (
                /* LOGIN FORM VIEW */
                <div className="space-y-4">
                  {/* Header */}
                  <div className="text-center">
                    <span className="inline-block bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase mb-1">
                      XCLOUD MIKROTIK TZ
                    </span>
                    <h3 className="text-lg font-black text-white">{config.brandName}</h3>
                    <p className="text-xs text-slate-400">{config.taglineSwahili}</p>
                    <p className="text-[11px] text-sky-400 font-medium mt-0.5 flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{config.locationName}</span>
                    </p>
                  </div>

                  {/* Tabs */}
                  <div className="flex bg-slate-950 rounded-xl p-1 text-xs">
                    <button
                      onClick={() => setActiveTab('voucher')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                        activeTab === 'voucher' ? 'bg-sky-600 text-white shadow' : 'text-slate-400'
                      }`}
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>Vocha / PIN</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('mpesa')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                        activeTab === 'mpesa' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Lipa M-Pesa</span>
                    </button>
                  </div>

                  {/* VOUCHER TAB */}
                  {activeTab === 'voucher' && (
                    <form onSubmit={handleSimulateVoucherLogin} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-400 font-medium mb-1">
                          Ingiza Namba ya Vocha (Voucher Code):
                        </label>
                        <input
                          type="text"
                          value={simulatedVoucherInput}
                          onChange={(e) => setSimulatedVoucherInput(e.target.value)}
                          placeholder="mfano: TZ-941-8842"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-center font-bold text-sm tracking-wider focus:border-sky-500 outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-sky-500/25 transition"
                      >
                        UNGANISHA SASA / CONNECT
                      </button>
                    </form>
                  )}

                  {/* MOBILE MONEY AUTO-PURCHASE TAB */}
                  {activeTab === 'mpesa' && (
                    <div className="space-y-3 text-xs">
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {plans.filter(p => p.isActive).map((p) => (
                          <div
                            key={p.id}
                            onClick={() => setSimulatedSelectedPlanId(p.id)}
                            className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                              simulatedSelectedPlanId === p.id
                                ? 'bg-emerald-950/60 border-emerald-500 text-white'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            <div>
                              <span className="font-bold text-slate-200 block">{p.nameSwahili}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{p.durationDisplay} • {p.rateLimit}</span>
                            </div>
                            <span className="font-mono font-bold text-emerald-400">
                              TSh {p.priceTzs.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-slate-400 font-medium mb-1">
                          Namba ya Simu (M-Pesa / Tigo / Airtel / Halopesa):
                        </label>
                        <input
                          type="tel"
                          value={simulatedPhoneInput}
                          onChange={(e) => setSimulatedPhoneInput(e.target.value)}
                          placeholder="0754 XXX XXX au 0713 XXX XXX"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-emerald-500 outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleSimulateMpesaStk}
                        disabled={isSimulatingStk}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSimulatingStk ? 'Inatuma STK Push...' : 'LIPA NA PATA VOCHA PAPO HAPO'}</span>
                      </button>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="pt-2 border-t border-slate-800 text-center text-[10px] text-slate-500 space-y-1">
                    <p>{config.termsTextSwahili}</p>
                    <p className="font-semibold text-slate-400">Msaada: {config.supportPhone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
