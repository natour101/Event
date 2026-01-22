export const palette = {
  accent: '#f56b1d',
  accentDark: '#d45612',
  dark: {
    background: '#1c120d',
    surface: '#2a1b14',
    surfaceLight: '#35231a',
    border: '#3d2a21',
    text: '#f5ede5',
    textDark: '#d9c7bb',
    muted: '#b9a89b',
  },
  softDark: {
    background: '#221714',
    surface: '#33231c',
    surfaceLight: '#3b281f',
    border: '#4a3227',
    text: '#f7efe8',
    textDark: '#decfc3',
    muted: '#c0aea3',
  },
};

export const buildTheme = mode => {
  const base = mode === 'softDark' ? palette.softDark : palette.dark;
  return {
    ...base,
    accent: palette.accent,
    accentDark: palette.accentDark,
    success: '#3ccf91',
    warning: '#f2a35c',
  };
};
