/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          deep: '#0D3B4E',
          navy: '#0D3B4E',
          'dark-navy': '#0D3B4E',
          teal: '#0A7C8C',
          cyan: '#20B2BF',
          light: '#E6F4F6',
          'soft-white': '#F4F8FA',
          slate: '#6B7280',
        },
        domain: {
          executive: '#0D3B4E',
          operational: '#0A7C8C',
          financial: '#20B2BF',
          customer: '#E6F4F6',
          geographical: '#6B7280',
        },
        semantic: {
          positive: '#20B2BF',
          warning: '#F59E0B',
          negative: '#EF4444',
          info: '#3B82F6',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
        'dark-glass': 'linear-gradient(135deg, rgba(13, 59, 78, 0.6) 0%, rgba(13, 59, 78, 0.9) 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #0D3B4E 0%, #0A7C8C 50%, #20B2BF 100%)',
        'gradient-brand': 'linear-gradient(135deg, #0D3B4E 0%, #0A7C8C 50%, #20B2BF 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(13, 59, 78, 0.15)',
        'glass-lg': '0 16px 40px 0 rgba(13, 59, 78, 0.2)',
        'glow-teal': '0 0 20px rgba(10, 124, 140, 0.5)',
        'glow-cyan': '0 0 25px rgba(32, 178, 191, 0.6)',
        'cyber': '0 0 15px rgba(32, 178, 191, 0.4), inset 0 0 20px rgba(10, 124, 140, 0.2)',
        'sidebar': '4px 0 24px rgba(0, 0, 0, 0.08)',
        'topbar': '0 2px 12px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 3s infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slide-down 0.5s ease-out forwards',
        'fade-in': 'fade-in 1s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'liquid-flow': 'liquid-flow 8s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(40px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'fade-in-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'liquid-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '12px',
        'glass-md': '20px',
      }
    },
  },
  plugins: [],
};
