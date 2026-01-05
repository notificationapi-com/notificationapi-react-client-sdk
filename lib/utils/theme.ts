import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';

export type NotificationAPIThemeMode = 'light' | 'dark';

export type NotificationAPIThemeColors = {
  background?: string;
  paper?: string;
  text?: string;
  textSecondary?: string;
  border?: string;
  icon?: string;
  divider?: string;
};

export type NotificationAPITheme =
  | NotificationAPIThemeMode
  | {
      mode?: NotificationAPIThemeMode;
      colors?: NotificationAPIThemeColors;
    }
  | Theme;

const defaultLightColors: Required<NotificationAPIThemeColors> = {
  background: '#ffffff',
  paper: '#ffffff',
  text: '#000000',
  textSecondary: '#666666',
  border: '#dcdcdc',
  icon: '#000000',
  divider: '#e0e0e0'
};

const defaultDarkColors: Required<NotificationAPIThemeColors> = {
  background: '#1e1e1e',
  paper: '#2d2d2d',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  border: '#404040',
  icon: '#ffffff',
  divider: '#404040'
};

export function createNotificationAPITheme(theme: NotificationAPITheme): Theme {
  // If it's already a MUI Theme, return it
  if (theme && typeof theme === 'object' && 'palette' in theme) {
    return theme as Theme;
  }

  // Determine mode and colors
  let mode: NotificationAPIThemeMode = 'light';
  let colors: NotificationAPIThemeColors = {};

  if (theme === 'dark' || theme === 'light') {
    mode = theme;
  } else if (theme && typeof theme === 'object') {
    mode = theme.mode || 'light';
    colors = theme.colors || {};
  }

  // Merge with defaults
  const defaultColors =
    mode === 'dark' ? defaultDarkColors : defaultLightColors;
  const finalColors = { ...defaultColors, ...colors };

  // Create MUI theme
  const muiThemeOptions: ThemeOptions = {
    palette: {
      mode,
      background: {
        default: finalColors.background,
        paper: finalColors.paper
      },
      text: {
        primary: finalColors.text,
        secondary: finalColors.textSecondary
      },
      divider: finalColors.divider
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: finalColors.paper,
            color: finalColors.text
          }
        }
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundColor: finalColors.paper,
            color: finalColors.text
          }
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: finalColors.paper,
            color: finalColors.text
          }
        }
      },
      MuiList: {
        styleOverrides: {
          root: {
            backgroundColor: finalColors.paper,
            color: finalColors.text
          }
        }
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            backgroundColor: finalColors.paper,
            color: finalColors.text
          }
        }
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: finalColors.divider
          }
        }
      }
    }
  };

  return createTheme(muiThemeOptions);
}

// Export theme colors for easy access
export function getThemeColors(
  theme: Theme
): Required<NotificationAPIThemeColors> {
  const mode = theme.palette.mode;
  const defaultColors =
    mode === 'dark' ? defaultDarkColors : defaultLightColors;

  return {
    background: theme.palette.background.default || defaultColors.background,
    paper: theme.palette.background.paper || defaultColors.paper,
    text: theme.palette.text.primary || defaultColors.text,
    textSecondary: theme.palette.text.secondary || defaultColors.textSecondary,
    border: defaultColors.border,
    icon: defaultColors.icon,
    divider: theme.palette.divider || defaultColors.divider
  };
}
