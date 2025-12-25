/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // 确保扫描所有 vue 文件
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 新中式配色体系
        'freq-bg': '#F7F4ED',      // 鱼肚白 (背景)
        'freq-cyan': '#98B4B1',    // 影青 (主色)
        'freq-ink': '#333333',     // 徽墨 (正文)
        'freq-ink-light': '#666666', // 浅墨 (副文)
        'freq-red': '#C04851',     // 朱砂 (点缀)
      },
      fontFamily: {
        // 优先使用宋体/衬线体营造文艺感
        serif: ['"Noto Serif SC"', '"Songti SC"', 'serif'],
        sans: ['"PingFang SC"', 'sans-serif'],
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite', // 呼吸动画
        'fade-in': 'fadeIn 1s ease-out forwards',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.1)', opacity: '0.4' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}