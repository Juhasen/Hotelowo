import React from "react";
import {
    Box,
    Typography,
    Chip,
    Link as MuiLink,
    Paper,
    Container,
    ImageList,
    ImageListItem,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import { HotelDetail } from "@/app/[locale]/lib/types";

// Funkcja pomocnicza do srcset (dla <img>)
function srcset(image: string, size: number, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
    };
}

interface HotelDetailsProps {
    hotel: HotelDetail;
}

const HotelDetails: React.FC<HotelDetailsProps> = ({ hotel }) => {
    return (
        <Container maxWidth="lg" sx={{ pt: 10, pb: 8 }}>
            <Paper
                elevation={8}
                sx={{
                    p: { xs: 2, md: 4 },
                    mt: 4,
                    borderRadius: 6,
                    background: "linear-gradient(135deg, #f5f5f5 60%, #e0c3a3 100%)",
                }}
            >
                <Grid container spacing={4}>
                    <Grid  size={{xs: 12, md: 5}}>
                        <Box sx={{ mb: 2, borderRadius: 3, overflow: "hidden", boxShadow: 3 }}>
                            <ImageList
                                sx={{ width: "100%", maxWidth: 500, height: 450, borderRadius: 2, background: "#fff" }}
                                variant="quilted"
                                cols={4}
                                rowHeight={121}
                            >
                                {hotel.images.map((img) => (
                                    <ImageListItem
                                        key={img.filePath}
                                        cols={img.isPrimary ? 2 : 1}
                                        rows={img.isPrimary ? 2 : 1}
                                    >
                                        <Image
                                            {...srcset(img.filePath, 121, img.isPrimary ? 2 : 1, img.isPrimary ? 2 : 1)}
                                            alt={img.altText}
                                            loading="lazy"
                                            width={100}
                                            height={100}
                                            style={{ objectFit: "cover", width: "100%", height: "100%", borderRadius: 8 }}
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Box>
                    </Grid>
                    <Grid size={{xs: 12, md: 5}}>
                        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
                            {hotel.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                            {hotel.description}
                        </Typography>
                        <Box sx={{ my: 2 }}>
                            <Typography variant="body1">
                                <b>Telefon:</b> {hotel.phone}
                            </Typography>
                            <Typography variant="body1">
                                <b>Email:</b>{" "}
                                <MuiLink href={`mailto:${hotel.email}`} underline="hover">
                                    {hotel.email}
                                </MuiLink>
                            </Typography>
                            <Typography variant="body1">
                                <b>Strona:</b>{" "}
                                <MuiLink href={`https://${hotel.website}`} target="_blank" rel="noopener" underline="hover">
                                    {hotel.website}
                                </MuiLink>
                            </Typography>
                        </Box>
                        <Box sx={{ my: 2 }}>
                            <Typography variant="body1">
                                <b>Adres:</b> {hotel.address.street}, {hotel.address.postalCode} {hotel.address.city},{" "}
                                {hotel.address.country}
                            </Typography>
                        </Box>
                        <Box sx={{ my: 2 }}>
                            <Typography variant="body1">
                                <b>Udogodnienia:</b>
                            </Typography>
                            {hotel.amenities.length > 0 ? (
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                                    {hotel.amenities.map((a: string) => (
                                        <Chip key={a} label={a} color="primary" />
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Brak informacji o udogodnieniach.
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ my: 2 }}>
                            <Typography variant="body1">
                                <b>Lokalizacja na mapie:</b>
                            </Typography>
                            <Box sx={{ mt: 1, borderRadius: 2, overflow: "hidden", boxShadow: 2 }}>
                                <iframe
                                    title="Mapa hotelu"
                                    width="100%"
                                    height="220"
                                    style={{ border: 0, borderRadius: 8 }}
                                    loading="lazy"
                                    allowFullScreen
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${hotel.address.longitude - 0.01},${hotel.address.latitude - 0.01},${hotel.address.longitude + 0.01},${hotel.address.latitude + 0.01}&layer=mapnik&marker=${hotel.address.latitude},${hotel.address.longitude}`}
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default HotelDetails;
