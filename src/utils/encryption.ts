import CryptoJS from 'crypto-js'

// 你的 Nacos 配置密钥
const keyStr = 'thanks,pig4cloud'

/**
 * 加密处理 (严格复刻 Pig-UI other.ts)
 * 模式：CFB
 * 填充：NoPadding
 * IV：等于 Key
 */
export function encrypt(src: string) {
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  
  const encrypted = CryptoJS.AES.encrypt(src, key, {
    iv: key, // 关键点：Pig 把 Key 当 IV 用
    mode: CryptoJS.mode.CFB, // 关键点：使用 CFB 模式
    padding: CryptoJS.pad.NoPadding // 关键点：无填充
  })
  
  return encrypted.toString()
}

/**
 * 解密处理
 */
export function decrypt(src: string) {
  const key = CryptoJS.enc.Utf8.parse(keyStr)
  
  const decrypted = CryptoJS.AES.decrypt(src, key, {
    iv: key,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding
  })
  
  return decrypted.toString(CryptoJS.enc.Utf8)
}