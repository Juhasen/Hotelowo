package pl.juhas.backend.room.dto;

public record RoomRequest(
        Long hotelId,
        String checkInDate,
        String checkOutDate,
        Integer capacity
) {}
