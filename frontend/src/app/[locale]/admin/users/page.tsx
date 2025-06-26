'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {
    Container,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Box,
    Chip,
    IconButton,
    Snackbar,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    FormHelperText
} from '@mui/material';
import {useRouter, useParams} from 'next/navigation';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {User} from "@/app/[locale]/lib/types";

export default function AdminUsersPage() {
    const t = useTranslations('AdminUsers');
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Stany dla dialogów
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [editedUser, setEditedUser] = useState<Partial<User>>({});

    // Stan dla powiadomień
    const [notification, setNotification] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/${locale}/api/admin/users`);
            if (!response.ok) {
                throw new Error(t('errorFetchingUsers'));
            }
            const data = await response.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('unknownError'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
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
                fetchUsers();
            } catch (err) {
                setError(err instanceof Error ? err.message : t('permissionError'));
                setTimeout(() => {
                    router.push(`/${locale}/login`);
                }, 3000);
            }
        };

        checkAdminAccess();
    }, [locale, router, t]);

    const handleDeleteUser = async () => {
        if (!currentUser || !currentUser.email) return;

        try {
            const response = await fetch(`/${locale}/api/admin/users/${currentUser.email}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(t('deleteUserFailed'));
            }

            setUsers(users.filter(user => user.email !== currentUser.email));
            setNotification(t('userDeleted'));
            setNotificationOpen(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('unknownError'));
        } finally {
            setDeleteDialogOpen(false);
            setCurrentUser(null);
        }
    };

    const handleUpdateUser = async () => {
        if (!currentUser || !currentUser.email || !editedUser) return;

        try {
            const response = await fetch(`/${locale}/api/admin/users/${currentUser.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedUser),
            });

            if (!response.ok) {
                throw new Error(t('updateUserFailed'));
            }

            const updatedUserData = await response.json();

            setUsers(users.map(user =>
                user.email === currentUser.email ? {...user, ...updatedUserData} : user
            ));

            setNotification(t('userUpdated'));
            setNotificationOpen(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('unknownError'));
        } finally {
            setEditDialogOpen(false);
            setCurrentUser(null);
            setEditedUser({});
        }
    };

    const openDeleteDialog = (user: User) => {
        setCurrentUser(user);
        setDeleteDialogOpen(true);
    };

    const openEditDialog = (user: User) => {
        setCurrentUser(user);
        setEditedUser({
            firstname: user.firstname,
            lastname: user.lastname,
            phoneNumber: user.phoneNumber,
            role: user.role, // Dodano rolę do edytowanego użytkownika
        });
        setEditDialogOpen(true);
    };

    const handleEditChange = (field: string, value: string) => {
        setEditedUser(prev => ({...prev, [field]: value}));
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{py: 8}}>
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh'}}>
                    <CircularProgress/>
                    <Typography variant="body1" sx={{ml: 2}}>
                        {t('loading')}
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{py: 8}}>
                <Alert severity="error" sx={{mb: 4}}>
                    {error}
                </Alert>
            </Container>
        );
    }

    if (!isAuthorized) {
        return (
            <Container maxWidth="lg" sx={{py: 8}}>
                <Alert severity="warning" sx={{mb: 4}}>
                    {t('unauthorized')}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{py: 8}}>
            <Box sx={{display: 'flex', alignItems: 'center', mb: 4}}>
                <IconButton onClick={() => router.push(`/${locale}/admin`)} sx={{mr: 2}}>
                    <ArrowBackIcon/>
                </IconButton>
                <Typography variant="h4" component="h1">
                    {t('title')}
                </Typography>
            </Box>

            <Paper elevation={3} sx={{p: 3, mb: 4}}>
                {users.length === 0 ? (
                    <Typography align="center" sx={{py: 4}}>
                        {t('noUsers')}
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('email')}</TableCell>
                                    <TableCell>{t('name')}</TableCell>
                                    <TableCell>{t('phoneNumber')}</TableCell>
                                    <TableCell>{t('role')}</TableCell>
                                    <TableCell align="right">{t('actions')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.email}>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{`${user.firstname} ${user.lastname}`}</TableCell>
                                        <TableCell>{user.phoneNumber}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role}
                                                color={user.role === 'ADMIN' ? 'primary' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() => openEditDialog(user)}
                                                aria-label={t('editUser')}
                                            >
                                                <EditIcon/>
                                            </IconButton>
                                            <IconButton
                                                onClick={() => openDeleteDialog(user)}
                                                aria-label={t('deleteUser')}
                                                color="error"
                                                disabled={user.role === 'ADMIN'}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Dialog usuwania użytkownika */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>{t('confirmDelete')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('deleteConfirmationText', {
                            email: currentUser?.email || '',
                            name: `${currentUser?.firstname || ''} ${currentUser?.lastname || ''}`
                        })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleDeleteUser} color="error" autoFocus>
                        {t('delete')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog edycji użytkownika */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>{t('editUser')}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: 2}}>
                        <TextField
                            label={t('firstName')}
                            value={editedUser.firstname || ''}
                            onChange={(e) => handleEditChange('firstname', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label={t('lastName')}
                            value={editedUser.lastname || ''}
                            onChange={(e) => handleEditChange('lastname', e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label={t('phoneNumber')}
                            value={editedUser.phoneNumber || ''}
                            onChange={(e) => handleEditChange('phoneNumber', e.target.value)}
                            fullWidth
                        />
                        {/* Dodane pole wyboru roli */}
                        <FormControl fullWidth>
                            <InputLabel id="role-select-label">{t('role')}</InputLabel>
                            <Select
                                labelId="role-select-label"
                                value={editedUser.role || ''}
                                label={t('role')}
                                onChange={(e) => handleEditChange('role', e.target.value)}
                            >
                                <MenuItem value="USER">USER</MenuItem>
                                <MenuItem value="ADMIN">ADMIN</MenuItem>
                            </Select>
                            <FormHelperText>{t('roleHelperText')}</FormHelperText>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleUpdateUser} color="primary">
                        {t('save')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Powiadomienie */}
            <Snackbar
                open={notificationOpen}
                autoHideDuration={5000}
                onClose={() => setNotificationOpen(false)}
                message={notification}
            />
        </Container>
    );
}