import { CaptivePortalConfig, BillingPlan } from '../types';

export function generateMikrotikLoginHtml(config: CaptivePortalConfig, plans: BillingPlan[]): string {
  const plansHtml = plans
    .filter((p) => p.isActive)
    .map(
      (p) => `
      <div class="plan-card">
        <div class="plan-header">
          <span class="plan-name">${p.nameSwahili} (${p.durationDisplay})</span>
          <span class="plan-price">TSh ${p.priceTzs.toLocaleString()}</span>
        </div>
        <div class="plan-details">
          <span>Kasi: ${p.rateLimit}</span> | <span>Kiwango: ${p.dataLimitMb ? `${p.dataLimitMb} MB` : 'Bila Kikomo'}</span>
        </div>
      </div>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="sw">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.brandName} - Captive Portal</title>
  <style>
    :root {
      --primary: ${config.accentColor || '#0284c7'};
      --bg: #0f172a;
      --card: #1e293b;
      --text: #f8fafc;
      --muted: #94a3b8;
      --accent: #10b981;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 16px; }
    .portal-box { background: var(--card); border: 1px solid #334155; border-radius: 16px; width: 100%; max-width: 420px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    .header { text-align: center; margin-bottom: 20px; }
    .badge { display: inline-block; background: rgba(2, 132, 199, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }
    h1 { font-size: 22px; font-weight: 800; color: #fff; margin-bottom: 4px; }
    .tagline { font-size: 13px; color: var(--muted); }
    .location { font-size: 12px; color: #38bdf8; margin-top: 4px; }
    
    .tabs { display: flex; background: #0f172a; border-radius: 10px; padding: 4px; margin-bottom: 20px; }
    .tab-btn { flex: 1; padding: 8px; font-size: 13px; font-weight: 600; border: none; background: transparent; color: var(--muted); border-radius: 8px; cursor: pointer; }
    .tab-btn.active { background: var(--primary); color: #fff; }
    
    .form-group { margin-bottom: 16px; }
    label { display: block; font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 6px; }
    input[type="text"], input[type="password"], input[type="tel"] { width: 100%; padding: 12px 14px; background: #0f172a; border: 1px solid #334155; border-radius: 10px; color: #fff; font-size: 15px; outline: none; }
    input:focus { border-color: var(--primary); }
    
    .submit-btn { width: 100%; padding: 14px; background: var(--primary); color: #fff; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: 0.2s; }
    .submit-btn:hover { opacity: 0.9; }
    
    .plan-card { background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 12px; margin-bottom: 8px; cursor: pointer; }
    .plan-card:hover { border-color: var(--accent); }
    .plan-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 14px; color: #fff; }
    .plan-price { color: var(--accent); }
    .plan-details { font-size: 11px; color: var(--muted); margin-top: 4px; }
    
    .footer { text-align: center; margin-top: 20px; font-size: 11px; color: var(--muted); }
    .footer a { color: #38bdf8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="portal-box">
    <div class="header">
      <span class="badge">XCLOUD MIKROTIK TZ</span>
      <h1>${config.brandName}</h1>
      <p class="tagline">${config.taglineSwahili}</p>
      <p class="location">📍 ${config.locationName}</p>
    </div>

    <div class="tabs">
      <button class="tab-btn active" onclick="showTab('voucher')">Vocha / Voucher</button>
      <button class="tab-btn" onclick="showTab('mpesa')">Lipa M-Pesa / Tigo</button>
    </div>

    <!-- VOUCHER FORM (Standard MikroTik Hotspot $(link-login-only)) -->
    <form name="sendin" action="$(link-login-only)" method="post" id="voucher-form">
      <input type="hidden" name="dst" value="$(link-orig)" />
      <input type="hidden" name="popup" value="true" />
      
      <div class="form-group">
        <label for="username">Namba ya Vocha / Voucher Code:</label>
        <input type="text" id="username" name="username" placeholder="Mfano: TZ-941-XXXX" required autocomplete="off" />
      </div>
      <input type="hidden" id="password" name="password" value="" />
      
      <button type="submit" class="submit-btn" onclick="document.getElementById('password').value = document.getElementById('username').value;">
        UNGANISHA SASA / CONNECT
      </button>
    </form>

    <!-- MOBILE MONEY PURCHASE LIST -->
    <div id="mpesa-section" style="display: none;">
      <div style="font-size: 12px; color: var(--muted); margin-bottom: 12px;">
        Chagua Bando kisha pokea ujumbe kwenye simu yako kulipia:
      </div>
      ${plansHtml}
      
      <div style="margin-top: 14px;">
        <label>Nambari ya Simu (M-Pesa / Tigo Pesa / Airtel / Halopesa):</label>
        <input type="tel" placeholder="07XX XXX XXX au 06XX XXX XXX" style="margin-bottom: 10px;" />
        <button type="button" class="submit-btn" style="background: #10b981;" onclick="alert('Ombi la malipo (STK Push) limetumwa kwenye simu yako! Tafadhali weka PIN ya M-Pesa kukamilisha.');">
          LIPA NA PATA VOCHA PAPO HAPO
        </button>
      </div>
    </div>

    <div class="footer">
      <p>${config.termsTextSwahili}</p>
      <p style="margin-top: 6px;">Msaada / Support: <b>${config.supportPhone}</b></p>
      <p style="margin-top: 4px; font-size: 9px; opacity: 0.7;">Powered by XCloud Tanzania RB941 Hotspot System</p>
    </div>
  </div>

  <script>
    function showTab(type) {
      const vForm = document.getElementById('voucher-form');
      const mSection = document.getElementById('mpesa-section');
      const btns = document.querySelectorAll('.tab-btn');
      if (type === 'voucher') {
        vForm.style.display = 'block';
        mSection.style.display = 'none';
        btns[0].classList.add('active');
        btns[1].classList.remove('active');
      } else {
        vForm.style.display = 'none';
        mSection.style.display = 'block';
        btns[0].classList.remove('active');
        btns[1].classList.add('active');
      }
    }
  </script>
</body>
</html>`;
}

export function generateMikrotikStatusHtml(config: CaptivePortalConfig): string {
  return `<!DOCTYPE html>
<html lang="sw">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.brandName} - Hali ya Mtandao</title>
  <style>
    body { background: #0f172a; color: #f8fafc; font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
    .card { background: #1e293b; border-radius: 16px; padding: 24px; max-width: 400px; width: 100%; border: 1px solid #334155; text-align: center; }
    .status-badge { background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid #10b981; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: bold; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #334155; font-size: 13px; }
    .info-label { color: #94a3b8; }
    .info-value { font-weight: bold; }
    .btn-logout { background: #ef4444; color: white; border: none; padding: 12px; border-radius: 8px; width: 100%; font-weight: bold; margin-top: 16px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <span class="status-badge">UMEUNGANISHWA / CONNECTED</span>
    <h2 style="margin: 12px 0 4px;">${config.brandName}</h2>
    <p style="color: #94a3b8; font-size: 12px; margin-bottom: 20px;">Furahia Intaneti ya Kasi ya XCLOUD</p>
    
    <div class="info-row"><span class="info-label">Mtumiaji (IP):</span><span class="info-value">$(ip)</span></div>
    <div class="info-row"><span class="info-label">Namba ya Vocha:</span><span class="info-value">$(username)</span></div>
    <div class="info-row"><span class="info-label">Muda Uliotumika (Uptime):</span><span class="info-value">$(uptime)</span></div>
    <div class="info-row"><span class="info-label">Muda Uliobaki:</span><span class="info-value">$(session-time-left)</span></div>
    <div class="info-row"><span class="info-label">Data Iliyopakuliwa (Bytes Out):</span><span class="info-value">$(bytes-out-nice)</span></div>
    <div class="info-row"><span class="info-label">Data Iliyopakiwa (Bytes In):</span><span class="info-value">$(bytes-in-nice)</span></div>

    <form action="$(link-logout)" name="logout">
      <button type="submit" class="btn-logout">ONDOKA / LOGOUT</button>
    </form>
  </div>
</body>
</html>`;
}

export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
