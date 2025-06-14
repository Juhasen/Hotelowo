import * as React from 'react';
import { useState } from 'react';
import { Paper, IconButton, MenuItem, Select, FormControl, InputLabel, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {primaryBrown, secondaryBrown} from '../lib/theme';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CountrySelect, { CountryType } from "@/app/[locale]/components/CountrySelect";
import { useTranslations } from 'next-intl';
import { useLocale } from "use-intl";
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pl';
import 'dayjs/locale/en';

export default function SearchBar() {
    const locale = useLocale();
    const tc = useTranslations('countries');
    const t = useTranslations('SearchBar');
    const [country, setCountry] = useState<CountryType | null>(null);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [capacity, setCapacity] = useState(1);

    // Ustawienie lokalnego formatowania dat
    React.useEffect(() => {
        dayjs.locale(locale);
    }, [locale]);

    // Konwersja zakresu dat do natywnych obiektów Date dla API
    const getNativeDateRange = () => {
        if (!startDate || !endDate) return null;
        return [startDate.toDate(), endDate.toDate()];
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // obsługa wyszukiwania
        const selectedCountry = country ? tc(country.code) : null;
        const nativeDateRange = getNativeDateRange();
        console.log({
            country: country,
            countryName: selectedCountry,
            dateRange: nativeDateRange,
            capacity
        });
    };

    return (
        <div className="w-full max-w-3xl mx-auto z-20">
            <Paper
                component="form"
                elevation={5}
                sx={{
                    p: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '9999px',
                    width: '100%',
                    gap: 2,
                    flexWrap: 'wrap',
                    border: `1px solid ${secondaryBrown}` // Dodanie obramowania do całego formularza
                }}
                className="flex flex-row gap-x-2 w-full"
                onSubmit={handleSubmit}
            >
                <CountrySelect value={country} onChange={setCountry} />

                <div style={{ flexGrow: 1, minWidth: '280px' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
                        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                            <DatePicker
                                label={t('checkIn')}
                                value={startDate}
                                onChange={setStartDate}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        fullWidth: true
                                    }
                                }}

                                disablePast
                            />
                            <DatePicker
                                label={t('checkOut')}
                                value={endDate}
                                onChange={setEndDate}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        fullWidth: true
                                    }
                                }}

                                minDate={startDate || undefined}
                                disablePast
                            />
                        </Stack>
                    </LocalizationProvider>
                </div>

                <FormControl size="small" >
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
                <IconButton
                    type="submit"
                    sx={{
                        p: '15px',
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
            </Paper>
        </div>
    );
}

