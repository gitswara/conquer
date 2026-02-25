export const THEME_STORAGE_KEY = 'examquest_theme';
export const FONT_SIZE_STORAGE_KEY = 'examquest_fontsize';

const BASE_FONT_SIZE_PX = 16;

export const FONT_SIZE_OPTIONS = [
  { id: 'SM', label: 'SM', className: 'font-sm', scale: 0.8 },
  { id: 'MD', label: 'MD', className: 'font-md', scale: 1 },
  { id: 'LG', label: 'LG', className: 'font-lg', scale: 1.2 }
];

export const DEFAULT_THEME_ID = 'purple-night';
export const DEFAULT_FONT_SIZE_ID = 'MD';

export const THEME_OPTIONS = [
  {
    id: 'purple-night',
    name: 'Purple Night',
    background: '#f6f1ff',
    accent: '#6d28d9',
    vars: {
      bgDeep: '#f6f1ff',
      bgCard: '#ffffff',
      bgSoft: '#f8f3ff',
      bgSoftAlt: '#f7f1ff',
      borderDim: '#7c3aed',
      borderBright: '#5b21b6',
      accentPrimary: '#6d28d9',
      accentSecondary: '#7e22ce',
      textPrimary: '#2f114d',
      textDim: '#6f4aa5',
      success: '#4ade80',
      warning: '#facc15',
      danger: '#f87171',
      graphBar: '#6d28d9',
      graphBarToday: '#9333ea',
      bgGlowA: 'rgba(124, 58, 237, 0.14)',
      bgGlowB: 'rgba(147, 51, 234, 0.1)',
      bgGridLine: 'rgba(124, 58, 237, 0.015)',
      inputBorder: '#bca4e8',
      focusRing: 'rgba(124, 58, 237, 0.2)',
      buttonBg: '#efe7ff',
      buttonShadow: '#3b0764',
      buttonActiveBg: '#e9ddff',
      navBg: '#f8f3ff',
      navBorder: '#d6bdf7',
      tableBorder: '#d9c8f3',
      tableHeadBg: '#f5edff',
      tableSubjectBg: '#f6f0ff',
      tableTopicBg: '#fcfaff',
      tableSubtopicBorder: '#eadcfb',
      toolbarBg: '#faf7ff',
      toolbarBorder: '#d9c8f3',
      inlineChipBg: '#f5edff',
      landingGlowA: 'rgba(124, 58, 237, 0.25)',
      landingGlowB: 'rgba(167, 84, 248, 0.2)',
      landingGradStart: '#faf6ff',
      landingGradEnd: '#f4ecff'
    }
  },
  {
    id: 'deep-navy',
    name: 'Deep Navy',
    background: '#edf4ff',
    accent: '#1d4ed8',
    vars: {
      bgDeep: '#edf4ff',
      bgCard: '#ffffff',
      bgSoft: '#f3f8ff',
      bgSoftAlt: '#eef6ff',
      borderDim: '#2563eb',
      borderBright: '#1e40af',
      accentPrimary: '#1d4ed8',
      accentSecondary: '#1e3a8a',
      textPrimary: '#0f2342',
      textDim: '#345382',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#f87171',
      graphBar: '#2563eb',
      graphBarToday: '#1d4ed8',
      bgGlowA: 'rgba(37, 99, 235, 0.14)',
      bgGlowB: 'rgba(30, 64, 175, 0.1)',
      bgGridLine: 'rgba(37, 99, 235, 0.018)',
      inputBorder: '#9fbce8',
      focusRing: 'rgba(37, 99, 235, 0.2)',
      buttonBg: '#e5efff',
      buttonShadow: '#0f2f7e',
      buttonActiveBg: '#d9e8ff',
      navBg: '#f1f7ff',
      navBorder: '#b8cff5',
      tableBorder: '#c8daf6',
      tableHeadBg: '#e8f1ff',
      tableSubjectBg: '#edf4ff',
      tableTopicBg: '#f9fbff',
      tableSubtopicBorder: '#dbe8fb',
      toolbarBg: '#f7fbff',
      toolbarBorder: '#c8daf6',
      inlineChipBg: '#e9f2ff',
      landingGlowA: 'rgba(59, 130, 246, 0.22)',
      landingGlowB: 'rgba(37, 99, 235, 0.15)',
      landingGradStart: '#f5f9ff',
      landingGradEnd: '#eaf2ff'
    }
  },
  {
    id: 'sky-blue',
    name: 'Sky Blue',
    background: '#effafe',
    accent: '#0284c7',
    vars: {
      bgDeep: '#effafe',
      bgCard: '#ffffff',
      bgSoft: '#f4fcff',
      bgSoftAlt: '#eefbff',
      borderDim: '#0ea5e9',
      borderBright: '#0369a1',
      accentPrimary: '#0284c7',
      accentSecondary: '#0f766e',
      textPrimary: '#11374b',
      textDim: '#3d6a82',
      success: '#22c55e',
      warning: '#eab308',
      danger: '#f87171',
      graphBar: '#0ea5e9',
      graphBarToday: '#0284c7',
      bgGlowA: 'rgba(14, 165, 233, 0.14)',
      bgGlowB: 'rgba(6, 182, 212, 0.1)',
      bgGridLine: 'rgba(14, 165, 233, 0.018)',
      inputBorder: '#9dd7ee',
      focusRing: 'rgba(14, 165, 233, 0.2)',
      buttonBg: '#e3f6ff',
      buttonShadow: '#0b5f7f',
      buttonActiveBg: '#d6f0ff',
      navBg: '#effaff',
      navBorder: '#b2e3f8',
      tableBorder: '#cbe9f7',
      tableHeadBg: '#e5f7ff',
      tableSubjectBg: '#ebfaff',
      tableTopicBg: '#f7fdff',
      tableSubtopicBorder: '#d7eef8',
      toolbarBg: '#f5fcff',
      toolbarBorder: '#cbe9f7',
      inlineChipBg: '#e6f7ff',
      landingGlowA: 'rgba(14, 165, 233, 0.2)',
      landingGlowB: 'rgba(6, 182, 212, 0.16)',
      landingGradStart: '#f3fcff',
      landingGradEnd: '#e8f8ff'
    }
  },
  {
    id: 'dark-pink',
    name: 'Dark Pink',
    background: '#fff1f7',
    accent: '#be185d',
    vars: {
      bgDeep: '#fff1f7',
      bgCard: '#ffffff',
      bgSoft: '#fff4f9',
      bgSoftAlt: '#fff0f7',
      borderDim: '#db2777',
      borderBright: '#9d174d',
      accentPrimary: '#be185d',
      accentSecondary: '#9f1239',
      textPrimary: '#4b102e',
      textDim: '#8b3d64',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#f87171',
      graphBar: '#db2777',
      graphBarToday: '#be185d',
      bgGlowA: 'rgba(219, 39, 119, 0.14)',
      bgGlowB: 'rgba(190, 24, 93, 0.1)',
      bgGridLine: 'rgba(219, 39, 119, 0.017)',
      inputBorder: '#efadd1',
      focusRing: 'rgba(219, 39, 119, 0.2)',
      buttonBg: '#ffe7f2',
      buttonShadow: '#831843',
      buttonActiveBg: '#ffd8ea',
      navBg: '#fff3f8',
      navBorder: '#f5bfd8',
      tableBorder: '#f2d1e3',
      tableHeadBg: '#ffeaf4',
      tableSubjectBg: '#fff0f6',
      tableTopicBg: '#fff9fc',
      tableSubtopicBorder: '#f7dbe9',
      toolbarBg: '#fff8fc',
      toolbarBorder: '#f2d1e3',
      inlineChipBg: '#ffeef6',
      landingGlowA: 'rgba(236, 72, 153, 0.2)',
      landingGlowB: 'rgba(190, 24, 93, 0.14)',
      landingGradStart: '#fff6fb',
      landingGradEnd: '#ffeaf5'
    }
  },
  {
    id: 'rose',
    name: 'Rose',
    background: '#fff7f9',
    accent: '#e11d48',
    vars: {
      bgDeep: '#fff7f9',
      bgCard: '#ffffff',
      bgSoft: '#fff9fb',
      bgSoftAlt: '#fff4f7',
      borderDim: '#f43f5e',
      borderBright: '#be123c',
      accentPrimary: '#e11d48',
      accentSecondary: '#c026d3',
      textPrimary: '#4a1c2f',
      textDim: '#8a4961',
      success: '#22c55e',
      warning: '#f59e0b',
      danger: '#f87171',
      graphBar: '#f43f5e',
      graphBarToday: '#e11d48',
      bgGlowA: 'rgba(244, 63, 94, 0.12)',
      bgGlowB: 'rgba(225, 29, 72, 0.1)',
      bgGridLine: 'rgba(244, 63, 94, 0.014)',
      inputBorder: '#f1bfca',
      focusRing: 'rgba(244, 63, 94, 0.2)',
      buttonBg: '#ffe8ef',
      buttonShadow: '#9f1239',
      buttonActiveBg: '#ffdbe6',
      navBg: '#fff6f9',
      navBorder: '#f4c9d5',
      tableBorder: '#f5d6df',
      tableHeadBg: '#fff0f4',
      tableSubjectBg: '#fff5f8',
      tableTopicBg: '#fffbfd',
      tableSubtopicBorder: '#f8e2e8',
      toolbarBg: '#fffafd',
      toolbarBorder: '#f5d6df',
      inlineChipBg: '#fff1f5',
      landingGlowA: 'rgba(251, 113, 133, 0.22)',
      landingGlowB: 'rgba(225, 29, 72, 0.14)',
      landingGradStart: '#fff9fb',
      landingGradEnd: '#ffeff4'
    }
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    background: '#f2fbf4',
    accent: '#15803d',
    vars: {
      bgDeep: '#f2fbf4',
      bgCard: '#ffffff',
      bgSoft: '#f5fdf7',
      bgSoftAlt: '#eefaf1',
      borderDim: '#22c55e',
      borderBright: '#166534',
      accentPrimary: '#15803d',
      accentSecondary: '#0f766e',
      textPrimary: '#193b28',
      textDim: '#477257',
      success: '#22c55e',
      warning: '#eab308',
      danger: '#f87171',
      graphBar: '#22c55e',
      graphBarToday: '#16a34a',
      bgGlowA: 'rgba(34, 197, 94, 0.12)',
      bgGlowB: 'rgba(21, 128, 61, 0.1)',
      bgGridLine: 'rgba(34, 197, 94, 0.016)',
      inputBorder: '#b8e7c8',
      focusRing: 'rgba(34, 197, 94, 0.22)',
      buttonBg: '#e8f9ec',
      buttonShadow: '#14532d',
      buttonActiveBg: '#dbf5e2',
      navBg: '#f2fbf4',
      navBorder: '#c4eacd',
      tableBorder: '#d2edd8',
      tableHeadBg: '#eaf9ee',
      tableSubjectBg: '#effaf2',
      tableTopicBg: '#f9fefa',
      tableSubtopicBorder: '#def0e2',
      toolbarBg: '#f8fdf9',
      toolbarBorder: '#d2edd8',
      inlineChipBg: '#ecf8ef',
      landingGlowA: 'rgba(34, 197, 94, 0.19)',
      landingGlowB: 'rgba(20, 83, 45, 0.12)',
      landingGradStart: '#f7fdf8',
      landingGradEnd: '#ecf8ee'
    }
  },
  {
    id: 'midnight-gold',
    name: 'Midnight Gold',
    background: '#fff8eb',
    accent: '#a16207',
    vars: {
      bgDeep: '#fff8eb',
      bgCard: '#ffffff',
      bgSoft: '#fffaf1',
      bgSoftAlt: '#fff6e8',
      borderDim: '#d97706',
      borderBright: '#92400e',
      accentPrimary: '#a16207',
      accentSecondary: '#b45309',
      textPrimary: '#4a2d0b',
      textDim: '#8a6838',
      success: '#22c55e',
      warning: '#facc15',
      danger: '#f87171',
      graphBar: '#d97706',
      graphBarToday: '#b45309',
      bgGlowA: 'rgba(217, 119, 6, 0.14)',
      bgGlowB: 'rgba(161, 98, 7, 0.1)',
      bgGridLine: 'rgba(217, 119, 6, 0.016)',
      inputBorder: '#ebd1a4',
      focusRing: 'rgba(217, 119, 6, 0.22)',
      buttonBg: '#fff1d8',
      buttonShadow: '#78350f',
      buttonActiveBg: '#ffe8c2',
      navBg: '#fff9ef',
      navBorder: '#efd6a9',
      tableBorder: '#f0dfba',
      tableHeadBg: '#fff1d7',
      tableSubjectBg: '#fff5e3',
      tableTopicBg: '#fffbf2',
      tableSubtopicBorder: '#f6e7c9',
      toolbarBg: '#fffdf7',
      toolbarBorder: '#f0dfba',
      inlineChipBg: '#fff3dc',
      landingGlowA: 'rgba(245, 158, 11, 0.22)',
      landingGlowB: 'rgba(161, 98, 7, 0.15)',
      landingGradStart: '#fffbf4',
      landingGradEnd: '#fff1d9'
    }
  }
];

