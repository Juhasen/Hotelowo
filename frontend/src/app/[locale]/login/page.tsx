"use client";

import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Link as MuiLink,
    CircularProgress,
    Alert
} from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function LoginPage() {
    const t = useTranslations('Login');
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Tutaj będzie logika logowania - zastąp odpowiednim API call
            const response = await fetch(`/${locale}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || t('loginFailed'));
            }

            //sprwadź czy w local storage jest PREVIOUS_URL, jeśli tak to przekieruj do tej strony
            const previousUrl = localStorage.getItem('PREVIOUS_URL');
            if (previousUrl) {
                localStorage.removeItem('PREVIOUS_URL');
                router.push(previousUrl);
                return;
            }

            // Po udanym logowaniu przekieruj do strony głównej
            router.push(`/${locale}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('loginFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 12,
                    mb: 8
                }}
            >
                <Typography component="h1" variant="h4" sx={{ mb: 4, color: 'primary.main', fontWeight: 'bold' }}>
                    {t('signIn')}
                </Typography>

                <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2, bgcolor: 'background.paper' }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} noValidate>
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
                            sx={{ mb: 2 }}
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
                            sx={{ mb: 3 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                mb: 3,
                                fontSize: '1rem',
                                position: 'relative'
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : t('signIn')}
                        </Button>

                        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href={`/${locale}/register`} passHref className="text-primaryBrown hover:underline">
                                {t('noAccount')}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}