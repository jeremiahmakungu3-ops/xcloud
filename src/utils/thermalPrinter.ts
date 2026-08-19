import QRCode from 'qrcode';
import { Voucher } from '../types';

export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 140,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('QR code generation error', err);
    return '';
  }
}

export function triggerBrowserPrint(): void {
  window.print();
}
