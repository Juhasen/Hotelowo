import * as React from 'react';
import { useState } from 'react';
import { Paper, IconButton, MenuItem, Select, FormControl, InputLabel, Stack, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {primaryBrown, secondaryBrown, lightBrown} from '../lib/theme';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CountrySelect, { CountryType } from "@/app/[locale]/components/CountrySelect";
import { useTranslations } from 'next-intl';
import { useLocale } from "use-intl";
import { useRouter } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pl';
import 'dayjs/locale/en';

export default function SearchBar() {
    const locale = useLocale();
    const t = useTranslations('SearchBar');
    const router = useRouter();
    const [country, setCountry] = useState<CountryType | null>(null);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [capacity, setCapacity] = useState(1);

    // Ustawienie lokalnego formatowania dat
    React.useEffect(() => {
        dayjs.locale(locale);
    }, [locale]);

    // Format daty DD/MM/YYYY
    const dateFormat = 'DD/MM/YYYY';

    // Konwersja zakresu dat do natywnych obiektów Date dla API
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Przygotowanie parametrów zapytania
        const params = new URLSearchParams();

        // Dodajemy kraj tylko jeśli został wybrany
        if (country) {
            params.append('country', country.code);
        }

        // Dodajemy daty tylko jeśli zostały wybrane
        if (startDate) {
            params.append('checkIn', startDate.format(dateFormat));
        }

        if (endDate) {
            params.append('checkOut', endDate.format(dateFormat));
        }

        // Zawsze dodajemy liczę osób
        params.append('capacity', capacity.toString());

        // Przekierowanie do strony wyników wyszukiwania z parametrami
        router.push(`/${locale}/searchResults?${params.toString()}`);
    };

    return (
        <div className="w-full mx-auto z-20">
            <Paper
                component="form"
                elevation={20}
                sx={{
                    px: '8px',
                    py: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: { xs:'10px', md: '9999px'},
                    width: '100%',
                    backgroundColor: lightBrown,
                    border: `4px solid ${secondaryBrown}`,
                    flexDirection: { xs: 'column', md: 'row' }, // Kolumna na małych ekranach, wiersz na średnich i większych
                    gap: '16px',
                }}
                onSubmit={handleSubmit}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    paddingX: '10px',
                    width: '100%',
                    gap: 2
                }}>
                    <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
                        <CountrySelect value={country} onChange={setCountry} />
                    </Box>

                    <Box sx={{ flexGrow: 1, width: { xs: '100%', md: 'auto' } }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: '100%' }}>
                                <DatePicker
                                    label={t('checkIn')}
                                    value={startDate}
                                    onChange={setStartDate}
                                    format={dateFormat}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            inputProps: {
                                                placeholder: "DD/MM/YYYY"
                                            }
                                        }
                                    }}
                                    disablePast
                                />
                                <DatePicker
                                    label={t('checkOut')}
                                    value={endDate}
                                    onChange={setEndDate}
                                    format={dateFormat}
                                    slotProps={{
                                        textField: {
                                            size: 'small',
                                            fullWidth: true,
                                            inputProps: {
                                                placeholder: "DD/MM/YYYY"
                                            }
                                        }
                                    }}
                                    minDate={startDate || undefined}
                                    disablePast
                                />
                            </Stack>
                        </LocalizationProvider>
                    </Box>

                    <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="capacity-label" sx={{
                                color: 'text.primary',
                                '&.Mui-focused': {
                                    color: primaryBrown
                                }
                            }}>{t('personCount')}</InputLabel>
                            <Select
                                labelId="capacity-label"
                                value={capacity}
                                label={t('personCount')}
                                onChange={e => setCapacity(Number(e.target.value))}
                                sx={{
                                    minWidth: '100px',
                                    '& .MuiSvgIcon-root': {
                                        color: primaryBrown,
                                    }
                                }}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <MenuItem key={num} value={num}>{num}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, width: { xs: '100%', md: 'auto' } }}>
                        <IconButton
                            type="submit"
                            sx={{
                                p: '2px',
                                '&:hover': {
                                    backgroundColor: `${secondaryBrown}40`  // 40 dodaje przezroczystość
                                }
                            }}
                            aria-label={t('searchButton')}
                            color="primary"
                            title={t('searchButton')}
                        >
                            <SearchIcon sx={{ fontSize: 30, color: primaryBrown }} />
                        </IconButton>
                    </Box>
                </Box>
            </Paper>
        </div>
    );
}

