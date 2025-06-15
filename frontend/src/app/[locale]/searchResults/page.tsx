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
    Card,
    CardContent,
    Pagination,
    CircularProgress,
    Stack
} from '@mui/material';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import PublicIcon from '@mui/icons-material/Public';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {useTranslations} from 'next-intl';
import {useLocale} from 'use-intl';
import dayjs from 'dayjs';
import 'dayjs/locale/pl';
import 'dayjs/locale/en';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import SearchBar from '@/app/[locale]/components/SearchBar';
import Image from 'next/image';
import {Hotel, Page} from '@/app/[locale]/lib/types';
import {lightBrown, secondaryBrown} from "@/app/[locale]/lib/theme";
import {Link} from '@/i18n/navigation';
import {ArrowRightIcon} from "@mui/x-date-pickers";

dayjs.extend(customParseFormat);

export default function SearchResultsPage() {
    const searchParams = useSearchParams();
    const t = useTranslations('SearchResults');
    const tc = useTranslations('countries');
    const locale = useLocale();

    const [page, setPage] = useState<number>(0);
    const [size] = useState<number>(6);
    const [hotelsPage, setHotelsPage] = useState<Page | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        dayjs.locale(locale);
    }, [locale]);

    const country = searchParams.get('country');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const capacityStr = searchParams.get('capacity');
    const capacity = capacityStr ? parseInt(capacityStr, 10) : 1;

    const dateFormat = 'DD/MM/YYYY';
    const formattedCheckIn = checkIn ? (dayjs(checkIn, dateFormat, true).isValid() ?
        dayjs(checkIn, dateFormat, true).format(dateFormat) : null) : null;

    const formattedCheckOut = checkOut ? (dayjs(checkOut, dateFormat, true).isValid() ?
        dayjs(checkOut, dateFormat, true).format(dateFormat) : null) : null;

    const stayDuration = formattedCheckIn && formattedCheckOut ?
        dayjs(checkOut, dateFormat, true).diff(dayjs(checkIn, dateFormat, true), 'day') : null;

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1);
    };

    const fetchSearchResults = async () => {
        setLoading(true);
        setError(null);

        try {
            const searchUrl = new URL(`/${locale}/api/hotel/`, window.location.origin);

            if (country) searchUrl.searchParams.append('country', country);
            if (checkIn) searchUrl.searchParams.append('checkIn', checkIn);
            if (checkOut) searchUrl.searchParams.append('checkOut', checkOut);
            if (capacity) searchUrl.searchParams.append('capacity', capacity.toString());

            searchUrl.searchParams.append('page', page.toString());
            searchUrl.searchParams.append('size', size.toString());

            console.log('Fetching hotel from:', searchUrl.toString());

            const response = await fetch(searchUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                const totalItems = data.length;
                const totalPages = Math.ceil(totalItems / size);

                const start = page * size;
                const end = Math.min(start + size, totalItems);
                const paginatedContent: Hotel[] = data.slice(start, end);

                const pageResponse: Page = {
                    content: paginatedContent,
                    pageable: {
                        page: {
                            size: size,
                            number: page,
                            totalElements: totalItems,
                            totalPages: totalPages,
                        }
                    },
                };

                setHotelsPage(pageResponse);
            } else {
                const pageResponse: Page = {
                    content: data.content,
                    pageable: {
                        page: {
                            size: data.page.size,
                            number: data.page.number,
                            totalElements: data.page.totalElements,
                            totalPages: data.page.totalPages
                        }
                    }
                };
                setHotelsPage(pageResponse);
            }
        } catch (err) {
            console.error('Błąd pobierania hoteli:', err);
            setError(err instanceof Error ? err.message : 'Wystąpił nieznany błąd podczas pobierania danych');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSearchResults();
    }, [page, size, country, checkIn, checkOut, capacity]);

    return (
        <Container maxWidth="lg" sx={{pt: 10, pb: 8}}>
            <Box sx={{mb: 4}}>
                <SearchBar
                    initialCountry={country || undefined}
                    initialCheckIn={checkIn || undefined}
                    initialCheckOut={checkOut || undefined}
                    initialCapacity={capacity}
                />
            </Box>

            <Paper elevation={8} sx={{px: 2, py: 1, mb: 4, backgroundColor: lightBrown}}>
                <Typography variant="h5" gutterBottom>
                    {t('searchParams')}
                </Typography>
                <Divider sx={{mb: 2}}/>

                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, justifyContent: 'space-around'}}>
                    {country && (
                        <Chip
                            label={`${t('country')}: ${tc(country)}`}
                            variant="outlined"
                            color="primary"
                            icon={<PublicIcon/>}
                        />
                    )}
                    {formattedCheckIn && (
                        <Chip
                            label={`${t('checkIn')}: ${formattedCheckIn}`}
                            variant="outlined"
                            color="primary"
                            icon={<CalendarTodayIcon/>}
                        />
                    )}
                    {formattedCheckOut && (
                        <Chip
                            label={`${t('checkOut')}: ${formattedCheckOut}`}
                            variant="outlined"
                            color="primary"
                            icon={<ExitToAppIcon/>}
                        />
                    )}
                    {capacity && (
                        <Chip
                            label={`${t('guests')}: ${capacity}`}
                            variant="outlined"
                            color="primary"
                            icon={<PeopleIcon/>}
                        />
                    )}
                    {stayDuration !== null && stayDuration >= 0 && (
                        <Chip
                            label={`${t('stayDuration')}: ${stayDuration} ${stayDuration === 1 ? t('day') : t('days')}`}
                            variant="outlined"
                            color="primary"
                            icon={<AccessTimeIcon/>}
                        />
                    )}
                </Box>
            </Paper>

            <Typography variant="h4" sx={{mb: 4}}>
                {t('resultsTitle')}
            </Typography>

            <Box sx={{p: 4, textAlign: 'center'}}>
                {loading ? (
                    <CircularProgress/>
                ) : error ? (
                    <Typography variant="body1" color="error">
                        {error}
                    </Typography>
                ) : hotelsPage && hotelsPage.content.length > 0 ? (
                    <>
                        <Stack
                            spacing={{xs: 2, sm: 3, md: 4}}
                            justifyContent="center"
                            sx={{width: '100%'}}
                        >
                            {hotelsPage.content.map((hotel) => (
                                <Card
                                    key={hotel.id}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: {xs: 'column', sm: 'row'},
                                        width: '100%',
                                        backgroundColor: lightBrown,
                                        height: {xs: 'auto', sm: '260px'},
                                        maxWidth: '100%',
                                        borderRadius: 6,
                                        boxShadow: 4,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: {xs: '100%', sm: '40%', md: '350px'},
                                            height: {xs: '200px', sm: '100%'},
                                            position: 'relative',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Image
                                            src={hotel.mainImageUrl ? hotel.mainImageUrl : '/images/hotels/default.jpg'}
                                            alt={hotel.name}
                                            fill
                                            priority={true}
                                            sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                                            style={{
                                                objectFit: 'cover',
                                                borderRadius: 6
                                            }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/images/hotels/default.jpg';
                                            }}
                                        />
                                    </Box>
                                    <CardContent
                                        sx={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            p: {xs: 2, sm: 3, md: 4},
                                            height: '100%',
                                        }}
                                    >
                                        <Typography variant="h5" gutterBottom>
                                            {hotel.name}
                                        </Typography>

                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                            mb: 2
                                        }}>
                                            <Rating
                                                name="Hotel Rating"
                                                value={hotel.rating}
                                                readOnly
                                                precision={0.5}
                                                size="medium"
                                                sx={{ml: 1}}
                                                emptyIcon={<StarIcon style={{opacity: 0.55}} fontSize="inherit"/>}
                                            />
                                        </Box>

                                        <Box sx={{color: 'text.secondary', mb: 2}}>
                                            <span>1 {t("night")} / {capacity} {capacity > 1 ? t("people") : t("person")}</span>
                                            <br/>
                                            <Box component="span" sx={{
                                                color: 'primary.main',
                                                fontWeight: 'bold',
                                                fontSize: '1.2em'
                                            }}>
                                                {hotel.oneNightPrice} PLN
                                            </Box>
                                        </Box>

                                        {/* Box do wyrównywania przycisku do prawej */}
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            width: '100%',
                                        }}>
                                            <Link
                                                href={{
                                                    pathname: `/hotel/${hotel.id}`,
                                                    query: {
                                                        checkIn,
                                                        checkOut,
                                                        capacity
                                                    }
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: secondaryBrown,
                                                    color: 'white',
                                                    padding: '6px',
                                                    borderRadius: '50%',
                                                    textDecoration: 'none',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                                                    width: '40px',
                                                    height: '40px',
                                                }}
                                            >
                                                <ArrowRightIcon/>
                                            </Link>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                        <Box sx={{mt: 4, display: 'flex', justifyContent: 'center'}}>
                            <Pagination
                                count={hotelsPage?.pageable?.page?.totalPages || 1}
                                page={page + 1}
                                onChange={handlePageChange}
                                className="bg-lightBrown px-2 py-1 rounded-3xl shadow-md"
                                color="secondary"
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