function canUseDOM() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function toCSSVarName(name) {
  return name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

export function getThemeById(themeId) {
  return THEME_OPTIONS.find((theme) => theme.id === themeId) || THEME_OPTIONS[0];
}

export function getFontOption(sizeId) {
  return FONT_SIZE_OPTIONS.find((option) => option.id === sizeId) || FONT_SIZE_OPTIONS[1];
}

export function readSavedThemeId() {
  if (!canUseDOM()) return DEFAULT_THEME_ID;
  return window.localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME_ID;
}

export function readSavedFontSizeId() {
  if (!canUseDOM()) return DEFAULT_FONT_SIZE_ID;
  return window.localStorage.getItem(FONT_SIZE_STORAGE_KEY) || DEFAULT_FONT_SIZE_ID;
}

export function applyTheme(themeId, { persist = true } = {}) {
  if (!canUseDOM()) return DEFAULT_THEME_ID;

  const theme = getThemeById(themeId);
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([name, value]) => {
    root.style.setProperty(`--${toCSSVarName(name)}`, value);
  });
  root.dataset.theme = theme.id;

  if (persist) {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme.id);
  }

  return theme.id;
}

export function applyFontSize(sizeId, { persist = true } = {}) {
  if (!canUseDOM()) return DEFAULT_FONT_SIZE_ID;

  const option = getFontOption(sizeId);
  const root = document.documentElement;

  FONT_SIZE_OPTIONS.forEach((entry) => {
    root.classList.remove(entry.className);
  });

  root.classList.add(option.className);
  root.style.setProperty('--base-font-size', `${BASE_FONT_SIZE_PX * option.scale}px`);
  root.dataset.fontsize = option.id;

  if (persist) {
    window.localStorage.setItem(FONT_SIZE_STORAGE_KEY, option.id);
  }

  return option.id;
}

export function initializeAppearance() {
  if (!canUseDOM()) return;
  applyTheme(readSavedThemeId(), { persist: false });
  applyFontSize(readSavedFontSizeId(), { persist: false });
}
