import React, { useEffect, useState } from 'react';
import { Printer, X, Check, Copy, Wifi, QrCode } from 'lucide-react';
import { Voucher, RouterDevice } from '../types';
import { generateQrDataUrl } from '../utils/thermalPrinter';

interface ThermalPrintViewProps {
  vouchers: Voucher[];
  router: RouterDevice;
  onClose: () => void;
  language: 'sw' | 'en';
}

export const ThermalPrintView: React.FC<ThermalPrintViewProps> = ({
  vouchers,
  router,
  onClose,
  language,
}) => {
  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>('58mm');
  const [qrMap, setQrMap] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadQrs() {
      const map: Record<string, string> = {};
      for (const v of vouchers) {
        // Fast login URL targeting the MikroTik Hotspot
        const loginUrl = `http://${router.ipAddress}/login?username=${encodeURIComponent(v.code)}&password=${encodeURIComponent(v.code)}`;
        map[v.id] = await generateQrDataUrl(loginUrl);
      }
      setQrMap(map);
    }
    loadQrs();
  }, [vouchers, router.ipAddress]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-6 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Controls (Hidden in Print) */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {language === 'sw' ? 'Uchapishaji wa Risiti ya Thermal (POS 58mm/80mm)' : 'Thermal POS Voucher Printer'}
              </h3>
              <p className="text-xs text-slate-400">
                Vocha {vouchers.length} zimechaguliwa kwa ajili ya kuchapishwa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Paper Size selector */}
            <div className="flex bg-slate-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setPaperWidth('58mm')}
                className={`px-3 py-1 rounded font-bold transition ${paperWidth === '58mm' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
              >
                58mm (Kawaida)
              </button>
              <button
                onClick={() => setPaperWidth('80mm')}
                className={`px-3 py-1 rounded font-bold transition ${paperWidth === '80mm' ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
              >
                80mm (Pana)
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'sw' ? 'Chapisha Sasa (Print)' : 'Print Now'}</span>
            </button>

            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Thermal Receipts Container */}
        <div className="p-6 max-h-[75vh] overflow-y-auto flex flex-col items-center gap-6 bg-slate-950/60 print:p-0 print:m-0 print:bg-white print:max-h-none">
          {vouchers.map((voucher, idx) => (
            <div
              key={voucher.id}
              style={{ width: paperWidth === '58mm' ? '280px' : '360px' }}
              className="bg-white text-slate-900 p-5 rounded-lg shadow-xl font-mono border-2 border-dashed border-slate-300 text-center relative print:shadow-none print:border-b-2 print:border-black print:rounded-none print:m-0 print:page-break-after-always"
            >
              {/* Paper receipt cut indicator */}
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 print:hidden">
                ✂️ KATIA HAPA / TEAR HERE
              </div>

              {/* Logo / Header */}
              <div className="border-b-2 border-slate-900 pb-2 mb-3">
                <h2 className="text-base font-black tracking-tight leading-none">XCLOUD WI-FI TZ</h2>
                <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">
                  MikroTik RB941 Hotspot Zone
                </p>
                <p className="text-[10px] text-slate-700">SSID: <b>XCLOUD-HOTSPOT-TZ</b></p>
              </div>

              {/* Package & Price */}
              <div className="bg-slate-100 p-2 rounded border border-slate-300 mb-3">
                <span className="text-xs font-black block text-slate-800">{voucher.planName}</span>
                <span className="text-lg font-black text-slate-900 block my-0.5">
                  TSh {voucher.priceTzs.toLocaleString()}
                </span>
                <div className="text-[10px] text-slate-600 flex justify-center gap-2">
                  <span>Muda: <b>{voucher.durationDisplay}</b></span>
                  <span>|</span>
                  <span>Kasi: <b>{voucher.speedLimit}</b></span>
                </div>
              </div>

              {/* Voucher PIN / Code */}
              <div className="border-2 border-slate-900 bg-slate-50 py-2.5 px-3 rounded-lg mb-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">
                  NAMBA YA VOCHA / VOUCHER CODE
                </span>
                <span className="text-xl font-black text-slate-950 tracking-wider font-mono block select-all">
                  {voucher.code}
                </span>
              </div>

              {/* QR Code for Instant Camera Login */}
              {qrMap[voucher.id] && (
                <div className="my-2 flex flex-col items-center">
                  <img
                    src={qrMap[voucher.id]}
                    alt="QR Login"
                    className="w-28 h-28 mx-auto border border-slate-300 p-1 bg-white"
                  />
                  <span className="text-[9px] text-slate-500 mt-1">
                    Scan kamera kujiunga moja kwa moja bila kuandika!
                  </span>
                </div>
              )}

              {/* Instructions in Swahili */}
              <div className="text-[10px] text-slate-700 text-left border-t border-slate-300 pt-2 space-y-1">
                <p className="font-bold">Jinsi ya Kujiunga:</p>
                <p>1. Unganisha Wi-Fi: <b>XCLOUD-HOTSPOT-TZ</b></p>
                <p>2. Fungua browser au subiri ukurasa wa kuingia.</p>
                <p>3. Ingiza namba ya vocha hapo juu au scan QR code.</p>
              </div>

              {/* Footer */}
              <div className="border-t border-dashed border-slate-400 mt-3 pt-2 text-[9px] text-slate-500">
                <p>Wakala: {voucher.agentName || 'Kariakoo Pos #01'}</p>
                <p>Tarehe: {voucher.createdAt} • Serial: {voucher.id}</p>
                <p className="font-bold text-slate-700 mt-1">Asante kwa kutumia XCloud Tanzania!</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
