'use client';

import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {
    Typography,
    Container,
    Box,
    Paper,
    Divider,
    Chip,
    Grid,
    Card,
    CardContent,
    Pagination,
    CircularProgress
} from '@mui/material';
import {useTranslations} from 'next-intl';
import {useLocale} from 'use-intl';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import 'dayjs/locale/en';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import SearchBar from '@/app/[locale]/components/SearchBar';
import Image from 'next/image';
import {Hotel, Page} from '@/app/[locale]/lib/types';
import {auto} from "@popperjs/core";


// Włączamy plugin do niestandardowego formatu parsowania
dayjs.extend(customParseFormat);



// Pozostała część kodu
export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const t = useTranslations('SearchResults');
    const tc = useTranslations('countries');
    const locale = useLocale();

    // Stany dla paginacji i danych
    const [page, setPage] = useState<number>(0);
    const [size] = useState<number>(6); // domyślny rozmiar strony
    const [hotelsPage, setHotelsPage] = useState<Page | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    // Funkcja obsługująca zmianę strony
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1); // MUI Pagination używa numerów stron od 1, a API od 0
    };

    const fetchSearchResults = async () => {
        setLoading(true);
        setError(null);

        try {
            // Budowanie URL z parametrami wyszukiwania
            const searchUrl = new URL(`/${locale}/api/hotel/`, window.location.origin);

            // Dodawanie parametrów, jeśli są dostępne
            if (country) searchUrl.searchParams.append('country', country);
            if (checkIn) searchUrl.searchParams.append('checkIn', checkIn);
            if (checkOut) searchUrl.searchParams.append('checkOut', checkOut);
            if (capacity) searchUrl.searchParams.append('capacity', capacity.toString());

            // Dodawanie parametrów paginacji
            searchUrl.searchParams.append('page', page.toString());
            searchUrl.searchParams.append('size', size.toString());

            console.log('Fetching hotel from:', searchUrl.toString());

            const response = await fetch(searchUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received hotel data:', data);

            // Sprawdź czy dane są tablicą (bez paginacji) i przekształć je do formatu PageResponse
            if (Array.isArray(data)) {
                const totalItems = data.length;
                const totalPages = Math.ceil(totalItems / size);

                // Oblicz, które elementy należą do bieżącej strony
                const start = page * size;
                const end = Math.min(start + size, totalItems);
                const paginatedContent: Hotel[] = data.slice(start, end);

                // Utwórz obiekt zgodny z interfejsem PageResponse
                const pageResponse: Page = {
                    content: paginatedContent,
                    pageable: {
                        page:{
                            size: size,
                            number: page,
                            totalElements: totalItems,
                            totalPages: totalPages,
                        }
                    },
                };

                setHotelsPage(pageResponse);
            } else {
                // Jeśli dane są już w formacie PageResponse
                setHotelsPage(data);
            }
        } catch (err) {
            console.error('Błąd pobierania hoteli:', err);
            setError(err instanceof Error ? err.message : 'Wystąpił nieznany błąd podczas pobierania danych');
        } finally {
            setLoading(false);
        }
    };

    // Wywołanie fetchSearchResults przy ładowaniu komponentu i przy zmianie parametrów
    useEffect(() => {
        fetchSearchResults();
    }, [page, size, country, checkIn, checkOut, capacity]);

    return (
        <Container maxWidth="lg" sx={{pt: 10, pb: 8}}>
            {/* Pasek wyszukiwania na górze strony wyników z przekazanymi początkowymi wartościami */}
            <Box sx={{mb: 4}}>
                <SearchBar
                    initialCountry={country || undefined}
                    initialCheckIn={checkIn || undefined}
                    initialCheckOut={checkOut || undefined}
                    initialCapacity={capacity}
                />
            </Box>

            <Paper elevation={3} sx={{p: 3, mb: 4}}>
                <Typography variant="h5" gutterBottom>
                    {t('searchParams')}
                </Typography>
                <Divider sx={{mb: 2}}/>

                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2}}>
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
                            color="primary"
                        />
                    )}
                </Box>
            </Paper>

            <Typography variant="h4" sx={{mb: 4}}>
                {t('resultsTitle')}
            </Typography>

            {/* Tutaj będzie lista wyników wyszukiwania hoteli */}
            <Box sx={{p: 4, textAlign: 'center'}}>
                {loading ? (
                    <CircularProgress/>
                ) : error ? (
                    <Typography variant="body1" color="error">
                        {error}
                    </Typography>
                ) : hotelsPage && hotelsPage.content.length > 0 ? (
                    <>
                        <Grid container spacing={4} justifyContent="center">
                            {hotelsPage.content.map((hotel) => (
                                <Grid key={hotel.id}>
                                    <Card sx={{ display: 'flex', minHeight: 260, borderRadius: 4, boxShadow: 4 }}>
                                        <Box sx={{ width: 350, minHeight: 260, position: 'relative', flexShrink: 0 }}>
                                            <Image
                                                src={hotel.mainImageUrl ? hotel.mainImageUrl : '/images/hotels/default.jpg'}
                                                alt={hotel.name}
                                                fill
                                                style={{ objectFit: 'cover', borderTopLeftRadius: 16, borderBottomLeftRadius: 16 }}
                                                onError={(e) => { (e.target as HTMLImageElement).src = '/images/hotels/default.jpg'; }}
                                            />
                                        </Box>
                                        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 4 }}>
                                            <Typography variant="h5" gutterBottom>
                                                {hotel.name}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                                {t('rating')}: {hotel.rating}
                                            </Typography>
                                            <Typography variant="h6" color="primary">
                                                {hotel.oneNightPrice} PLN
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{mt: 4, display: 'flex', justifyContent: 'center'}}>
                            <Pagination
                                count={hotelsPage?.pageable?.page?.totalPages || 1}
                                page={page + 1}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </>
                ) : (
                    <Typography variant="body1">
                        {t('noResults')}
                    </Typography>
                )}
            </Box>
        </Container>
    );
}

