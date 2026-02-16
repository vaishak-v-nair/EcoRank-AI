import { createTheme } from '@mantine/core';

export const theme = createTheme({
  fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
  headings: {
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
    fontWeight: '700'
  },
  primaryColor: 'eco',
  colors: {
    eco: [
      '#ebf5ef',
      '#d8e9df',
      '#b2d3be',
      '#89bc9b',
      '#68a77f',
      '#539b6f',
      '#46895f',
      '#35704c',
      '#28593c',
      '#183928'
    ],
    graphite: [
      '#f2f4f6',
      '#e4e8ec',
      '#c9d0d8',
      '#adb8c4',
      '#94a3b3',
      '#8394a7',
      '#74869a',
      '#5f6f82',
      '#4e5b6b',
      '#303843'
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
    },
    Paper: {
      defaultProps: {
        radius: 'lg'
      }
    }
  }
});
