'use client';

import { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    CircularProgress,
    Alert,
    Grid
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const t = useTranslations('Register');
    const apiT = useTranslations('API');
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Usunięcie błędu dla pola po rozpoczęciu edycji
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Funkcja pomocnicza do mapowania kodów błędów
    const getErrorMessage = (errorCode: string) => {
        const errorMap: Record<string, string> = {
            'firstnameRequired': t('firstnameRequired'),
            'lastnameRequired': t('lastnameRequired'),
            'emailInvalid': t('emailInvalid'),
            'emailTaken': t('emailTaken'),
            'phoneNumberRequired': t('phoneNumberRequired'),
            'phoneNumberInvalid': t('phoneNumberInvalid'),
            'passwordMinLength': t('passwordMinLength'),
            'passwordLetterRequired': t('passwordLetterRequired'),
            'passwordNumberRequired': t('passwordNumberRequired'),
            'passwordSpecialCharRequired': t('passwordSpecialCharRequired'),
            'passwordInvalid': t('passwordInvalid'),
            'confirmPasswordRequired': t('confirmPasswordRequired'),
            'usernameTaken': t('usernameTaken')
        };
        return errorMap[errorCode] || t('errorMessage');
    };


    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);
        setFieldErrors({});

        console.table(formData);

        try {
            const response = await fetch(`/${locale}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData),
                cache: 'no-store'
            });


            const result = await response.json();

            if (result?.success) {
                router.push(`/profile`);
                return;
            }

            if (result?.errors) {
                const newFieldErrors: Record<string, string> = {};

                // Przetwarzanie błędów dla poszczególnych pól
                Object.entries(result.errors).forEach(([field, errors]) => {
                    if (Array.isArray(errors) && errors.length > 0) {
                        newFieldErrors[field] = getErrorMessage(errors[0]);
                    }
                });

                if (Object.keys(newFieldErrors).length > 0) {
                    setFieldErrors(newFieldErrors);

                    // Ustawienie ogólnego komunikatu o błędzie
                    const firstError = Object.values(newFieldErrors)[0];
                    if (firstError) {
                        setErrorMessage(firstError);
                    }
                } else {
                    setErrorMessage(t('errorMessage'));
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage(apiT('internalServerError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container
            component="main"
            maxWidth="sm"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '90vh',
                py: 6
            }}
        >
            <Box
                sx={{
                    marginTop: 12,
                    marginBottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        width: '100%',
                        borderRadius: 2
                    }}
                >
                    <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
                        {t('createAccount')}
                    </Typography>

                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSignup} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="firstname"
                                    label={t('firstname')}
                                    name="firstname"
                                    autoComplete="given-name"
                                    autoFocus
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    error={!!fieldErrors.firstname}
                                    helperText={fieldErrors.firstname || ''}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="lastname"
                                    label={t('lastname')}
                                    name="lastname"
                                    autoComplete="family-name"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    error={!!fieldErrors.lastname}
                                    helperText={fieldErrors.lastname || ''}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label={t('emailAddress')}
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!fieldErrors.email}
                            helperText={fieldErrors.email || ''}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="phoneNumber"
                            label={t('phoneNumber')}
                            name="phoneNumber"
                            autoComplete="tel"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            error={!!fieldErrors.phoneNumber}
                            helperText={fieldErrors.phoneNumber || ''}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label={t('password')}
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!fieldErrors.password}
                            helperText={fieldErrors.password || ''}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label={t('confirmPassword')}
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!fieldErrors.confirmPassword}
                            helperText={fieldErrors.confirmPassword || ''}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <CircularProgress size={24} /> : t('signUp')}
                        </Button>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                            <Link href={`/${locale}/login`} passHref>
                                <span className="w-full text-center text-primaryBrown underline hover:no-underline hover:text-black">
                                    {t('alreadyHaveAccount')}
                                </span>
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
