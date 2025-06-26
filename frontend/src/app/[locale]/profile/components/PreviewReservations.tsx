'use client';

import {useTranslations} from 'next-intl';
import {useParams, useRouter} from 'next/navigation';
import {
    Typography,
    Box,
    Card,
    CardContent,
    Stack,
    Chip,
    Paper,
    Divider,
    Grid,
    CardActionArea,
    CardMedia
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HotelIcon from '@mui/icons-material/Hotel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {ReservationOverview} from '@/app/[locale]/lib/types';

interface PreviewReservationsProps {
    reservations: ReservationOverview[];
}

export default function PreviewReservations({reservations}: PreviewReservationsProps) {
    const t = useTranslations('Profile');
    const router = useRouter();

    const getStatusIcon = (status: string) => {
        return status.toLowerCase() === 'cancelled' ? <CancelIcon/> : <CheckCircleIcon/>;
    };

    const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const handleReservationClick = (id: number) => {
        router.push(`/reservation/${id}`);
    };

    if (reservations.length === 0) {
        return (
            <Paper elevation={2} sx={{mt: 4, p: 4, borderRadius: 2}}>
                <Typography variant="h5" gutterBottom>
                    {t('myReservations')}
                </Typography>
                <Divider sx={{mb: 3}}/>
                <Box sx={{textAlign: 'center', py: 4}}>
                    <Typography variant="body1" color="text.secondary">
                        {t('noReservations')}
                    </Typography>
                </Box>
            </Paper>
        );
    }

    return (
        <Paper elevation={2} sx={{mt: 4, p: 4, borderRadius: 2}}>
            <Typography variant="h5" gutterBottom>
                {t('myReservations')}
            </Typography>
            <Divider sx={{mb: 3}}/>

            <Stack spacing={2}>
                {reservations.map((reservation) => (
                    <Card key={reservation.id} sx={{mb: 2}}>
                        <CardActionArea onClick={() => handleReservationClick(reservation.id)}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid size={{xs: 12, sm: 3}}>
                                        {reservation.hotelImageUrl ? (
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={reservation.hotelImageUrl}
                                                alt={reservation.hotelName}
                                                sx={{borderRadius: 1}}
                                            />
                                        ) : (
                                            <Box
                                                sx={{
                                                    height: 140,
                                                    bgcolor: 'background.default',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 1
                                                }}
                                            >
                                                <HotelIcon sx={{fontSize: 40, color: 'text.secondary'}}/>
                                            </Box>
                                        )}
                                    </Grid>
                                    <Grid size={{xs: 12, sm: 9}}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'start'
                                        }}>
                                            <Typography variant="h6" component="div">
                                                {reservation.hotelName}
                                            </Typography>
                                            <Chip
                                                icon={getStatusIcon(reservation.status)}
                                                label={t(reservation.status.toLowerCase())}
                                                color={getStatusColor(reservation.status)}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {reservation.roomType}
                                        </Typography>

                                        <Box sx={{display: 'flex', alignItems: 'center', mt: 1}}>
                                            <CalendarTodayIcon sx={{fontSize: '1rem', mr: 1, color: 'primary.main'}}/>
                                            <Typography variant="body2">
                                                {reservation.checkInDate.split('T')[0]} - {reservation.checkOutDate.split('T')[0]}
                                            </Typography>
                                        </Box>

                                        <Box sx={{mt: 2, display: 'flex', justifyContent: 'flex-end'}}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {reservation.totalPrice.toFixed(2)} PLN
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Stack>
        </Paper>
    );
}