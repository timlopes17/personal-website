import { createTheme } from '@mui/material/styles';

// Light theme
const lightTheme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#556cd6', // Example primary color
    },
    secondary: {
      main: '#19857b', // Example secondary color
    },
    error: {
      main: '#ff5252', // Example error color
    },
    warning: {
      main: '#ffb74d', // Example warning color
    },
    info: {
      main: '#33bfff', // Example info color
    },
    success: {
      main: '#4caf50', // Example success color
    },
    background: {
      default: '#f5f5f5', // Example background color
      paper: '#fff',
    },
    text: {
      primary: '#333', // Example primary text color
      secondary: '#555', // Example secondary text color
    },
  },
  // ... other settings specific to the light theme ...
});

// Dark theme
const darkTheme = createTheme({
  palette: {
    type: 'dark',
    tl_skills: {
      main: '#ff003a', // Example primary color
    },
    tl_projects: {
      main: '#FC007B',
    },
    tl_demos: {
      main: '#D722B8', // Example secondary color
    },
    tl_about: {
      main: '#8B56E5', // Example error color
    },
    tl_contact: {
      main: '#0072F8', // Example warning color
    },
  },
  // ... other settings specific to the dark theme ...
});

export { lightTheme, darkTheme };