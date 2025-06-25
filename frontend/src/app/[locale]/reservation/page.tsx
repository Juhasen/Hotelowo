'use client';

import {useEffect, useState} from 'react';
import {useSearchParams, useParams, useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Divider,
    CircularProgress,
    Alert,
    Button,
    Card,
    CardContent,
    Chip,
    RadioGroup,
    FormControlLabel,
    Radio
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HotelIcon from '@mui/icons-material/Hotel';
import PersonIcon from '@mui/icons-material/Person';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {Guest, HotelDetail, Room} from "@/app/[locale]/lib/types";

interface ReservationDetails {
    status: string;
    hotel: HotelDetail;
    room: Room;
    guest: Guest;
    checkInDate: string;
    checkOutDate: string;
    nights: number;
    totalPrice: number;
    paymentMethod: string;
    createdAt: string;
}

export default function ReservationPage() {
    const t = useTranslations('Reservation');
    const searchParams = useSearchParams();
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;

    // Pobieranie parametrów z URL
    const roomId = searchParams.get('roomId');
    const hotelId = searchParams.get('hotelId');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    const [reservation, setReservation] = useState<ReservationDetails | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReservationDetails = async () => {
            try {
                setLoading(true);

                // Sprawdzamy najpierw sesję
                const guardResponse = await fetch('/api/auth/guard');
                if (!guardResponse.ok) {
                    router.push(`/${locale}/login`);
                    return;
                }

                const reservationUrl = new URL('/api/reservation', window.location.origin);
                reservationUrl.searchParams.append('roomId', roomId || '');
                reservationUrl.searchParams.append('hotelId', hotelId || '');
                reservationUrl.searchParams.append('checkIn', checkIn || '');
                reservationUrl.searchParams.append('checkOut', checkOut || '');

                const response = await fetch(reservationUrl.toString());

                if (!response.ok) {
                    throw new Error(`Błąd pobierania danych: ${response.status}`);
                }

                const data = await response.json();
                setReservation(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania danych rezerwacji');
            } finally {
                setLoading(false);
            }
        };

        fetchReservationDetails();
    }, [roomId, hotelId, checkIn, checkOut, router, locale]);

    const handleConfirmation = async () => {
        try {
            // Tutaj logika potwierdzenia rezerwacji
            const response = await fetch('/api/reservation/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    roomId,
                    hotelId,
                    checkIn,
                    checkOut,
                    paymentMethod
                })
            });

            if (!response.ok) {
                throw new Error('Błąd podczas potwierdzania rezerwacji');
            }

            // Przekierowanie po potwierdzeniu
            router.push(`/${locale}/reservation/confirmation`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas potwierdzania rezerwacji');
        }
    };

    if (loading) {
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
            <Container maxWidth="md" sx={{py: 8}}>
                <Alert severity="error" sx={{mb: 4}}>
                    {error}
                </Alert>
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}>
                    <Button variant="contained" onClick={() => router.back()}>
                        {t('goBack')}
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{py: 8}}>
            <Paper elevation={3} sx={{p: 4, borderRadius: 2}}>
                <Box sx={{display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between'}}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {t('reservationSummary')}
                    </Typography>
                    <Chip
                        label={t('pending')}
                        color="primary"
                        icon={<CheckCircleIcon/>}
                        variant="outlined"
                    />
                </Box>

                <Divider sx={{mb: 4}}/>

                <Grid container spacing={4}>
                    {/* Informacje o hotelu */}
                    <Grid size={{xs: 12}}>
                        <Card elevation={1}>
                            <CardContent>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                    <HotelIcon sx={{mr: 2, color: 'primary.main'}}/>
                                    <Typography variant="h6">{reservation?.hotel.name}</Typography>
                                </Box>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                    <LocationOnIcon sx={{mr: 1, fontSize: '1rem', color: 'text.secondary'}}/>
                                    <Typography variant="body2" color="text.secondary">
                                        {reservation?.hotel.address.street}, {reservation?.hotel.address.city}
                                    </Typography>
                                </Box>
                                <Box sx={{mt: 2}}>
                                    <Typography
                                        variant="subtitle1">{t('roomType')}: {reservation?.room.number}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('capacity')}: {reservation?.room.capacity} {t('people')}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Informacje o dacie */}
                    <Grid size={{xs: 12, md: 6}}>
                        <Card elevation={1}>
                            <CardContent>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                    <CalendarTodayIcon sx={{mr: 2, color: 'primary.main'}}/>
                                    <Typography variant="h6">{t('stayDetails')}</Typography>
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid size={{xs: 6}}>
                                        <Typography variant="subtitle2"
                                                    color="text.secondary">{t('checkIn')}</Typography>
                                        <Typography variant="body1">{reservation?.checkInDate}</Typography>
                                    </Grid>
                                    <Grid size={{xs: 6}}>
                                        <Typography variant="subtitle2"
                                                    color="text.secondary">{t('checkOut')}</Typography>
                                        <Typography variant="body1">{reservation?.checkOutDate}</Typography>
                                    </Grid>
                                </Grid>

                                <Box sx={{
                                    mt: 2,
                                    p: 1,
                                    bgcolor: 'background.default',
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <Typography variant="body2">
                                        {t('totalNights')}: <strong>{reservation?.nights}</strong>
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* Informacje o gościu */}
                    <Grid size={{xs: 12, md: 6}}>
                        <Card elevation={1}>
                            <CardContent>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                    <PersonIcon sx={{mr: 2, color: 'primary.main'}}/>
                                    <Typography variant="h6">{t('guestDetails')}</Typography>
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid size={{xs: 12, md: 6}}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {t('fullName')}
                                        </Typography>
                                        <Typography variant="body1">
                                            {reservation?.guest.firstname} {reservation?.guest.lastname}
                                        </Typography>
                                    </Grid>

                                    <Grid size={{xs: 12, md: 6}}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {t('contact')}
                                        </Typography>
                                        <Typography variant="body1">
                                            {reservation?.guest.email}
                                        </Typography>
                                        <Typography variant="body1">
                                            {reservation?.guest.phoneNumber}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                    {/* Informacje o płatności */}
                    <Grid size={{xs: 12, md: 6}}>
                        <Card elevation={1}>
                            <CardContent>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                    <PaymentIcon sx={{mr: 2, color: 'primary.main'}}/>
                                    <Typography variant="h6">{t('paymentDetails')}</Typography>
                                </Box>

                                <Box sx={{mb: 1}}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        {t('pricePerNight')}
                                    </Typography>
                                    <Typography variant="body1">
                                        {reservation?.room.pricePerNight.toFixed(2)} PLN
                                    </Typography>
                                </Box>

                                {/* Dodaj wybór metody płatności */}
                                <Box sx={{mb: 2, mt: 2}}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{mb: 1}}>
                                        {t('paymentMethod')}
                                    </Typography>
                                    <RadioGroup
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                        <FormControlLabel value="credit_card" control={<Radio />} label={t('creditCard')} />
                                        <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                                        <FormControlLabel value="bank_transfer" control={<Radio />} label={t('bankTransfer')} />
                                        <FormControlLabel value="cash_on_arrival" control={<Radio />} label={t('cashOnArrival')} />
                                    </RadioGroup>
                                </Box>

                                <Divider sx={{my: 2}}/>

                                <Box sx={{p: 1, bgcolor: 'primary.light', borderRadius: 1}}>
                                    <Typography variant="subtitle1" fontWeight="bold" color="primary.contrastText">
                                        {t('totalPrice')}: {reservation?.totalPrice.toFixed(2)} PLN
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                <Box sx={{mt: 4, display: 'flex', justifyContent: 'space-between'}}>
                    <Button variant="outlined" onClick={() => router.back()}>
                        {t('back')}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleConfirmation}
                    >
                        {t('confirmReservation')}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}