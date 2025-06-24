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
    useMediaQuery,
    Tooltip
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {HotelDetail} from "@/app/[locale]/lib/types";
import {primaryBrown, starColor} from "@/app/[locale]/lib/theme";
import StarIcon from '@mui/icons-material/Star';
import Rating from "@mui/material/Rating";
import {useTranslations} from "next-intl";
import Image from "next/image";

interface HotelDetailsProps {
    hotel: HotelDetail;
}

const HotelDetails: React.FC<HotelDetailsProps> = ({hotel}) => {
    const [open, setOpen] = useState(false);
    const [selectedImg, setSelectedImg] = useState<{ src: string, alt: string } | null>(null);
    const t = useTranslations('HotelDetails');

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
                    <Typography variant={isXs ? "h5" : "h3"}
                                sx={{fontWeight: 700, textAlign: {xs: "center", sm: "left"}, display: "flex", alignItems: "center", gap: 1}}>
                        {hotel.name}
                        <Tooltip title={t('starsTooltip')}>
                            <Box sx={{display: "flex", alignItems: "center", ml: 2}}>
                                {Array.from({ length: hotel.stars }).map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        sx={{ color: starColor, fontSize: isXs ? 22 : 28 }}
                                    />
                                ))}
                            </Box>
                        </Tooltip>
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
                            {t('bookButton')}
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
                        <ImageList cols={imageCols} rowHeight={isXs ? 120 : isSm ? 180 : 300}
                                   sx={{width: "100%", height: "100%"}}>
                            {hotel.images.map((img) => (
                                <ImageListItem key={img.filePath}>
                                    <img
                                        srcSet={`${img.filePath}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        src={`${img.filePath}?w=164&h=164&fit=crop&auto=format`}
                                        alt={img.altText}
                                        loading="lazy"
                                        style={{
                                            objectFit: "cover",
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: 8,
                                            cursor: "pointer"
                                        }}
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
                            <b>{t('amenities')}</b>
                        </Typography>
                        <Divider sx={{mb: 2, backgroundColor: primaryBrown}}/>
                        {hotel.amenities.length > 0 ? (
                            <Box sx={{display: "flex", flexWrap: "wrap", gap: 1, mt: 1}}>
                                {hotel.amenities.map((amenity, index) => (
                                    <Chip
                                        key={index}
                                        label={amenity.name}
                                        color="primary"
                                        icon={
                                            <Image
                                                src={`/icons/${amenity.icon}.png`}
                                                alt={amenity.name}
                                                width={20}
                                                height={20}
                                                className="ml-3"
                                            />
                                        }
                                    />
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                {t('noAmenities')}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{my: 2}}>
                        <Typography variant="body1">
                            <b>{t('contact')}</b>
                        </Typography>
                        <Divider sx={{mb: 2, backgroundColor: primaryBrown}}/>

                        <Typography variant="body1">
                            <b>{t('phone')}:</b> {hotel.phone}
                        </Typography>
                        <Typography variant="body1">
                            <b>{t('email')}:</b>{" "}
                            <MuiLink href={`mailto:${hotel.email}`} underline="hover">
                                {hotel.email}
                            </MuiLink>
                        </Typography>
                        <Typography variant="body1">
                            <b>{t('website')}:</b>{" "}
                            <MuiLink href={`https://${hotel.website}`} target="_blank" rel="noopener"
                                     underline="hover">
                                {hotel.website}
                            </MuiLink>
                        </Typography>
                        <Typography variant="body1">
                            <b>{t('address')}:</b> {hotel.address.street}, {hotel.address.postalCode} {hotel.address.city},{" "}
                            {hotel.address.country}
                        </Typography>
                    </Box>
                </Box>
                {/* Mapa pod całością */}
                <Box sx={{mt: 4}}>
                    <Typography variant="body1">
                        <b>{t('mapLocation')}</b>
                    </Typography>
                    <Divider sx={{mb: 2, backgroundColor: primaryBrown}}/>

                    <Box sx={{mt: 1, borderRadius: 2, overflow: "hidden", boxShadow: 2}}>
                        <iframe
                            title={t('mapTitle')}
                            width="100%"
                            height={isXs ? 140 : 220}
                            className="border-2 border-r-8 border-brown"
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${hotel.address.longitude - 0.01},${hotel.address.latitude - 0.01},${hotel.address.longitude + 0.01},${hotel.address.latitude + 0.01}&layer=mapnik&marker=${hotel.address.latitude},${hotel.address.longitude}`}
                        />
                    </Box>
                </Box>
                <Box sx={{ mt: 4 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                        <b>{t('reviews')}</b>
                    </Typography>
                    <Divider sx={{ mb: 2, backgroundColor: primaryBrown }} />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Rating
                            name="Hotel Rating"
                            value={hotel.rating}
                            readOnly
                            precision={0.5}
                            size="large"
                            sx={{ ml: 1 }}
                            emptyIcon={<StarIcon style={{ opacity: 0.4 }} fontSize="inherit" />}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: starColor }}>
                            {Number(hotel.rating).toFixed(1)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            ({Math.round(hotel.rating * 20)}%)
                        </Typography>
                    </Box>
                </Box>
            </Paper>
            {/* Modal z powiększonym zdjęciem */}
            <Dialog open={open} onClose={handleClose} maxWidth="xl">
                {selectedImg && (
                    <Box sx={{p: 2, display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Image
                            src={selectedImg.src}
                            alt={selectedImg.alt}
                            width={720}
                            height={480}
                            className="max-w-[90vw] max-h-[80vh] border-r-8"
                        />
                    </Box>
                )}
            </Dialog>
        </Container>
    );
};

export default HotelDetails;
