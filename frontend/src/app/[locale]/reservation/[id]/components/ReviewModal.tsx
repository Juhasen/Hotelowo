'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
    Modal,
    Box,
    Typography,
    Rating,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Stack,
    IconButton, Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ReviewModalProps {
    open: boolean;
    onClose: () => void;
    hotelName: string;
    reservationId: number;
}

export default function ReviewModal({ open, onClose, hotelName , reservationId}: ReviewModalProps) {
    const t = useTranslations('Review');
    const tApi = useTranslations('API');

    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'en';

    // Resetowanie stanu po zamknięciu
    useEffect(() => {
        if (!open) {
            setRating(null);
            setComment('');
            setError(null);
            setSuccess(false);
        }
    }, [open]);

    const handleSubmit = async () => {
        try {
            if (!rating) {
                setError(t('ratingRequired'));
                return;
            }

            setLoading(true);
            setError(null);

            const response = await fetch(`/${locale}/api/review/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reservationId,
                    rating,
                    comment
                }),
            });

            if (!response.ok) {
                if (response.status === 409) {
                    setError(tApi('reviewAlreadyExists'));
                    return;
                }
                throw new Error(await response.text());
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000); // Zamknięcie modalu po 2 sekundach od sukcesu

        } catch {
            setError(t('errorSubmitting'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={loading ? undefined : onClose}
            aria-labelledby="review-modal-title"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: 700 },
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: 2,
                p: 4,
                maxHeight: '90vh',
                overflow: 'auto'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" color="primary" id="review-modal-title" component="h2">
                        {t('leaveReview')} <span className="font-bold">{hotelName}</span>
                    </Typography>
                    <IconButton onClick={onClose} disabled={loading}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success ? (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {t('reviewSubmitted')}
                    </Alert>
                ) : (
                    <Stack spacing={3}>
                        <Box>
                            <Typography component="legend" color="primary" gutterBottom>
                                {t('rating')} *
                            </Typography>
                            <Rating
                                size="large"
                                value={rating}
                                onChange={(_, newValue) => setRating(newValue)}
                                disabled={loading}
                            />
                        </Box>

                        <TextField
                            label={t('comment')}
                            multiline
                            rows={4}
                            fullWidth
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={loading}
                            placeholder={t('commentPlaceholder')}
                        />

                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading || success}
                            startIcon={loading && <CircularProgress size={20} color="inherit" />}
                        >
                            {loading ? t('submitting') : t('submitReview')}
                        </Button>
                    </Stack>
                )}
            </Box>
        </Modal>
    );
}