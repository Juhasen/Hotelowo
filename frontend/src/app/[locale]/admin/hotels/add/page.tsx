'use client';

import { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, TextField, Button, Box, Checkbox, FormControlLabel,
    Snackbar, Grid, IconButton, InputLabel, Select, MenuItem, FormControl, Divider
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CountrySelect, { CountryType } from '@/app/[locale]/components/CountrySelect';

// Dodanie enumeracji dla typów pokoi
enum RoomType {
    SINGLE = 'SINGLE',
    DOUBLE = 'DOUBLE',
    SUITE = 'SUITE'
}

// Interfejs dla danych pokoju
interface Room {
    number: string;
    roomType: RoomType;
    pricePerNight: number;
    capacity: number;
}

export default function AddHotelPage() {
    const t = useTranslations('AddHotels');
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const [stars, setStars] = useState<number>(3);

    // Stany formularza
    const [form, setForm] = useState({
        name: '',
        stars: 3,
        description_pl: '',
        description_en: '',
        phone: '',
        email: '',
        website: '',
        isAvailableSearch: true,
        amenityIds: [] as number[],
        address: {
            country: '',
            street: '',
            city: '',
            postalCode: '',
            latitude: 0,
            longitude: 0,
        },
        images: [
            { file: null as File | null, altText: '', isPrimary: true }
        ],
        rooms: [] as Room[] // Dodanie pustej tablicy pokoi
    });

    const [amenities, setAmenities] = useState<{ id: number, name: string }[]>([]);
    const [notification, setNotification] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);

    useEffect(() => {
        fetch(`/${locale}/api/admin/amenities`)
            .then(res => res.json())
            .then(data => setAmenities(Array.isArray(data) ? data : []));
    }, [locale]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const handleAmenityChange = (id: number) => {
        setForm(prev => ({
            ...prev,
            amenityIds: prev.amenityIds.includes(id)
                ? prev.amenityIds.filter(aid => aid !== id)
                : [...prev.amenityIds, id]
        }));
    };

    const handleImageChange = (idx: number, file: File | null) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.map((img, i) =>
                i === idx ? { ...img, file } : img
            )
        }));
    };

    const handleAltChange = (idx: number, altText: string) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.map((img, i) =>
                i === idx ? { ...img, altText } : img
            )
        }));
    };

    const addImageField = () => {
        setForm(prev => ({
            ...prev,
            images: [...prev.images, { file: null, altText: '', isPrimary: false }]
        }));
    };

    const removeImageField = (idx: number) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== idx)
        }));
    };

    // Funkcje zarządzające pokojami
    const addRoom = () => {
        const newRoom: Room = {
            number: '',
            roomType: RoomType.SINGLE,
            pricePerNight: 0,
            capacity: 1
        };
        setForm(prev => ({
            ...prev,
            rooms: [...prev.rooms, newRoom]
        }));
    };

    const removeRoom = (idx: number) => {
        setForm(prev => ({
            ...prev,
            rooms: prev.rooms.filter((_, i) => i !== idx)
        }));
    };

    const handleRoomChange = (idx: number, field: keyof Room, value: string | number | RoomType) => {
        setForm(prev => ({
            ...prev,
            rooms: prev.rooms.map((room, i) =>
                i === idx ? { ...room, [field]: value } : room
            )
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const address = form.address;
        const amenityIds = form.amenityIds;
        const rooms = form.rooms;
        const data = new FormData();
        data.append('name', form.name);
        data.append('stars', String(form.stars));
        data.append('description_pl', form.description_pl);
        data.append('description_en', form.description_en);
        data.append('phone', form.phone);
        data.append('email', form.email);
        data.append('website', form.website);
        data.append('isAvailableSearch', String(form.isAvailableSearch));

        // Przesyłamy amenityIds jako JSON string - backend oczekuje tablicy
        data.append('amenityIds', JSON.stringify(amenityIds));

        // Przesyłamy pokoje jako JSON string
        data.append('rooms', JSON.stringify(rooms));

        // Adres przesyłamy jako JSON string
        data.append('address', JSON.stringify(address));

        form.images.forEach((img, idx) => {
            if (img.file) data.append('images', img.file, img.file.name);
        });

        const res = await fetch(`/${locale}/api/admin/hotels`, {
            method: 'POST',
            body: data
        });
        if (res.ok) {
            setNotification(t('hotelAdded') || 'Hotel added!');
            setNotificationOpen(true);
            setTimeout(() => router.push(`/${locale}/admin/hotels`), 1500);
        } else {
            setNotification(t('errorFetchingHotels'));
            setNotificationOpen(true);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 12 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" mb={3}>{t('addHotel')}</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate encType="multipart/form-data">
                    <TextField label={t('name')} name="name" value={form.name} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
                    <FormControl fullWidth sx={{ my: 2 }}>
                        <InputLabel id="stars-label">{t('stars')}</InputLabel>
                        <Select
                            labelId="stars-label"
                            value={stars}
                            label={t('stars')}
                            onChange={e => { setStars(Number(e.target.value)); setForm(prev => ({ ...prev, stars: Number(e.target.value) })); }}
                        >
                            {[1, 2, 3, 4, 5].map(num => <MenuItem key={num} value={num}>{num}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <TextField label={t('descriptionPl')} name="description_pl" value={form.description_pl} onChange={handleChange} fullWidth multiline sx={{ mb: 2 }} />
                    <TextField label={t('descriptionEn')} name="description_en" value={form.description_en} onChange={handleChange} fullWidth multiline sx={{ mb: 2 }} />
                    <TextField label={t('phone')} name="phone" value={form.phone} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label={t('email')} name="email" value={form.email} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <TextField label={t('website')} name="website" value={form.website} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={form.isAvailableSearch}
                                onChange={e => setForm(prev => ({ ...prev, isAvailableSearch: e.target.checked }))}
                            />
                        }
                        label={t('visibleInSearch')}
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="h6" mt={2}>{t('address')}</Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid size={{xs: 6}}>
                            <TextField label={t('country') + ` (CODE)`} name="country" value={form.address.country} onChange={handleAddressChange} fullWidth />
                        </Grid>
                        <Grid size={{xs: 6}}>
                            <TextField label={t('city')} name="city" value={form.address.city} onChange={handleAddressChange} fullWidth />
                        </Grid>
                        <Grid size={{xs: 6}}>
                            <TextField label={t('street')} name="street" value={form.address.street} onChange={handleAddressChange} fullWidth />
                        </Grid>
                        <Grid size={{xs: 6}}>
                            <TextField label={t('postalCode')} name="postalCode" value={form.address.postalCode} onChange={handleAddressChange} fullWidth />
                        </Grid>
                        <Grid size={{xs: 6}}>
                            <TextField label={t('latitude')} name="latitude" type="number" value={form.address.latitude} onChange={handleAddressChange} fullWidth />
                        </Grid>
                        <Grid size={{xs: 6}}>
                            <TextField label={t('longitude')} name="longitude" type="number" value={form.address.longitude} onChange={handleAddressChange} fullWidth />
                        </Grid>
                    </Grid>
                    <Typography variant="h6" mt={2}>{t('amenities')}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
                        {amenities.map(a => (
                            <FormControlLabel
                                key={a.id}
                                control={
                                    <Checkbox
                                        checked={form.amenityIds.includes(a.id)}
                                        onChange={() => handleAmenityChange(a.id)}
                                    />
                                }
                                label={a.name}
                            />
                        ))}
                    </Box>
                    <Typography variant="h6" mt={2}>{t('images')}</Typography>
                    {form.images.map((img, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
                            <input
                                type="file"
                                onChange={e => handleImageChange(idx, e.target.files ? e.target.files[0] : null)}
                            />
                            <TextField
                                label={t('altText')}
                                value={img.altText}
                                onChange={e => handleAltChange(idx, e.target.value)}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={img.isPrimary} onChange={e => handleImageChange(idx, img.file) && setForm(prev => ({
                                    ...prev,
                                    images: prev.images.map((i, j) => ({ ...i, isPrimary: j === idx }))
                                }))} />}
                                label={t('isPrimary')}
                            />
                            {form.images.length > 1 && (
                                <IconButton onClick={() => removeImageField(idx)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                    <Button onClick={addImageField} sx={{ mb: 2 }}>{t('addImage')}</Button>
                    <Typography variant="h6" mt={2}>{t('rooms')}</Typography>
                    {form.rooms.map((room, idx) => (
                        <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                            <TextField
                                label={t('roomNumber')}
                                value={room.number}
                                onChange={e => handleRoomChange(idx, 'number', e.target.value)}
                            />
                            <FormControl>
                                <InputLabel>{t('roomType')}</InputLabel>
                                <Select
                                    value={room.roomType}
                                    onChange={e => handleRoomChange(idx, 'roomType', e.target.value as RoomType)}
                                >
                                    {Object.values(RoomType).map(type => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label={t('pricePerNight')}
                                type="number"
                                value={room.pricePerNight}
                                onChange={e => handleRoomChange(idx, 'pricePerNight', Number(e.target.value))}
                            />
                            <TextField
                                label={t('capacity')}
                                type="number"
                                value={room.capacity}
                                inputProps={{ min: 1 }}
                                onChange={e => handleRoomChange(idx, 'capacity', Number(e.target.value))}
                            />
                            <IconButton onClick={() => removeRoom(idx)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button onClick={addRoom} sx={{ mb: 2 }}>{t('addRoom')}</Button>
                    <Box>
                        <Button type="submit" variant="contained" color="primary">{t('addHotel')}</Button>
                        <Button sx={{ ml: 2 }} onClick={() => router.push(`/${locale}/admin/hotels`)}>{t('cancel')}</Button>
                    </Box>
                </Box>
            </Paper>
            <Snackbar
                open={notificationOpen}
                autoHideDuration={4000}
                onClose={() => setNotificationOpen(false)}
                message={notification}
            />
        </Container>
    );
}





