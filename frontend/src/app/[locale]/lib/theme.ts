import { createTheme } from '@mui/material/styles';
import { brown } from '@mui/material/colors';
import { Open_Sans } from 'next/font/google';

export const primaryBrown = brown[400];
export const secondaryBrown = brown[600];

const openSans = Open_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    primary: {
      main: primaryBrown,
    },
    secondary: {
      main: secondaryBrown,
    },
  },
  typography: {
    fontFamily: openSans.style.fontFamily,
  },
});

export default theme;
