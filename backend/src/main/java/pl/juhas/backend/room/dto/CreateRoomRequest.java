package pl.juhas.backend.room.dto;

import pl.juhas.backend.room.RoomType;

public record CreateRoomRequest(
        String number,
        RoomType roomType,
        Integer capacity,
        Double pricePerNight
) {
}
