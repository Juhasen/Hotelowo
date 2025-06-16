'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';
import SearchBar from '@/app/[locale]/components/SearchBar';
import {Typography} from "@mui/material";


export default function Home() {
    const t = useTranslations('HomePage');
    return (
        <div className="w-full">
            <div className="relative w-full h-screen">
                <Image
                    src={'/images/hotel-main.jpg'}
                    alt="Main Hotel Image"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black opacity-20 z-0"/>

                {/* Search Bar Placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className="flex flex-col gap-8 p-7 rounded-4xl shadow-2xl">
                        <Typography variant="h2" className="text-white text-center font-bold mb-4 drop-shadow-lg">
                            {t('title')}
                        </Typography>
                        <SearchBar/>
                    </div>
                </div>
            </div>
        </div>
    );
}