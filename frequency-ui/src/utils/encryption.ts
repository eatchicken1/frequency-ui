// src/utils/encryption.ts
import CryptoJS from 'crypto-js';

// Pig 默认的 AES 密钥 (可在 Nacos 的 pig-gateway-dev.yml 中找到 security.encode.key)
// 如果你的后端改过，请务必同步修改这里！
const KEY = CryptoJS.enc.Utf8.parse('thanks,pig4cloud'); 
const IV = CryptoJS.enc.Utf8.parse('thanks,pig4cloud'); 

/**
 * AES加密
 */
export function encrypt(word: string) {
  const src = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(src, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  return encrypted.toString();
}

/**
 * AES解密
 */
export function decrypt(word: string) {
  const decrypt = CryptoJS.AES.decrypt(word, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  return decrypt.toString(CryptoJS.enc.Utf8);
}