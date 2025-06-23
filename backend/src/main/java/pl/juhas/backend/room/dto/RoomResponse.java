package pl.juhas.backend.room.dto;

import pl.juhas.backend.room.RoomType;

public record RoomResponse(
        String number,
        RoomType type,
        Integer capacity,
        String pricePerNight
) {}
