'use client';

import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

export default function LoginRequired() {
  const t = useTranslations('Auth');
  const params = useParams();
  const locale = params.locale as string;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Buduj URLSearchParams ze wszystkich parametrów
  const queryParams = new URLSearchParams();
  searchParams.forEach((value, key) => {
    queryParams.append(key, value);
  });

  // Dodaj również aktualną ścieżkę jako parametr przekierowania
  const redirectUrl = `${pathname}${queryParams.size > 0 ? '?' + queryParams.toString() : ''}`;

  // Stwórz URL do logowania z parametrem przekierowania
  const loginUrl = `/${locale}/login?redirect=${encodeURIComponent(redirectUrl)}`;

  return (
    <Container maxWidth="sm" sx={{ py: 12 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('loginRequired')}
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="body1" paragraph>
            {t('loginToViewMessage')}
          </Typography>
        </Box>

        <Link href={loginUrl} passHref style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary" size="large" fullWidth>
            {t('goToLogin')}
          </Button>
        </Link>
      </Paper>
    </Container>
  );
}
