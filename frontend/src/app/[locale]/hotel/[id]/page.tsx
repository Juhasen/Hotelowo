"use client";

import React, {useEffect, useState} from "react";
import {
    Box,
    Typography,
    CircularProgress, Container,
} from "@mui/material";
import {useSearchParams, useParams} from "next/navigation";
import {HotelDetail, Room} from "@/app/[locale]/lib/types";
import HotelDetails from "../components/HotelDetails";
import AvailableRooms from "@/app/[locale]/hotel/components/AvailableRooms";

export default function HotelPage() {
    const searchParams = useSearchParams();
    const params = useParams();

    const id = searchParams.get("id");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const capacity = searchParams.get("capacity");
    const locale = params?.locale || "en";

    const [hotel, setHotel] = useState<HotelDetail | null>(null);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotelDetails = async () => {
            try {
                const searchUrl = new URL(`/api/hotel/${id}`, window.location.origin);
                if (checkIn) searchUrl.searchParams.append("checkIn", checkIn);
                if (checkOut) searchUrl.searchParams.append("checkOut", checkOut);
                if (capacity) searchUrl.searchParams.append("capacity", capacity.toString());

                const response = await fetch(searchUrl.toString());
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setHotel(data);

            } catch {
                setHotel(null);
            } finally {
                setLoading(false);
            }
        };

        const fetchRoomDetails = async () => {
            try {
                const searchUrl = new URL(`/api/hotel/rooms/${id}`, window.location.origin);
                if (checkIn) searchUrl.searchParams.append("checkIn", checkIn);
                if (checkOut) searchUrl.searchParams.append("checkOut", checkOut);
                if (capacity) searchUrl.searchParams.append("capacity", capacity.toString());

                const response = await fetch(searchUrl.toString());
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setRooms(data);

            } catch {
                setRooms([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHotelDetails();
        fetchRoomDetails();
    }, [id, checkIn, checkOut, capacity, locale]);


    useEffect(() => {

    }, [id, checkIn, checkOut, capacity, locale]);

    if (loading) {
        return (
            <Box sx={{display: "flex", justifyContent: "center", mt: 8}}>
                <CircularProgress/>
            </Box>
        );
    }
    if (!hotel) {
        return (
            <Typography variant="h6" color="error" sx={{mt: 8, textAlign: "center"}}>
                Nie znaleziono hotelu.
            </Typography>
        );
    }

    return (
        <Container maxWidth="lg" sx={{pb: 8, pt: 6}}>
            <HotelDetails hotel={hotel}/>
            <AvailableRooms rooms={rooms} id="available-rooms"/>
        </Container>
    );
}

