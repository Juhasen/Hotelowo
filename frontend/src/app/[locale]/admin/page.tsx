'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    Container,
    Box,
    Typography,
    Paper,
    Button,
    Grid,
    CircularProgress,
    Alert
} from '@mui/material';
import { useParams, useRouter } from "next/navigation";
import HotelIcon from '@mui/icons-material/Hotel';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import PeopleIcon from '@mui/icons-material/People';

export default function AdminPage() {
    const t = useTranslations('Admin');
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                setIsLoading(true);

                const guardResponse = await fetch(`/${locale}/api/auth/guard`);
                if (!guardResponse.ok) {
                    router.push(`/login`);
                    return;
                }

                const response = await fetch(`/${locale}/api/user/me`);
                if (!response.ok) {
                    throw new Error(t('errorFetchingUser'));
                }

                const userData = await response.json();
                if (userData.role !== 'ADMIN') {
                    setError(t('unauthorized'));
                    setTimeout(() => {
                        router.push(`/${locale}`);
                    }, 3000);
                    return;
                }

                setIsAuthorized(true);
            } catch (err) {
                setError(err instanceof Error ? err.message : t('permissionError'));
                setTimeout(() => {
                    router.push(`/${locale}/login`);
                }, 3000);
            } finally {
                setIsLoading(false);
            }
        };

        checkAdminAccess();
    }, [locale, router, t]);

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress />
                    <Typography variant="body1" sx={{ ml: 2 }}>
                        {t('loading')}
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 12 }}>
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!isAuthorized) {
        return (
            <Container maxWidth="md" sx={{ py: 12 }}>
                <Alert severity="warning" sx={{ mb: 4 }}>
                    {t('unauthorized')}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 12 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mt: 4 }}>
                <Typography variant="h4" component="h1" align="center" sx={{ mb: 4 }}>
                    {t('title')}
                </Typography>
                <Typography variant="h6" component="h2" align="center" sx={{ mb: 6, color: 'text.secondary' }}>
                    {t('welcome')}
                </Typography>

                <Grid container spacing={3} justifyContent="center">
                    <Grid size={{xs: 12, md: 4}}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<HotelIcon />}
                            onClick={() => router.push(`/${locale}/admin/hotels`)}
                            sx={{ py: 3, height: '100%'  }}
                        >
                            {t('manageHotels')}
                        </Button>
                    </Grid>

                    <Grid size={{xs: 12, md: 4}}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<RoomPreferencesIcon />}
                            onClick={() => router.push(`/${locale}/admin/amenities`)}
                            sx={{ py: 3, height: '100%'  }}
                        >
                            {t('manageAmenities')}
                        </Button>
                    </Grid>

                    <Grid size={{xs: 12, md: 4}}>
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            startIcon={<PeopleIcon />}
                            onClick={() => router.push(`/${locale}/admin/users`)}
                            sx={{ py: 3, height: '100%' }}
                        >
                            {t('manageUsers')}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
