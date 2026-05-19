import { randomBytes } from "crypto";

// ULID implementation (no external dependency)
const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function encodeTime(now: number, len: number): string {
  let str = "";
  for (let i = len; i > 0; i--) {
    str = ENCODING[now % 32] + str;
    now = Math.floor(now / 32);
  }
  return str;
}

function encodeRandom(len: number): string {
  const bytes = randomBytes(len);
  let str = "";
  for (let i = 0; i < len; i++) {
    str += ENCODING[bytes[i] % 32];
  }
  return str;
}

export function generateId(): string {
  const time = encodeTime(Date.now(), 10);
  const random = encodeRandom(16);
  return time + random;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function ttlFromNow(seconds: number): number {
  return Math.floor(Date.now() / 1000) + seconds;
}

export function ttlFromDate(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}
