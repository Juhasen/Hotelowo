'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    Container, Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, Alert, IconButton, Box, Snackbar, Dialog, DialogContent, DialogContentText,
    Pagination, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useRouter } from 'next/navigation';
import {Hotel, HotelPage} from '@/app/[locale]/lib/types';
import Image from 'next/image';
import {DialogActions} from "@mui/material";
import {Button} from "@mui/material";
export default function AdminHotelsPage() {
    const t = useTranslations('AdminHotels');
    const params = useParams();
    const locale = params.locale as string;
    const router = useRouter();
    const [size] = useState<number>(10);
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [hotelToDelete, setHotelToDelete] = useState<Hotel | null>(null);
    const [notification, setNotification] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const openDeleteDialog = (hotel: Hotel) => {
        setHotelToDelete(hotel);
        setDeleteDialogOpen(true);
    };
    
    const fetchHotels = async (pageNumber = 1) => {
        setIsLoading(true);
        const response = await fetch(`/${locale}/api/admin/hotels?page=${pageNumber - 1}&size=${size}`);
        const data: HotelPage = await response.json();
        console.log(data);
        setHotels(Array.isArray(data.content) ? data.content : []);
        setTotalPages(data.page.totalPages || 1);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchHotels(page);
    }, [page]);


    const handleDeleteHotel = async () => {
        if (!hotelToDelete) return;
        try {
            const response = await fetch(`/${locale}/api/admin/hotels/${hotelToDelete.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(t('errorFetchingHotels'));
            // Odśwież listę hoteli po usunięciu
            setHotels(hotels.filter(h => h.id !== hotelToDelete.id));
            setNotification(t('hotelDeleted'));
            setNotificationOpen(true);
        } catch {
            setNotification(t('errorFetchingHotels'));
            setNotificationOpen(true);
        } finally {
            setDeleteDialogOpen(false);
            setHotelToDelete(null);
        }
    };

    const handlePageChange = (_: any, value: number) => {
        setPage(value);
    };

    useEffect(() => {
        fetchHotels();
    }, [locale]);

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ py: 8 }}>
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
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
                {t('title')}
            </Typography>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                {hotels.length === 0 ? (
                    <Typography align="center" sx={{ py: 4 }}>
                        {t('noHotels')}
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>{t('image')}</TableCell>
                                    <TableCell>{t('name')}</TableCell>
                                    <TableCell>{t('rating')}</TableCell>
                                    <TableCell>{t('stars')}</TableCell>
                                    <TableCell align="right">{t('actions')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {hotels.map((hotel) => (
                                    <TableRow key={hotel.id}>
                                        <TableCell>{hotel.id}</TableCell>
                                        <TableCell>
                                            <Image src={hotel.mainImageUrl} alt={hotel.name} width={100} height={50} style={{objectFit: 'cover' }} />
                                        </TableCell>
                                        <TableCell>{hotel.name}</TableCell>
                                        <TableCell>{hotel.rating}</TableCell>
                                        <TableCell>{hotel.stars}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                aria-label={t('editHotel')}
                                                onClick={() => router.push(`/${locale}/admin/hotels/edit/${hotel.id}`)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                aria-label={t('deleteHotel')}
                                                color="error"
                                                onClick={() => openDeleteDialog(hotel)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                {hotels.length > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="secondary"
                        />
                    </Box>
                )}
            </Paper>
            {/* Dialog do kasowania */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>{t('confirmDelete')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('deleteConfirmationText', {
                            name: hotelToDelete?.name || '',
                            email: hotelToDelete?.id || ''
                        })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleDeleteHotel} color="error" autoFocus>
                        {t('delete')}
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={notificationOpen}
                autoHideDuration={5000}
                onClose={() => setNotificationOpen(false)}
                message={notification}
            />
            <Snackbar
                open={notificationOpen}
                autoHideDuration={5000}
                onClose={() => setNotificationOpen(false)}
                message={notification}
            />
        </Container>
    );
}