'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {useRouter, useSearchParams} from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const t = useTranslations('Login');
  const apiT = useTranslations('API');
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Funkcja pomocnicza do mapowania kodów błędów
  const getErrorMessage = (errorCode: string) => {
    const errorMap: Record<string, string> = {
      'invalid_credentials': t('invalidCredentials'),
      'account_blocked': t('accountBlocked'),
      'account_does_not_exists': t('accountDoesNotExists'),
      'too_many_requests': t('tooManyRequests'),
      'login_failed': t('loginFailed'),
      'unexpected_response': t('unexpectedResponse'),
      'invalid_response_format': t('invalidResponseFormat')
    };
    return errorMap[errorCode] || t('errorMessage');
  };

  // Funkcja komunikująca się z API
  const login = async (formData: { email: string, password: string }) => {
    const response = await fetch(`/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    return await response.json();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await login({
        email,
        password
      });

      if (result?.success) {
        // Jeśli mamy parametr redirect, użyj go; w przeciwnym razie przejdź do profilu
        if (redirectUrl) {
          // Sprawdź, czy jest to bezpieczny URL wewnątrz aplikacji
          if (redirectUrl.startsWith('/')) {
            router.push(redirectUrl);
          } else {
            // Jeśli URL nie jest bezpieczny, przejdź do profilu
            router.push(`/${locale}/profile`);
          }
        } else {
          router.push(`/${locale}/profile`);
        }
        return;
      }

      if (result?.errors) {
        // Pobranie pierwszego błędu z listy
        const firstErrorKey = Object.keys(result.errors)[0];
        if (firstErrorKey && result.errors[firstErrorKey]?.[0]) {
          setErrorMessage(getErrorMessage(result.errors[firstErrorKey][0]));
        } else {
          setErrorMessage(t('errorMessage'));
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(apiT('internalServerError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <Container
          component="main"
          maxWidth="sm"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '90vh',
            py: 4
          }}
      >
        <Box
            sx={{
              marginTop: 12,
              marginBottom: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
        >
          <Paper
              elevation={3}
              sx={{
                p: 4,
                width: '100%',
                borderRadius: 2
              }}
          >
            <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
              {t('signIn')}
            </Typography>

            {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Alert>
            )}

            <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label={t('emailAddress')}
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label={t('password')}
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : t('signIn')}
              </Button>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Link href={`/${locale}/register`} passHref>
                  <span className="w-full text-center text-primaryBrown underline hover:no-underline hover:text-black">
                    {t('noAccount')}
                  </span>
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
  );
}