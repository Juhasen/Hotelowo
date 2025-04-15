'use client';

import Image from 'next/image';
import mainImage from '../../public/assets/images/hotel-main.jpg';
import SearchBar from '@/app/components/SearchBar';
import {Typography} from "@mui/material";


export default function Home() {
    return (
        <div className="relative w-screen h-screen">
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
                        Find Your Perfect Stay
                    </Typography>
                    <SearchBar/>
                </div>
            </div>
        </div>
    );
}