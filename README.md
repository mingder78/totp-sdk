# TOTP SDK (TypeScript)

> **100% Google Authenticator Compatible**  
> RFC 6238-compliant TOTP (Time-Based One-Time Password) in **TypeScript/JavaScript**  
> Zero dependencies • Full TypeScript types • Node.js & Browser ready

[![npm](https://img.shields.io/npm/v/@yourorg/totp-sdk?style=flat-square)](https://npmjs.com/package/@yourorg/totp-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/github/license/yourname/totp-sdk?style=flat-square)](LICENSE)

---

## Features

- **Google Authenticator compatible** – works with Authy, Microsoft, 1Password, etc.
- **Zero dependencies** – uses Node.js `crypto` or Web Crypto
- **Full TypeScript support** – autocomplete, type safety
- **RFC 6238 compliant** – SHA1/SHA256/SHA512, 6–8 digits
- **Clock drift tolerance** – configurable window
- **QR code URL generation** – `otpauth://` support
- **Time remaining** – UX-friendly countdown
- **HOTP support** – counter-based fallback

---

## Installation

```bash
npm install @yourorg/totp-sdk
