﻿import {Box, Typography} from "@mui/material";

interface AvailableRoomsProps {
    id?: string
}

export default function AvailableRooms({id}: AvailableRoomsProps) {
    return (
        <Box id={id} sx={{mt: 4}}>
            <Typography variant="h5" gutterBottom>
                Dostępne pokoje
            </Typography>
            <Typography variant="body1">
                W tej sekcji będą wyświetlane dostępne pokoje w hotelu. Funkcjonalność ta jest w trakcie implementacji.
            </Typography>
        </Box>
    );
}