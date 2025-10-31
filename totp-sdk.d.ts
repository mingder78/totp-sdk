// totp-sdk.d.ts
/**
 * TOTP (Time-Based One-Time Password) SDK
 * RFC 6238 compliant – 100% compatible with Google Authenticator
 */
export class TOTP {
  /**
   * Create a new TOTP instance
   *
   * @param secret Base32-encoded secret key (e.g. "JBSWY3DPEHPK3PXP")
   * @param options Configuration options
   */
  constructor(
    secret: string,
    options?: {
      /** Number of digits (6, 7, or 8) – default: 6 */
      digits?: 6 | 7 | 8;
      /** Time step in seconds – default: 30 */
      period?: number;
      /** Hash algorithm – default: SHA1 */
      algorithm?: 'SHA1' | 'SHA256' | 'SHA512';
    }
  );

  /**
   * Generate the current TOTP code (based on current time)
   *
   * @returns 6-digit (or configured) OTP string
   */
  generate(): string;

  /**
   * Generate TOTP code for a specific timestamp
   *
   * @param timestamp Unix timestamp in milliseconds
   * @returns OTP string
   */
  generateAt(timestamp: number): string;

  /**
   * Verify a TOTP code with tolerance window
   *
   * @param code The user-provided code
   * @param window Number of periods to check before/after (default: 1 → ±30s)
   * @returns true if valid
   */
  verify(code: string, window?: number): boolean;

  /**
   * Get the current counter value (floor(time / period))
   *
   * @returns Current counter (integer)
   */
  getCounter(): number;

  /**
   * Get seconds remaining until the current code expires
   *
   * @returns 0–29 (or 0–period)
   */
  getTimeRemaining(): number;
}
