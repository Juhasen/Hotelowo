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
import LoginRequired from '@/app/[locale]/components/LoginRequired';
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

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

export default function ReservationPreviewPage() {
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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const guardResponse = await fetch('/api/auth/guard');
                setIsAuthenticated(guardResponse.ok);

                if (guardResponse.ok) {
                    fetchReservationDetails();
                } else {
                    setLoading(false);
                }
            } catch (err) {
                setIsAuthenticated(false);
                setLoading(false);
            }
        };

        const fetchReservationDetails = async () => {
            try {
                setLoading(true);

                const reservationUrl = new URL('/api/reservation/preview', window.location.origin);
                reservationUrl.searchParams.append('roomId', roomId || '');
                reservationUrl.searchParams.append('hotelId', hotelId || '');
                reservationUrl.searchParams.append('checkIn', checkIn || '');
                reservationUrl.searchParams.append('checkOut', checkOut || '');

                const response = await fetch(reservationUrl.toString());

                if (!response.ok) {
                    throw new Error(`Błąd pobierania danych: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);
                setReservation(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania danych rezerwacji');
            } finally {
                setLoading(false);
            }
        };

        checkAuthentication();
    }, [roomId, hotelId, checkIn, checkOut]);

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
            const confirmationData = await response.text();

            // Przekierowanie po potwierdzeniu
            router.push(`/${locale}/reservation/confirmation?confirmationCode=${confirmationData}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas potwierdzania rezerwacji');
        }
    };

    if (isAuthenticated === false) {
        return <LoginRequired />;
    }

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
        <Container maxWidth="md" sx={{py: 12}}>
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
                                <Grid container spacing={2}>
                                    {/* Informacje o hotelu - lewa strona */}
                                    <Grid size={{xs:12, sm: 8}}>
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
                                            <Typography variant="subtitle1">
                                                {t('roomType')}: {reservation?.room.number}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {t('capacity')}: {reservation?.room.capacity} {t('people')}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    {/* Obraz hotelu - prawa strona */}
                                    <Grid size={{xs:12, sm: 4}}  sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        {reservation?.hotel.images?.find(img => img.isPrimary)?.filePath ? (
                                            <Box
                                                component="img"
                                                src={reservation.hotel.images.find(img => img.isPrimary)?.filePath}
                                                alt={reservation.hotel.name}
                                                sx={{
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    maxHeight: 420,
                                                    objectFit: 'cover',
                                                    borderRadius: 1
                                                }}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    height: 120,
                                                    bgcolor: 'background.default',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 1
                                                }}
                                            >
                                                <HotelIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                                            </Box>
                                        )}
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Informacje o dacie i gościu - z odstępami i wyrównaną wysokością */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {/* Informacje o dacie */}
                        <Grid size={{xs: 12, md: 6}}>
                            <Card elevation={1} sx={{ height: '100%' }}>
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
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Typography variant="body1">
                                            {t('totalNights')}: <strong>{reservation?.nights}</strong>
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Informacje o gościu */}
                        <Grid size={{xs: 12, md: 6}}>
                            <Card elevation={1} sx={{ height: '100%' }}>
                                <CardContent>
                                    <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                                        <PersonIcon sx={{mr: 2, color: 'primary.main'}}/>
                                        <Typography variant="h6">{t('guestDetails')}</Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {t('fullName')}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            {reservation?.guest.firstname} {reservation?.guest.lastname}
                                        </Typography>

                                        <Typography variant="subtitle2" color="text.secondary">
                                            {t('contact')}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <EmailIcon sx={{ fontSize: '1.1rem', mr: 1, color: 'primary.main' }}/>
                                            <Typography variant="body1">
                                                {reservation?.guest.email}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                            <PhoneIcon sx={{ fontSize: '1.1rem', mr: 1, color: 'primary.main' }}/>
                                            <Typography variant="body1">
                                                {reservation?.guest.phoneNumber}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Informacje o płatności - z odstępem od poprzedniej sekcji */}
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid size={{xs: 12}}>
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
                                            <FormControlLabel value="credit_card" control={<Radio/>}
                                                              label={t('creditCard')}/>
                                            <FormControlLabel value="paypal" control={<Radio/>} label="PayPal"/>
                                            <FormControlLabel value="bank_transfer" control={<Radio/>}
                                                              label={t('bankTransfer')}/>
                                            <FormControlLabel value="cash_on_arrival" control={<Radio/>}
                                                              label={t('cashOnArrival')}/>
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
                    </Grid>
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

