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
    background: '#ffffff',
    surface: '#f7f4f1',
    surfaceLight: '#efe9e4',
    border: '#e1d7cf',
    text: '#2a1b14',
    textDark: '#5f524b',
    muted: '#8a7b72',
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
