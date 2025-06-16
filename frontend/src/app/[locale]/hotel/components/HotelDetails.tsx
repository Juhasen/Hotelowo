import React, {useState} from "react";
import {
    Box,
    Typography,
    Chip,
    Link as MuiLink,
    Paper,
    Container,
    ImageList,
    ImageListItem,
    Dialog,
    Divider,
    useMediaQuery
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {HotelDetail} from "@/app/[locale]/lib/types";
import {primaryBrown} from "@/app/[locale]/lib/theme";

interface HotelDetailsProps {
    hotel: HotelDetail;
}

const HotelDetails: React.FC<HotelDetailsProps> = ({hotel}) => {
    const [open, setOpen] = useState(false);
    const [selectedImg, setSelectedImg] = useState<{ src: string, alt: string } | null>(null);

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));

    // Ustal liczbę kolumn w galerii w zależności od szerokości ekranu
    let imageCols = 3;
    if (isXs) imageCols = 1;
    else if (isSm) imageCols = 2;
    else if (isMd) imageCols = 3;

    const handleImgClick = (img: { filePath: string, altText: string }) => {
        setSelectedImg({src: img.filePath, alt: img.altText});
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    return (
        <Container maxWidth="lg" sx={{pb: 8, px: {xs: 0, sm: 2}}}>
            <Paper
                elevation={8}
                sx={{
                    p: {xs: 1, sm: 2, md: 4},
                    mt: {xs: 2, md: 4},
                    borderRadius: 6,
                    background: "linear-gradient(135deg, #f5f5f5 60%, #e0c3a3 100%)",
                }}
            >
                {/* Pasek górny */}
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: {xs: 2, md: 3},
                    flexDirection: {xs: "column", sm: "row"},
                    gap: 2
                }}>
                    <Typography variant={isXs ? "h5" : "h3"} sx={{fontWeight: 700, textAlign: {xs: "center", sm: "left"}}}>
                        {hotel.name}
                    </Typography>
                    <a href="#available-rooms" style={{textDecoration: "none", width: isXs ? "100%" : "auto"}}>
                        <Box
                            component="button"
                            sx={{
                                px: 3,
                                py: 1,
                                width: {xs: "100%", sm: "auto"},
                                backgroundColor: "primary.main",
                                color: "white",
                                border: "none",
                                borderRadius: 3,
                                fontWeight: 600,
                                fontSize: "1.1rem",
                                cursor: "pointer",
                                boxShadow: 2,
                                transition: "background 0.2s",
                                scrollBehavior: "smooth",
                                "&:hover": {backgroundColor: "primary.dark"}
                            }}
                        >
                            Rezerwuj
                        </Box>
                    </a>
                </Box>
                <Box sx={{width: "100%", mb: 3}}>
                    <Box
                        sx={{
                            borderRadius: 6,
                            boxShadow: 6,
                            width: "100%",
                            height: {xs: 220, sm: 320, md: 450},
                            overflow: "hidden",
                            mb: 3
                        }}>
                        <ImageList cols={imageCols} rowHeight={isXs ? 120 : isSm ? 180 : 300} sx={{width: "100%", height: "100%"}}>
                            {hotel.images.map((img) => (
                                <ImageListItem key={img.filePath}>
                                    <img
                                        srcSet={`${img.filePath}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        src={`${img.filePath}?w=164&h=164&fit=crop&auto=format`}
                                        alt={img.altText}
                                        loading="lazy"
                                        style={{objectFit: "cover", width: "100%", height: "100%", borderRadius: 8, cursor: "pointer"}}
                                        onClick={() => handleImgClick(img)}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </Box>

                    {hotel.description
                        .split('\n\n')
                        .map((paragraph, idx) => (
                            <Typography
                                key={idx}
                                variant="subtitle1"
                                color="text.secondary"
                                gutterBottom
                                sx={{mb: 2, textAlign: "justify"}}
                            >
                                {paragraph}
                            </Typography>
                        ))
                    }
                    <Box sx={{my: 2}}>
                        <Typography variant="body1">
                            <b>Udogodnienia</b>
                        </Typography>
                        <Divider sx={{mb: 2, backgroundColor: primaryBrown}}/>
                        {hotel.amenities.length > 0 ? (
                            <Box sx={{display: "flex", flexWrap: "wrap", gap: 1, mt: 1}}>
                                {hotel.amenities.map((a: string) => (
                                    <Chip key={a} label={a} color="primary"/>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Brak informacji o udogodnieniach.
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{my: 2}}>
                        <Typography variant="body1">
                            <b>Kontakt</b>
                        </Typography>
                        <Divider sx={{mb: 2, backgroundColor: primaryBrown}}/>

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
                            <MuiLink href={`https://${hotel.website}`} target="_blank" rel="noopener"
                                     underline="hover">
                                {hotel.website}
                            </MuiLink>
                        </Typography>
                        <Typography variant="body1">
                            <b>Adres:</b> {hotel.address.street}, {hotel.address.postalCode} {hotel.address.city},{" "}
                            {hotel.address.country}
                        </Typography>
                    </Box>
                </Box>
                {/* Mapa pod całością */}
                <Box sx={{mt: 4}}>
                    <Typography variant="body1">
                        <b>Lokalizacja na mapie</b>
                    </Typography>
                    <Divider sx={{mb: 2, backgroundColor: primaryBrown}}/>

                    <Box sx={{mt: 1, borderRadius: 2, overflow: "hidden", boxShadow: 2}}>
                        <iframe
                            title="Mapa hotelu"
                            width="100%"
                            height={isXs ? 140 : 220}
                            style={{border: 0, borderRadius: 8}}
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${hotel.address.longitude - 0.01},${hotel.address.latitude - 0.01},${hotel.address.longitude + 0.01},${hotel.address.latitude + 0.01}&layer=mapnik&marker=${hotel.address.latitude},${hotel.address.longitude}`}
                        />
                    </Box>
                </Box>
            </Paper>
            {/* Modal z powiększonym zdjęciem */}
            <Dialog open={open} onClose={handleClose} maxWidth="xl">
                {selectedImg && (
                    <Box sx={{p: 2, display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <img
                            src={selectedImg.src}
                            alt={selectedImg.alt}
                            style={{maxWidth: "90vw", maxHeight: "80vh", borderRadius: 12}}
                        />
                    </Box>
                )}
            </Dialog>
        </Container>
    );
};

export default HotelDetails;
