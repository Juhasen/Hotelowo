'use client';
import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Box,
    CircularProgress,
    Link as MuiLink,
    InputAdornment,
    IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { signup } from "@/app/[locale]/actions/auth";
import { ErrorPopup } from "@/app/[locale]/components/ErrorPopup";
import {getLocale} from "next-intl/server";

export default function RegisterPage() {
    const t = useTranslations('RegisterPage');
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;

    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>({});

    // Sprawdzanie, czy użytkownik jest już zalogowany
    useEffect(() => {
        const locale = getLocale();

        fetch(`/${locale}/api/me`)
            .then(response => {
                if (response.ok) {
                    // Użytkownik jest zalogowany, przekieruj na stronę profilu
                    router.replace('/profile');
                }
            })
            .catch(error => {
                console.error('Błąd podczas sprawdzania stanu logowania:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);
        setEmailError(null);
        setPasswordMismatch(false);
        setFieldErrors({});

        if (password !== confirmPassword) {
            setPasswordMismatch(true);
            setErrorMessage(t('passwordMismatch'));
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('firstname', name);
        formData.append('lastname', lastname);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);

        try {
            const result = await signup(formData);

            if (result?.errors) {
                setFieldErrors(result.errors);
                let firstErrorKey = null;
                if (result.errors.email && result.errors.email.length > 0) {
                    setEmailError(t(result.errors.email[0]));
                    firstErrorKey = result.errors.email[0];
                } else if (result.errors.password && result.errors.password.length > 0) {
                    firstErrorKey = result.errors.password[0];
                } else if (result.errors.confirmPassword && result.errors.confirmPassword.length > 0) {
                    firstErrorKey = result.errors.confirmPassword[0];
                } else if (Object.values(result.errors).flat().length > 0) {
                    firstErrorKey = Object.values(result.errors).flat()[0];
                }
                if (firstErrorKey) {
                    setErrorMessage(t(firstErrorKey));
                }
            } else {
                router.push(`/${locale}/login?registered=true`);
            }
        } catch {
            setErrorMessage(t('registerFailed'));
        } finally {
            setLoading(false);
        }
    };

    const handleCloseError = () => {
        setErrorMessage(null);
    };

    if (isLoading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to bottom, #8d6e63, #a1887f)'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            background: 'linear-gradient(to bottom, #8d6e63, #a1887f)'
        }}>
            {errorMessage && (
                <ErrorPopup
                    message={errorMessage}
                    onCloseAction={handleCloseError}
                    autoCloseTime={6000}
                />
            )}

            <Container maxWidth="md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper elevation={6} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <motion.div
                                initial={{ opacity: 0, y: -40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold', color: '#795548' }}>
                                    {t('title')}
                                </Typography>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <Typography variant="h6" color="text.secondary">
                                    {t('welcomeMessage')}
                                </Typography>
                            </motion.div>
                        </Box>

                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name"
                                    label={t('nameLabel')}
                                    name="name"
                                    autoComplete="given-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    error={!!fieldErrors.firstname}
                                    helperText={fieldErrors.firstname && t(fieldErrors.firstname[0])}
                                />

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="lastname"
                                    label={t('surnameLabel')}
                                    name="lastname"
                                    autoComplete="family-name"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    error={!!fieldErrors.lastname}
                                    helperText={fieldErrors.lastname && t(fieldErrors.lastname[0])}
                                />
                            </Box>

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setEmailError(null);
                                }}
                                error={!!(emailError || fieldErrors.email)}
                                helperText={(emailError || (fieldErrors.email && t(fieldErrors.email[0])))}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label={t('passwordLabel')}
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordMismatch(false);
                                }}
                                error={!!(passwordMismatch || fieldErrors.password)}
                                helperText={fieldErrors.password && t(fieldErrors.password[0])}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                aria-label="toggle password visibility"
                                            >
                                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label={t('confirmPasswordLabel')}
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setPasswordMismatch(false);
                                }}
                                error={!!(passwordMismatch || fieldErrors.confirmPassword)}
                                helperText={fieldErrors.confirmPassword && t(fieldErrors.confirmPassword[0])}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                                aria-label="toggle confirm password visibility"
                                            >
                                                {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            {passwordMismatch && (
                                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                    {t('passwordMismatch')}
                                </Typography>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    mt: 3,
                                    mb: 3,
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    backgroundColor: '#795548',
                                    '&:hover': { backgroundColor: '#6d4c41' }
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : t('registerButton')}
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    {t('alreadyHaveAccount')}{' '}
                                    <Link href={`/${locale}/login`} style={{ textDecoration: 'none' }}>
                                        <MuiLink component="span" sx={{ color: '#795548', fontWeight: 600 }}>
                                            {t('loginButton')}
                                        </MuiLink>
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
}