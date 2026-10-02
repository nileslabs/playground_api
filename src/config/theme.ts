/**
 * Centralized Theme & Brand Color Tokens
 * Single source of truth for brand colors, SVG vectors, Next.js ImageResponse icons, and inline styles.
 */
export const themeColors = {
  brand: {
    primary: '#6366f1',      // Electric Indigo 500 (Main brand accent)
    hover: '#4f46e5',        // Indigo 600
    accent: '#818cf8',       // Indigo 400
    light: '#a5b4fc',        // Indigo 300
    dark: '#3730a3',         // Indigo 800
    deepDark: '#1e1b4b',     // Indigo 950
    darkest: '#0f0e26',      // Obsidian Indigo
    emerald: '#10b981',      // Emerald 500
    teal: '#0d9488',         // Teal 600
    cyan: '#06b6d4',         // Cyan 500
    sky: '#38bdf8',          // Sky 400
    amber: '#f59e0b',        // Amber 500
    rose: '#f43f5e',         // Rose 500
  },
  dark: {
    bgPrimary: '#08090c',
    bgSecondary: '#0e1017',
    bgTertiary: '#151822',
    bgObsidian: '#08090c',
    bgObsidianGlow: '#151822',
    textPrimary: '#f9fafb',
    textSecondary: '#9ca3af',
    textMuted: '#64748b',
    border: 'rgba(255, 255, 255, 0.10)',
    borderHover: 'rgba(255, 255, 255, 0.18)',
    cardBg: '#0e1017',
    codeBg: '#07080b',
  },
  light: {
    bgPrimary: '#ffffff',
    bgSecondary: '#f8fafc',
    bgTertiary: '#f1f5f9',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    border: '#e2e8f0',
    borderHover: '#cbd5e1',
    cardBg: '#ffffff',
    codeBg: '#0b0f19',
  },
  methods: {
    get: '#10b981',
    post: '#6366f1',
    put: '#f59e0b',
    patch: '#a855f7',
    delete: '#f43f5e',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#f43f5e',
    info: '#0ea5e9',
  },
} as const;

export default themeColors;
