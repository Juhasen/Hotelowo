'use client';

import {useTranslations} from 'next-intl';
import Image from 'next/image';
import mainImage from '../../../public/assets/images/hotel-main.jpg';
import SearchBar from '@/app/[locale]/components/SearchBar';
import CategoriesSection from '@/app/[locale]/components/CategoriesSection';
import {Typography} from "@mui/material";


export default function Home() {
    const t = useTranslations('HomePage');
    return (
        <div className="w-full">
            <div className="relative w-full h-screen">
                <Image
                    src={mainImage}
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
                        <Typography variant="h1" className="text-white text-4xl font-bold mb-4">
                            {t('title')}
                        </Typography>
                        <SearchBar/>
                    </div>
                </div>

            </div>
            <CategoriesSection />
        </div>
    );
}