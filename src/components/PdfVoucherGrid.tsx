import React, { useEffect, useState } from 'react';
import { Printer, X, Download, Wifi, Sparkles, QrCode } from 'lucide-react';
import { Voucher, RouterDevice } from '../types';
import { generateQrDataUrl } from '../utils/thermalPrinter';

interface PdfVoucherGridProps {
  vouchers: Voucher[];
  router: RouterDevice;
  onClose: () => void;
  language: 'sw' | 'en';
}

export const PdfVoucherGrid: React.FC<PdfVoucherGridProps> = ({
  vouchers,
  router,
  onClose,
  language,
}) => {
  const [gridCount, setGridCount] = useState<6 | 12>(12);
  const [qrMap, setQrMap] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadQrs() {
      const map: Record<string, string> = {};
      for (const v of vouchers) {
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
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-6 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Top bar controls */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl border border-sky-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {language === 'sw' ? 'Karatasi ya Vocha za PDF (A4 Sheet Grid)' : 'Modern A4 Printable Voucher Grid'}
              </h3>
              <p className="text-xs text-slate-400">
                Vocha {vouchers.length} zimepangwa vizuri tayari kwa kukatwa (Cutting lines)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setGridCount(6)}
                className={`px-3 py-1 rounded font-bold transition ${gridCount === 6 ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
              >
                Kadi 6 kwa Ukurasa (Kubwa)
              </button>
              <button
                onClick={() => setGridCount(12)}
                className={`px-3 py-1 rounded font-bold transition ${gridCount === 12 ? 'bg-sky-600 text-white' : 'text-slate-400'}`}
              >
                Kadi 12 kwa Ukurasa (Standard)
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-sky-600/25 transition"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'sw' ? 'Chapisha Karatasi ya A4' : 'Print A4 PDF'}</span>
            </button>

            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable A4 Canvas */}
        <div className="p-8 max-h-[75vh] overflow-y-auto bg-slate-950/80 flex justify-center print:p-0 print:bg-white print:max-h-none">
          <div className={`grid ${gridCount === 6 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'} gap-3 w-full bg-white p-4 rounded-xl print:shadow-none print:border-none print:p-0`}>
            {vouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="border-2 border-dashed border-slate-300 rounded-xl p-3 bg-gradient-to-b from-slate-50 to-white text-slate-900 flex flex-col justify-between relative overflow-hidden print:border-dashed print:border-black"
              >
                {/* Tanzania Flag Top Accent */}
                <div className="h-1.5 w-full absolute top-0 left-0 flex">
                  <div className="h-full w-1/3 bg-emerald-500"></div>
                  <div className="h-full w-1/3 bg-amber-400"></div>
                  <div className="h-full w-1/3 bg-sky-500"></div>
                </div>

                <div>
                  {/* Card Header */}
                  <div className="flex justify-between items-start pt-1 mb-1.5">
                    <div>
                      <span className="font-black text-xs text-slate-900 tracking-tight block">XCLOUD WI-FI</span>
                      <span className="text-[8px] text-slate-500 font-bold block">SSID: XCLOUD-HOTSPOT</span>
                    </div>
                    <span className="bg-emerald-600 text-white font-mono font-bold text-[10px] px-1.5 py-0.5 rounded">
                      TSh {voucher.priceTzs.toLocaleString()}
                    </span>
                  </div>

                  {/* Plan Badge */}
                  <div className="bg-slate-100 px-2 py-1 rounded text-center border border-slate-200 mb-2">
                    <span className="text-[10px] font-bold text-slate-800 block truncate">{voucher.planName}</span>
                    <span className="text-[9px] text-slate-500 font-medium">
                      Muda: <b>{voucher.durationDisplay}</b> • Kasi: <b>{voucher.speedLimit}</b>
                    </span>
                  </div>

                  {/* Code Box */}
                  <div className="bg-slate-900 text-white p-2 rounded-lg text-center mb-2">
                    <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wider">
                      VOUCHER CODE / PIN
                    </span>
                    <span className="text-sm font-black font-mono tracking-widest block text-amber-300 select-all">
                      {voucher.code}
                    </span>
                  </div>
                </div>

                {/* QR Code & Footer */}
                <div className="flex items-center justify-between border-t border-slate-200 pt-1.5 mt-1">
                  {qrMap[voucher.id] ? (
                    <img src={qrMap[voucher.id]} alt="QR" className="w-12 h-12 border border-slate-300 rounded" />
                  ) : (
                    <div className="w-12 h-12 bg-slate-100 flex items-center justify-center text-[8px] text-slate-400">QR</div>
                  )}
                  <div className="text-right text-[8px] text-slate-500">
                    <span className="block font-bold text-slate-700">Scan QR kujiunga</span>
                    <span className="block font-mono">{voucher.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
