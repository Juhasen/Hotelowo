"use client";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LanguageIcon from '@mui/icons-material/Language';
import Link from 'next/link';
import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const currentLocale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    // Funkcja do wyodrębnienia części ścieżki po locale
    const getPathWithoutLocale = () => {
        // Ścieżka zaczyna się od /[locale]/, więc wyodrębniamy część po pierwszym segmencie
        const pathSegments = pathname.split('/');
        // Usuwamy pusty element na początku i segment locale
        const pathWithoutLocale = '/' + pathSegments.slice(2).join('/');
        return pathWithoutLocale === '/' ? '/' : pathWithoutLocale;
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (locale: string) => {
        // Pobieramy ścieżkę bez aktualnego locale
        const pathWithoutLocale = getPathWithoutLocale();
        // Zamykamy menu
        handleClose();

        // Wyodrębnij adres URL i parametry zapytania
        const url = new URL(window.location.href);
        const searchParams = url.search; // zawiera ?id=6&checkIn=17%2F06%2F2025&checkOut=20%2F06%2F2025&capacity=1

        // Przekierowujemy do tej samej ścieżki, ale z nowym locale, zachowując parametry URL
        const newPath = `/${locale}${pathWithoutLocale}${searchParams}`;
        router.push(newPath);
    };

    return (
        <header
            className="w-full px-6 py-4 flex justify-between items-center bg-transparent text-white top-0 left-0 z-50">
            <Link href={`/${currentLocale}`} className="hover:opacity-80 transition">
                <h1 className="text-3xl font-bold text-lightBrown">Hotelowo</h1>
            </Link>

            <div className="flex items-center gap-4">
                {/* Przełącznik języków */}
                <div>
                    <Button
                        id="language-button"
                        aria-controls={open ? 'language-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        sx={{ color: 'white', minWidth: 0, padding: '8px' }}
                        title="Zmień język"
                    >
                        <LanguageIcon />
                        <span className="ml-1 text-xs font-bold">{currentLocale.toUpperCase()}</span>
                    </Button>
                    <Menu
                        id="language-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'language-button',
                        }}
                    >
                        <MenuItem
                            onClick={() => handleLanguageChange('pl')}
                            selected={currentLocale === 'pl'}
                        >
                            Polski
                        </MenuItem>
                        <MenuItem
                            onClick={() => handleLanguageChange('en')}
                            selected={currentLocale === 'en'}
                        >
                            English
                        </MenuItem>
                    </Menu>
                </div>

                {/* Ikona profilu */}
                <Link href={`/${currentLocale}/profile`} className="hover:opacity-80 transition">
                    <AccountCircleIcon fontSize="large"/>
                </Link>
            </div>
        </header>
    );
}
