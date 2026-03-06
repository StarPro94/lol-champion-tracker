import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

function isValidUtf8(buffer: Buffer): boolean {
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    return true;
  } catch {
    return false;
  }
}

describe('frontend source encoding', () => {
  it('keeps App.tsx valid UTF-8 so Tailwind can scan all utility classes', () => {
    const raw = readFileSync('src/App.tsx');
    expect(isValidUtf8(raw)).toBe(true);
  });
});