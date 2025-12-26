import CryptoJS from 'crypto-js'

/**
 * AES 加密
 * @param src 待加密的明文密码
 * @param keyWord 加密密钥
 */
export function encryption(src: string, keyWord: string) {
  const key = CryptoJS.enc.Utf8.parse(keyWord); 
  // 加密 
  const encrypted = CryptoJS.AES.encrypt(src, key, { 
      iv: key, 
      mode: CryptoJS.mode.CFB, 
      padding: CryptoJS.pad.NoPadding, 
  }); 
  return encrypted.toString(); 
}

/**
 * AES 解密
 * @param encryptedText 加密后的文本
 * @param keyWord 解密密钥
 */
export function decryption(encryptedText: string, keyWord: string) {
  const key = CryptoJS.enc.Utf8.parse(keyWord);
  const decrypt = CryptoJS.AES.decrypt(encryptedText, key, {
    iv: key,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}