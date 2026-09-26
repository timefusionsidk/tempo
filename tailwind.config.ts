import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F7F5F0',
          dim: '#EFEBE2'
        },
        ink: {
          DEFAULT: '#211F1C',
          soft: '#57534A',
          faint: '#8A8478'
        },
        signal: {
          DEFAULT: '#3B4FE0',
          bright: '#5468FF',
          dim: '#2E3CB0'
        },
        line: {
          DEFAULT: '#E3DFD5',
          dark: '#33312C'
        },
        surface: {
          dark: '#171613',
          darkRaised: '#201F1B'
        }
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      boxShadow: {
        card: '0 1px 2px rgba(33, 31, 28, 0.04), 0 8px 24px -12px rgba(33, 31, 28, 0.12)',
        ring: '0 0 0 1px rgba(59, 79, 224, 0.15)'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(59, 79, 224, 0.35)' },
          '100%': { boxShadow: '0 0 0 14px rgba(59, 79, 224, 0)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out',
        'pulse-ring': 'pulse-ring 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  },
  plugins: []
} satisfies Config
