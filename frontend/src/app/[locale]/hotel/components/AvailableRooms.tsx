import {Box, Typography} from "@mui/material";
import {Room} from "@/app/[locale]/lib/types";

interface AvailableRoomsProps {
    id: string;
    rooms: Room[];
}

export default function AvailableRooms({id, rooms}: AvailableRoomsProps) {
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