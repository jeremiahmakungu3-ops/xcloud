import React, { useState } from 'react';
import { 
  Ticket, 
  Search, 
  Filter, 
  Printer, 
  FileText, 
  Download, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Plus, 
  Share2, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { Voucher, BillingPlan, RouterDevice } from '../types';

interface VouchersListProps {
  vouchers: Voucher[];
  plans: BillingPlan[];
  router: RouterDevice;
  onOpenGenerator: () => void;
  onPrintThermal: (selectedVouchers: Voucher[]) => void;
  onPrintPdf: (selectedVouchers: Voucher[]) => void;
  onDeleteVouchers: (voucherIds: string[]) => void;
  language: 'sw' | 'en';
}

export const VouchersList: React.FC<VouchersListProps> = ({
  vouchers,
  plans,
  router,
  onOpenGenerator,
  onPrintThermal,
  onPrintPdf,
  onDeleteVouchers,
  language,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredVouchers = vouchers.filter((v) => {
    const matchesSearch = v.code.toLowerCase().includes(search.toLowerCase()) || 
      (v.agentName && v.agentName.toLowerCase().includes(search.toLowerCase())) ||
      (v.usedByIp && v.usedByIp.includes(search));
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesPlan = planFilter === 'all' || v.planId === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredVouchers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVouchers.map((v) => v.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedVoucherObjects = vouchers.filter((v) => selectedIds.includes(v.id));

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportCsv = () => {
    const headers = ['Voucher Code', 'Plan Name', 'Price TZS', 'Duration', 'Speed', 'Status', 'Created At', 'Agent'];
    const rows = filteredVouchers.map((v) => [
      v.code,
      `"${v.planName}"`,
      v.priceTzs,
      `"${v.durationDisplay}"`,
      `"${v.speedLimit}"`,
      v.status,
      `"${v.createdAt}"`,
      `"${v.agentName || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `xcloud_vouchers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Ticket className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-black text-white">
              {language === 'sw' ? 'Orodha ya Vocha & Mauzo ya POS' : 'Voucher Management & POS Sales'}
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            {language === 'sw'
              ? 'Tengeneza, chapisha kwa risiti ya Thermal 58mm/80mm au PDF ya A4, na ufuatilie hali ya vocha za wateja.'
              : 'Generate, filter, and print thermal tickets or export A4 sheets for distribution.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onOpenGenerator}
            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-sky-500/25 text-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'sw' ? 'Tengeneza Vocha' : 'Batch Generate'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'sw' ? 'Tafuta kwa namba ya vocha, wakala au IP...' : 'Search by code, agent or IP...'}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-sky-500 font-medium"
          >
            <option value="all">{language === 'sw' ? 'Hali Zote' : 'All Statuses'}</option>
            <option value="unused">{language === 'sw' ? 'Haijatumika (Unused)' : 'Unused'}</option>
            <option value="active">{language === 'sw' ? 'Inatumika Sasa (Active)' : 'Active'}</option>
            <option value="expired">{language === 'sw' ? 'Imeisha Muda (Expired)' : 'Expired'}</option>
          </select>

          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-sky-500 font-medium"
          >
            <option value="all">{language === 'sw' ? 'Mabando Yote' : 'All Plans'}</option>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nameSwahili || p.name}
              </option>
            ))}
          </select>

          <button
            onClick={exportCsv}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 text-xs flex items-center gap-1.5 transition"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Batch Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-sky-950/80 border border-sky-500/50 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="bg-sky-500 text-slate-950 font-black px-2 py-0.5 rounded-full font-mono">
              {selectedIds.length}
            </span>
            <span className="font-semibold text-slate-200">
              {language === 'sw' ? 'Vocha zimechaguliwa' : 'Vouchers selected'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onPrintThermal(selectedVoucherObjects)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Chapisha Thermal (POS)' : 'Print Thermal'}</span>
            </button>

            <button
              onClick={() => onPrintPdf(selectedVoucherObjects)}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Chapisha PDF A4' : 'Print PDF Sheet'}</span>
            </button>

            <button
              onClick={() => {
                if (confirm(`Una uhakika unataka kufuta vocha ${selectedIds.length}?`)) {
                  onDeleteVouchers(selectedIds);
                  setSelectedIds([]);
                }
              }}
              className="bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Futa</span>
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredVouchers.length && filteredVouchers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-700 bg-slate-900 text-sky-500 cursor-pointer"
                  />
                </th>
                <th className="p-4">{language === 'sw' ? 'Namba ya Vocha' : 'Voucher PIN'}</th>
                <th className="p-4">{language === 'sw' ? 'Bando & Bei (TZS)' : 'Plan & Price'}</th>
                <th className="p-4">{language === 'sw' ? 'Muda & Kasi' : 'Duration & Rate'}</th>
                <th className="p-4">{language === 'sw' ? 'Hali' : 'Status'}</th>
                <th className="p-4">{language === 'sw' ? 'Wakala' : 'Agent / Batch'}</th>
                <th className="p-4 text-right">{language === 'sw' ? 'Vitendo' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredVouchers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Hakuna vocha iliyopatikana kulingana na vigezo vyako.
                  </td>
                </tr>
              ) : (
                filteredVouchers.map((voucher) => {
                  const isSelected = selectedIds.includes(voucher.id);
                  return (
                    <tr
                      key={voucher.id}
                      className={`hover:bg-slate-800/50 transition ${isSelected ? 'bg-sky-950/30' : ''}`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(voucher.id)}
                          className="rounded border-slate-700 bg-slate-900 text-sky-500 cursor-pointer"
                        />
                      </td>

                      {/* Code */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm bg-slate-950 px-2 py-1 rounded border border-slate-800 select-all">
                            {voucher.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(voucher.id, voucher.code)}
                            className="text-slate-400 hover:text-white p-1 rounded"
                            title="Nakili Code"
                          >
                            {copiedId === voucher.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                          ID: {voucher.id}
                        </span>
                      </td>

                      {/* Plan & Price */}
                      <td className="p-4">
                        <div className="font-semibold text-slate-200">{voucher.planName}</div>
                        <div className="font-mono font-bold text-emerald-400 text-xs">
                          TSh {voucher.priceTzs.toLocaleString()}
                        </div>
                      </td>

                      {/* Duration & Speed */}
                      <td className="p-4 font-mono text-[11px]">
                        <div>{voucher.durationDisplay} ({voucher.dataLimitDisplay})</div>
                        <div className="text-sky-400">{voucher.speedLimit}</div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            voucher.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : voucher.status === 'unused'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : voucher.status === 'expired'
                              ? 'bg-slate-800 text-slate-400 border border-slate-700'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              voucher.status === 'active'
                                ? 'bg-emerald-400 animate-pulse'
                                : voucher.status === 'unused'
                                ? 'bg-amber-400'
                                : 'bg-slate-500'
                            }`}
                          />
                          {voucher.status === 'active'
                            ? 'Inatumika'
                            : voucher.status === 'unused'
                            ? 'Haijatumika'
                            : voucher.status === 'expired'
                            ? 'Imeisha'
                            : 'Imezuiwa'}
                        </span>
                        {voucher.usedByIp && (
                          <span className="block text-[10px] text-slate-500 font-mono mt-1">
                            IP: {voucher.usedByIp}
                          </span>
                        )}
                      </td>

                      {/* Agent */}
                      <td className="p-4 text-[11px]">
                        <div className="text-slate-300 font-medium">{voucher.agentName || 'Online (M-Pesa)'}</div>
                        <div className="text-slate-500 text-[10px]">{voucher.createdAt}</div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onPrintThermal([voucher])}
                            className="p-1.5 bg-slate-800 hover:bg-emerald-900 text-emerald-400 rounded-lg transition"
                            title="Chapisha Thermal 58mm"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onPrintPdf([voucher])}
                            className="p-1.5 bg-slate-800 hover:bg-sky-900 text-sky-400 rounded-lg transition"
                            title="Chapisha PDF A4"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteVouchers([voucher.id])}
                            className="p-1.5 bg-slate-800 hover:bg-red-950 text-red-400 rounded-lg transition"
                            title="Futa Vocha"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
