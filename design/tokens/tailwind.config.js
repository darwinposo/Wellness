/**
 * Reflect Design System — Tailwind / NativeWind Config
 * Generated from design/tokens/tokens.json
 * Semantic token names match Figma Variable names exactly.
 *
 * Usage in NativeWind (React Native):
 *   className="bg-bg-primary text-text-primary"
 *
 * Usage in web prototypes / Storybook:
 *   className="bg-bg-primary text-text-primary"
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        // ─── Primitives ───────────────────────────────────────────
        // Raw color values. Prefer semantic tokens in components.
        primitive: {
          'amber-400':   '#D4724A',
          'amber-300':   '#E89A70',
          'teal-500':    '#4A7D8C',
          'teal-400':    '#6AA8B8',
          'sage-400':    '#7DB87A',
          'coral-400':   '#C4735A',
          'neutral-950': '#1A1A22',
          'neutral-900': '#1A1A28',
          'neutral-800': '#2A2A35',
          'neutral-500': '#6E6E7E',
          'neutral-200': '#E2E2E8',
          'warm-50':     '#FAF8F5',
          'white':       '#FFFFFF',
          'error':       '#D94F4F',
          'success':     '#3D9A5C',
        },

        // ─── Semantic (Light Mode defaults) ───────────────────────
        // These map to CSS custom properties in global.css for dark mode support.
        bg: {
          primary:   'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
        },
        surface: {
          DEFAULT: 'var(--surface-default)',
          overlay: 'var(--surface-overlay)',
        },
        brand: {
          primary:   'var(--brand-primary)',
          secondary: 'var(--brand-secondary)',
        },
        mood: {
          positive: 'var(--mood-positive)',
          negative: 'var(--mood-negative)',
        },
        text: {
          primary: 'var(--text-primary)',
          muted:   'var(--text-muted)',
        },
        border:  { DEFAULT: 'var(--border)' },
        error:   { DEFAULT: 'var(--error)' },
        success: { DEFAULT: 'var(--success)' },
      },

      // ─── Typography ─────────────────────────────────────────────
      fontFamily: {
        sans:    ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif:   ['Lora', 'Georgia', 'serif'],
        journal: ['Lora', 'Georgia', 'serif'],
      },

      fontSize: {
        // Matches Figma text styles exactly
        'display': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'title':   ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body':    ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '1.4', fontWeight: '400' }],
        'journal': ['18px', { lineHeight: '1.8', fontWeight: '400' }],
      },

      // ─── Spacing ────────────────────────────────────────────────
      // Extends default Tailwind scale with named design tokens
      spacing: {
        'card-padding': '16px',
        'screen-edge':  '24px',
      },

      borderRadius: {
        'card': '16px',
      },

      boxShadow: {
        'card': '0 4px 16px rgba(0, 0, 0, 0.10)',
      },
    },
  },

  plugins: [],
};
