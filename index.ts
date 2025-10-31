// example.ts
import { TOTP } from './totp-sdk';

// Create TOTP instance
const totp = new TOTP('JBSWY3DPEHPK3PXP', {
  digits: 6,
  period: 30,
  algorithm: 'SHA1'
});

// Generate current code
const code = totp.generate();
console.log('Current TOTP:', code);
console.log('Time remaining:', totp.getTimeRemaining(), 'seconds');

// Verify code (with ±30s tolerance)
setTimeout(() => {
  const valid = totp.verify(code);
  console.log('Valid?', valid);
}, 1000);
