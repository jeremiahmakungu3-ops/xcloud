export type UserRole = 'super_admin' | 'hotspot_manager' | 'sales_agent';

export interface RouterDevice {
  id: string;
  name: string;
  model: string; // e.g. "MikroTik RB941-2nD (hAP lite)"
  serialNumber: string;
  firmware: string; // "RouterOS v7.14.3" or "v6.49.10"
  architecture: string; // "smips"
  ipAddress: string; // "192.168.88.1"
  tunnelIp: string; // "10.8.0.14"
  macAddress: string;
  status: 'online' | 'offline' | 'syncing';
  cpuUsage: number; // percentage
  ramUsage: number; // MB out of 32MB / 64MB
  ramTotal: number;
  uptime: string;
  voltage: number; // e.g. 5.1V
  temperature: number; // e.g. 42 C
  activeClientsCount: number;
  hotspotInterface: string; // "wlan1" or "bridge-hotspot"
  wireguardStatus: {
    connected: boolean;
    endpoint: string;
    publicKey: string;
    allowedIps: string;
    lastHandshake: string;
    rxBytes: number;
    txBytes: number;
    latencyMs: number;
  };
  apiConfig: {
    enabled: boolean;
    port: number; // 8728
    sslPort: number; // 8729
    restPort: number; // 80 / 443
    username: string;
  };
  radiusConfig: {
    enabled: boolean;
    serverIp: string;
    authPort: number; // 1812
    acctPort: number; // 1813
    secret: string;
  };
}

export interface BillingPlan {
  id: string;
  name: string;
  nameSwahili: string;
  priceTzs: number; // Price in Tanzanian Shillings
  durationDisplay: string; // "1 Hour", "24 Hours", "7 Days", "30 Days"
  validityMinutes: number; // total duration
  uptimeLimitMinutes?: number; // e.g., 60 mins
  dataLimitMb?: number; // e.g., 1024 MB (1GB), 0 for unlimited
  rateLimit: string; // "2M/2M", "5M/5M", "10M/10M" (MikroTik rate-limit rx/tx)
  burstLimit?: string; // "4M/4M 2M/2M 1M/1M 8/8"
  sharedUsers: number; // default 1
  description: string;
  badge?: string; // "Popular", "Best Value", "Bando la Siku"
  color: string;
  isActive: boolean;
}

export interface Voucher {
  id: string;
  code: string; // e.g., "TZ-8941-4921" or single PIN
  username?: string;
  password?: string;
  planId: string;
  planName: string;
  priceTzs: number;
  durationDisplay: string;
  dataLimitDisplay: string;
  speedLimit: string;
  status: 'unused' | 'active' | 'expired' | 'revoked';
  createdAt: string;
  activatedAt?: string;
  expiresAt?: string;
  agentId?: string;
  agentName?: string;
  usedByMac?: string;
  usedByIp?: string;
  bytesUsed?: {
    upload: number;
    download: number;
  };
  batchId?: string;
}

export interface ActiveSession {
  id: string;
  username: string;
  ipAddress: string;
  macAddress: string;
  deviceName: string; // e.g. "Tecno Spark 10 Pro", "Samsung Galaxy A14"
  planName: string;
  uptime: string; // "01:24:12"
  timeLeft: string; // "00:35:48"
  bytesIn: number; // Upload (bytes)
  bytesOut: number; // Download (bytes)
  rateLimit: string;
  signalStrengthDbm: number; // e.g., -58 dBm
  loginMethod: 'voucher' | 'mobile_money' | 'radius';
}

export interface MobileMoneyTransaction {
  id: string;
  receiptNumber: string; // e.g. "MPESA-TZ-88492049"
  provider: 'mpesa' | 'tigopesa' | 'airtel' | 'halopesa' | 'azampay';
  phoneNumber: string; // e.g. "+255 754 123 456"
  customerName: string;
  amountTzs: number;
  planId: string;
  planName: string;
  voucherCode: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
  referenceId: string;
}

export interface CaptivePortalConfig {
  brandName: string;
  tagline: string;
  taglineSwahili: string;
  theme: 'modern_blue' | 'tanzania_safari' | 'dar_sunset' | 'cyber_dark' | 'emerald_tz';
  logoUrl?: string;
  supportPhone: string;
  locationName: string; // e.g. "Mlimani City Hub / Kariakoo WiFi"
  enableMpesaAuto: boolean;
  enableVoucherLogin: boolean;
  enableMemberLogin: boolean;
  termsTextSwahili: string;
  termsTextEnglish: string;
  welcomeMessageSwahili: string;
  welcomeMessageEnglish: string;
  accentColor: string;
}

export interface AgentUser {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  role: UserRole;
  location: string;
  commissionRate: number; // e.g. 10%
  totalSalesTzs: number;
  vouchersGenerated: number;
  status: 'active' | 'suspended';
}
