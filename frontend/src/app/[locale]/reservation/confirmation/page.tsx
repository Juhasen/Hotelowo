'use client';

import { useTranslations } from 'next-intl';
import { Container, Paper, Typography, Box, Button, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import {useParams, useSearchParams} from 'next/navigation';

export default function ConfirmationPage() {
    const t = useTranslations('Reservation');
    const params = useParams();
    const locale = params.locale as string;
    const searchParams = useSearchParams();
    const confirmationCode = searchParams.get('confirmationCode');
    const formattedCode = confirmationCode?.replace(/"/g, '') || '';

    return (
        <Container maxWidth="md" sx={{ py: 12 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
                <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h4" component="h1" gutterBottom>
                        {t('reservationConfirmed')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4, maxWidth: 600 }}>
                        {t('reservationConfirmedMessage')}
                    </Typography>
                </Box>

                <Grid container spacing={3} justifyContent="center" sx={{ mb: 2 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Link href={`/${locale}/profile`} passHref style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                startIcon={<PersonIcon />}
                            >
                                {t('viewMyReservations')}
                            </Button>
                        </Link>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Link href={`/${locale}`} passHref style={{ textDecoration: 'none' }}>
                            <Button
                                variant="outlined"
                                fullWidth
                                size="large"
                                startIcon={<SearchIcon />}
                            >
                                {t('searchMoreHotels')}
                            </Button>
                        </Link>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">
                        {t('reservationConfirmationNumber')}:&nbsp;
                        <Typography component="span" variant="body1" fontWeight="bold">
                            {formattedCode}
                        </Typography>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}