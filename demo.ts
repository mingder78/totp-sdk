// demo.ts
import { randomBytes } from 'crypto';
import { TOTP } from './totp-sdk';
import QRCode from 'qrcode';

function base32Encode(buf: Buffer): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0, val = 0, out = '';
  for (const b of buf) {
    val = (val << 8) | b; bits += 8;
    while (bits >= 5) { out += alphabet[(val >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits) out += alphabet[(val << (5 - bits)) & 31];
  return out;
}

(async () => {
  const secret = base32Encode(randomBytes(20));
  const url = `otpauth://totp/Test:user@demo.com?secret=${secret}&issuer=Test`;

  console.log('Scan this QR in Google Authenticator:\n');
  console.log(await QRCode.toString(url, { type: 'terminal', small: true }));
  console.log(`Secret: ${secret}\n`);

  const totp = new TOTP(secret);
  setInterval(() => {
    console.log(`Code: ${totp.generate()} | Expires in: ${totp.getTimeRemaining()}s`);
  }, 1000);
})();
