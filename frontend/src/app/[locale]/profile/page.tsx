'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {
    Container,
    Box,
    Typography,
    Paper,
    Avatar,
    Grid,
    Divider,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Stack,
    Button
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import {useParams, useRouter} from "next/navigation";

interface UserProfile {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
}

export default function ProfilePage() {
    const t = useTranslations('Profile');
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const locale = params.locale as string;
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push(`/${locale}/login`);
            } else {
                setError('Błąd podczas wylogowywania');
            }
        } catch (err) {
            setError('Wystąpił problem z wylogowaniem');
            console.error('Błąd wylogowania:', err);
        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true);
                // Sprawdź najpierw sesję
                const guardResponse = await fetch('/api/auth/guard');
                if (!guardResponse.ok) {
                    // Przekieruj do logowania z uwzględnieniem locale
                    router.push(`/${locale}/login`);
                    return;
                }

                const response = await fetch('/api/user/me');

                if (!response.ok) {
                    router.push('/login');
                    return;
                }

                const userData = await response.json();
                setUser(userData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania danych profilu');
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{py: 8}}>
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh'}}>
                    <CircularProgress/>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{py: 12}}>
                <Alert severity="error" sx={{mb: 4}}>
                    {error}
                </Alert>
                <Paper sx={{p: 4, borderRadius: 2}}>
                    <Typography variant="h5" sx={{mb: 2}}>
                        {t('profileNotAvailable')}
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{py: 12}}>
            <Paper elevation={3} sx={{p: 4, borderRadius: 2, mt: 4}}>
                <Box sx={{display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'space-between'}}>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Avatar sx={{width: 80, height: 80, bgcolor: 'primary.main', mr: 2}}>
                            {user?.firstname?.[0] || 'U'}
                        </Avatar>
                        <Typography variant="h4" component="h1">
                            {t('myProfile')}
                        </Typography>
                    </Box>

                    {/* Przycisk wylogowania */}
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                    >
                        {t('logout')}
                    </Button>
                </Box>

                <Divider sx={{mb: 4}}/>

                <Grid container spacing={4}>
                    <Grid size={{xs: 12, md: 6}}>
                        <Card elevation={2}>
                            <CardContent>
                                <Stack spacing={3}>
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <PersonIcon sx={{mr: 2, color: 'primary.main'}}/>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                {t('fullName')}
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {user?.firstname} {user?.lastname}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <EmailIcon sx={{mr: 2, color: 'primary.main'}}/>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                {t('email')}
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {user?.email}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <PhoneIcon sx={{mr: 2, color: 'primary.main'}}/>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                {t('phoneNumber')}
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {user?.phoneNumber}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, md: 6}}>
                        <Card elevation={2}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {t('accountDetails')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {t('accountInfo')}
                                </Typography>

                                <Box sx={{mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1, display: 'flex', alignItems: 'center'}}>
                                    <AccountCircleIcon sx={{mr: 2, color: 'primary.main'}}/>
                                    <Typography variant="body1" fontWeight="medium">
                                        {t('memberSince')}: {new Date().toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}