'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    Container,
    Box,
    Typography,
    Paper,
    Button,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Snackbar,
    Autocomplete
} from '@mui/material';
import { useParams, useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Image from 'next/image';
import { Amenity } from '@/app/[locale]/lib/types';

const AVAILABLE_ICONS = [
    'wifi', 'parking', 'breakfast', 'pool',
    'air-conditioning', 'coffee', 'fitness', 'no-smoking', 'pets', 'sauna'
];

export default function AdminAmenitiesPage() {
    const t = useTranslations('Admin');
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    const [amenities, setAmenities] = useState<Amenity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentAmenity, setCurrentAmenity] = useState<Amenity | null>(null);
    const [newAmenity, setNewAmenity] = useState<Amenity>({ name: '', icon: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                setIsLoading(true);

                const guardResponse = await fetch(`/${locale}/api/auth/guard`);
                if (!guardResponse.ok) {
                    router.push(`/${locale}/login`);
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
                fetchAmenities();
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

    const fetchAmenities = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/${locale}/api/admin/amenities/`);
            if (!response.ok) {
                throw new Error('Błąd podczas pobierania udogodnień');
            }
            const data = await response.json();
            console.log(data);
            setAmenities(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Nieznany błąd');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNew = () => {
        setCurrentAmenity(null);
        setNewAmenity({ name: '', icon: '' });
        setOpenEditDialog(true);
    };

    const handleEdit = (amenity: Amenity) => {
        setCurrentAmenity(amenity);
        setNewAmenity({ ...amenity });
        setOpenEditDialog(true);
    };

    const handleDelete = (amenity: Amenity) => {
        setCurrentAmenity(amenity);
        setOpenDeleteDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleSaveAmenity = async () => {
        try {
            if (newAmenity.name.trim() === '' || newAmenity.icon.trim() === '') {
                setSnackbar({
                    open: true,
                    message: 'Proszę wypełnić wszystkie pola',
                    severity: 'error'
                });
                return;
            }

            const url = currentAmenity ?
                `/api/admin/amenities/${currentAmenity.name}` :
                '/api/admin/amenities';

            const method = currentAmenity ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAmenity),
            });

            if (!response.ok) {
                throw new Error('Błąd podczas zapisywania udogodnienia');
            }

            setSnackbar({
                open: true,
                message: currentAmenity ? 'Udogodnienie zostało zaktualizowane' : 'Udogodnienie zostało dodane',
                severity: 'success'
            });

            setOpenEditDialog(false);
            fetchAmenities();

        } catch (err) {
            setSnackbar({
                open: true,
                message: err instanceof Error ? err.message : 'Nieznany błąd',
                severity: 'error'
            });
        }
    };

    const handleConfirmDelete = async () => {
        if (!currentAmenity) return;

        try {
            const response = await fetch(`/${locale}/api/admin/amenities/${currentAmenity.name}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Błąd podczas usuwania udogodnienia');
            }

            setSnackbar({
                open: true,
                message: 'Udogodnienie zostało usunięte',
                severity: 'success'
            });

            setOpenDeleteDialog(false);
            fetchAmenities();

        } catch (err) {
            setSnackbar({
                open: true,
                message: err instanceof Error ? err.message : 'Nieznany błąd',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

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
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1">
                        Zarządzanie udogodnieniami
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddNew}
                    >
                        Dodaj nowe udogodnienie
                    </Button>
                </Box>

                {amenities.length === 0 ? (
                    <Alert severity="info">Brak udogodnień w systemie. Dodaj pierwsze!</Alert>
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="bg-lightBrown">Ikona</TableCell>
                                    <TableCell className="bg-lightBrown">Nazwa</TableCell>
                                    <TableCell align="right" className="bg-lightBrown">Akcje</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {amenities.map((amenity) => (
                                    <TableRow key={amenity.name}>
                                        <TableCell className="bg-primaryBrown">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Image
                                                    src={`/icons/${amenity.icon}.png`}
                                                    alt={amenity.name}
                                                    width={30}
                                                    height={30}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell>{amenity.name}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEdit(amenity)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(amenity)}
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
            </Paper>

            {/* Dialog edycji/dodawania */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>{currentAmenity ? 'Edytuj udogodnienie' : 'Dodaj nowe udogodnienie'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nazwa"
                        type="text"
                        fullWidth
                        value={newAmenity.name}
                        onChange={(e) => setNewAmenity({ ...newAmenity, name: e.target.value })}
                        disabled={!!currentAmenity}
                    />
                    <Autocomplete
                        options={AVAILABLE_ICONS}
                        value={newAmenity.icon}
                        onChange={(_, newValue) => {
                            setNewAmenity({ ...newAmenity, icon: newValue || '' });
                        }}
                        renderInput={(params) => <TextField {...params} label="Ikona" margin="dense" />}
                        sx={{ mt: 2 }}
                    />
                    {newAmenity.icon && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Image
                                src={`/icons/${newAmenity.icon}.png`}
                                alt={newAmenity.name}
                                width={50}
                                height={50}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Anuluj</Button>
                    <Button onClick={handleSaveAmenity} variant="contained">Zapisz</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog potwierdzenia usunięcia */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Potwierdź usunięcie</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Czy na pewno chcesz usunąć udogodnienie {currentAmenity?.name}?
                        Tej operacji nie można cofnąć.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Anuluj</Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error">
                        Usuń
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar do komunikatów */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity as 'success' | 'error'}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}