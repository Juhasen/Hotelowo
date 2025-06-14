'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Typography, Container, Box, Paper, Divider, Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useLocale } from 'use-intl';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import 'dayjs/locale/en';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import SearchBar from '@/app/[locale]/components/SearchBar';

// Włączamy plugin do niestandardowego formatu parsowania
dayjs.extend(customParseFormat);

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const t = useTranslations('SearchResults');
    const tc = useTranslations('countries');
    const locale = useLocale();

    // Ustawienie lokalnego formatowania dat
    useEffect(() => {
        dayjs.locale(locale);
    }, [locale]);

    // Pobieranie parametrów wyszukiwania z URL
    const country = searchParams.get('country');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const capacityStr = searchParams.get('capacity');
    const capacity = capacityStr ? parseInt(capacityStr, 10) : undefined;

    // Formatowanie dat do wyświetlenia z użyciem strict parsing
    const dateFormat = 'DD/MM/YYYY';
    const formattedCheckIn = checkIn ? (dayjs(checkIn, dateFormat, true).isValid() ?
        dayjs(checkIn, dateFormat, true).format(dateFormat) : null) : null;

    const formattedCheckOut = checkOut ? (dayjs(checkOut, dateFormat, true).isValid() ?
        dayjs(checkOut, dateFormat, true).format(dateFormat) : null) : null;

    // Obliczanie liczby dni pobytu tylko gdy obie daty są poprawne
    const stayDuration = formattedCheckIn && formattedCheckOut ?
        dayjs(checkOut, dateFormat, true).diff(dayjs(checkIn, dateFormat, true), 'day') : null;

    return (
        <Container maxWidth="lg" sx={{ pt: 10, pb: 8 }}>
            {/* Pasek wyszukiwania na górze strony wyników z przekazanymi początkowymi wartościami */}
            <Box sx={{ mb: 4 }}>
                <SearchBar
                    initialCountry={country || undefined}
                    initialCheckIn={checkIn || undefined}
                    initialCheckOut={checkOut || undefined}
                    initialCapacity={capacity}
                />
            </Box>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {t('searchParams')}
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {country && (
                        <Chip
                            label={`${t('country')}: ${tc(country)}`}
                            variant="outlined"
                            color="primary"
                        />
                    )}
                    {formattedCheckIn && (
                        <Chip
                            label={`${t('checkIn')}: ${formattedCheckIn}`}
                            variant="outlined"
                            color="primary"
                        />
                    )}
                    {formattedCheckOut && (
                        <Chip
                            label={`${t('checkOut')}: ${formattedCheckOut}`}
                            variant="outlined"
                            color="primary"
                        />
                    )}
                    {capacity && (
                        <Chip
                            label={`${t('guests')}: ${capacity}`}
                            variant="outlined"
                            color="primary"
                        />
                    )}
                    {stayDuration !== null && stayDuration >= 0 && (
                        <Chip
                            label={`${t('stayDuration')}: ${stayDuration} ${stayDuration === 1 ? t('day') : t('days')}`}
                            variant="outlined"
                            color="secondary"
                        />
                    )}
                </Box>
            </Paper>

            <Typography variant="h4" sx={{ mb: 4 }}>
                {t('resultsTitle')}
            </Typography>

            {/* Tutaj będzie lista wyników wyszukiwania hoteli */}
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1">
                    {t('noResults')}
                </Typography>
            </Box>
        </Container>
    );
}

