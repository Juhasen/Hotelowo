import React from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
    Grid,
    Divider
} from "@mui/material";
import { Room } from "@/app/[locale]/lib/types";
import { useTranslations } from "next-intl";
import PersonIcon from '@mui/icons-material/Person';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

interface AvailableRoomsProps {
    id: string;
    rooms: Room[];
}

export default function AvailableRooms({ id, rooms }: AvailableRoomsProps) {
    const t = useTranslations("HotelDetails");
    const tRoomType = useTranslations("RoomType");
    const params = useParams();
    const searchParams = useSearchParams();
    const locale = params.locale as string;

    // Odzyskaj parametry wyszukiwania, aby przekazać je do strony rezerwacji
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const hotelId = searchParams.get("id");

    if (rooms.length === 0) {
        return (
            <Box id={id} sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {t("availableRooms")}
                </Typography>
                <Typography variant="body1">
                    {t("noRoomsAvailable")}
                </Typography>
            </Box>
        );
    }

    return (
        <Box id={id} sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>
                {t("availableRooms")}
            </Typography>

            <Grid container spacing={4}>
                {rooms.map((room, index) => (
                    <Card key={index} sx={{ borderRadius: 3, boxShadow: 2, maxWidth: "800px", minWidth: "350px", margin: "auto" }}>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 8 }}>
                                    <Typography variant="h6" gutterBottom>
                                        {tRoomType(room.type)}
                                    </Typography>

                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                        <SingleBedIcon sx={{ mr: 1, color: "text.secondary" }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {t("roomNumber")}: {room.number}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {t("capacity")}: {room.capacity}
                                        </Typography>
                                    </Box>

                                    <Chip
                                        label={t("available")}
                                        color="success"
                                        size="small"
                                        sx={{ fontWeight: 500 }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "flex-start", md: "flex-end" } }}>
                                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                                            {room.pricePerNight.toFixed(2)} zł
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {t("perNight")}
                                        </Typography>

                                        <Divider sx={{ width: "100%", my: 1 }} />

                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                            {t("total")}: {room.totalPrice.toFixed(2)} zł
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {t("priceInclude")}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>

                        <CardActions sx={{ p: 2, pt: 0, justifyContent: "flex-end" }}>
                            <Link
                                href={`/${locale}/reservation/preview?roomId=${room.number}&hotelId=${hotelId}${checkIn ? `&checkIn=${checkIn}` : ''}${checkOut ? `&checkOut=${checkOut}` : ''}`}
                                passHref
                                className="w-full"
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 1 }}
                                >
                                    {t("bookButton")}
                                </Button>
                            </Link>
                        </CardActions>
                    </Card>
                ))}
            </Grid>
        </Box>
    );
}