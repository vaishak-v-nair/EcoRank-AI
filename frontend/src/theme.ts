import { createTheme } from '@mantine/core';

export const theme = createTheme({
  fontFamily: 'Manrope, "Segoe UI", sans-serif',
  headings: {
    fontFamily: '"DM Serif Display", Georgia, serif',
    fontWeight: '400'
  },
  primaryColor: 'forest',
  colors: {
    forest: [
      '#e8f7f0',
      '#d4eee1',
      '#a7dcc2',
      '#79caa3',
      '#55bb8a',
      '#3aa974',
      '#2d9a66',
      '#1f7a50',
      '#145b3b',
      '#093c26'
    ],
    copper: [
      '#fff4ea',
      '#fee6d0',
      '#fdcea1',
      '#fcb56f',
      '#fb9f46',
      '#fa912d',
      '#e57e1d',
      '#b46313',
      '#84480d',
      '#542c06'
    ]
  },
  radius: {
    md: '14px',
    lg: '20px'
  },
  defaultRadius: 'md',
  components: {
    Button: {
      defaultProps: {
        radius: 'xl'
      }
    }
  }
});
