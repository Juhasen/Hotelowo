package pl.juhas.backend.room;

import pl.juhas.backend.room.dto.RoomResponse;

import java.math.BigDecimal;
import java.util.function.Function;

public class RoomMapper {
    public static RoomResponse toResponse(Room room, long daysDifference) {
        return new RoomResponse(
                room.getNumber(),
                room.getType(),
                room.getCapacity(),
                room.getPricePerNight(),
                room.getPricePerNight().multiply(BigDecimal.valueOf(daysDifference))
        );
    }

    // Metoda pomocnicza zwracająca Function do użycia w stream().map()
    public static Function<Room, RoomResponse> toResponse(long daysDifference) {
        return room -> toResponse(room, daysDifference);
    }
}
