package pl.juhas.backend.room;

import pl.juhas.backend.room.dto.RoomResponse;

public class RoomMapper {
    public static RoomResponse toResponse(Room room) {
        return new RoomResponse(
                room.getNumber(),
                room.getType(),
                room.getCapacity(),
                room.getPricePerNight().toString()
        );
    }

}
