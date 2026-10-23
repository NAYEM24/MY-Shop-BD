import { test } from 'node:test';
import assert from 'node:assert';
import {
  formatToWhatsAppPhone,
  buildWhatsAppUrl,
  getOrderWhatsAppMessage,
  getGeneralWhatsAppMessage,
} from './whatsapp.ts';

test('formatToWhatsAppPhone formats local Bangladeshi numbers to international format', () => {
  assert.strictEqual(formatToWhatsAppPhone('01940320627'), '8801940320627');
  assert.strictEqual(formatToWhatsAppPhone('+880 1940-320627'), '8801940320627');
  assert.strictEqual(formatToWhatsAppPhone('1940320627'), '8801940320627');
  assert.strictEqual(formatToWhatsAppPhone('8801940320627'), '8801940320627');
});

test('buildWhatsAppUrl creates valid wa.me URL with encoded message', () => {
  const urlWithoutMsg = buildWhatsAppUrl('01940320627');
  assert.strictEqual(urlWithoutMsg, 'https://wa.me/8801940320627');

  const urlWithMsg = buildWhatsAppUrl('01940320627', 'Hello Support');
  assert.strictEqual(urlWithMsg, 'https://wa.me/8801940320627?text=Hello%20Support');
});

test('getOrderWhatsAppMessage includes orderNumber and courier tracking info', () => {
  const bnMsg = getOrderWhatsAppMessage('MSBD-2026-8841', 'bn', 'Steadfast', 'ST-9021844BD');
  assert.ok(bnMsg.includes('MSBD-2026-8841'));
  assert.ok(bnMsg.includes('Steadfast'));
  assert.ok(bnMsg.includes('ST-9021844BD'));

  const enMsg = getOrderWhatsAppMessage('MSBD-2026-8841', 'en');
  assert.ok(enMsg.includes('#MSBD-2026-8841'));
});
