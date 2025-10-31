// totp-sdk.ts
import { createHmac } from 'crypto';

/**
 * TOTP SDK - Generate and verify time-based one-time passwords
 * RFC 6238 compliant
 */
export class TOTP {
  private secret: string;
  private digits: number;
  private period: number; // seconds
  private algorithm: 'SHA1' | 'SHA256' | 'SHA512';

  constructor(
    secret: string,
    options: {
      digits?: number;
      period?: number;
      algorithm?: 'SHA1' | 'SHA256' | 'SHA512';
    } = {}
  ) {
    this.secret = secret.replace(/\s/g, '').toUpperCase(); // Clean secret
    this.digits = options.digits ?? 6;
    this.period = options.period ?? 30;
    this.algorithm = options.algorithm ?? 'SHA1';
  }

  /**
   * Generate TOTP code for current time
   */
  generate(): string {
    const counter = Math.floor(Date.now() / 1000 / this.period);
    return this.hotp(this.secret, counter);
  }

  /**
   * Generate TOTP with custom timestamp
   */
  generateAt(timestamp: number): string {
    const counter = Math.floor(timestamp / 1000 / this.period);
    return this.hotp(this.secret, counter);
  }

  /**
   * Verify a TOTP code with window tolerance
   */
  verify(code: string, window: number = 1): boolean {
    const now = Math.floor(Date.now() / 1000 / this.period);
    code = code.trim();

    for (let i = -window; i <= window; i++) {
      const counter = now + i;
      if (this.hotp(this.secret, counter) === code) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get current counter value (for debugging/sync)
   */
  getCounter(): number {
    return Math.floor(Date.now() / 1000 / this.period);
  }

  /**
   * Get time remaining in current period
   */
  getTimeRemaining(): number {
    const elapsed = Date.now() / 1000 % this.period;
    return Math.floor(this.period - elapsed);
  }

  /**
   * HOTP core function (used by TOTP)
   */
  private hotp(secret: string, counter: number): string {
    // Decode base32 secret
    const key = this.base32ToBuffer(secret);

    // Counter to 8-byte buffer
    const counterBuffer = Buffer.alloc(8);
    for (let i = 7; i >= 0; i--) {
      counterBuffer[i] = counter & 0xff;
      counter >>= 8;
    }

    // HMAC
    const hmac = createHmac(this.algorithm.toLowerCase() as any, key);
    hmac.update(counterBuffer);
    const hmacResult = hmac.digest();

    // Truncate
    const offset = hmacResult[hmacResult.length - 1] & 0xf;
    const binary =
      ((hmacResult[offset] & 0x7f) << 24) |
      ((hmacResult[offset + 1] & 0xff) << 16) |
      ((hmacResult[offset + 2] & 0xff) << 8) |
      (hmacResult[offset + 3] & 0xff);

    // Modulo
    const code = binary % Math.pow(10, this.digits);
    return code.toString().padStart(this.digits, '0');
  }

  /**
   * Base32 decoding (RFC 4648)
   */
  private base32ToBuffer(base32: string): Buffer {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let buffer = Buffer.alloc(Math.ceil((base32.length * 5) / 8));
    let bufferIndex = 0;
    let bufferBits = 0;
    let bits = 0;

    for (const char of base32) {
      const val = alphabet.indexOf(char);
      if (val === -1) throw new Error('Invalid base32 character');
      bits = (bits << 5) | val;
      bufferBits += 5;
      if (bufferBits >= 8) {
        buffer[bufferIndex++] = (bits >>> (bufferBits - 8)) & 0xff;
        bufferBits -= 8;
      }
    }

    return buffer.slice(0, bufferIndex);
  }
}
