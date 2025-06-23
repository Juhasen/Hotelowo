package pl.juhas.backend.room.dto;

import pl.juhas.backend.room.RoomType;

import java.math.BigDecimal;

public record RoomResponse(
        String number,
        RoomType type,
        Integer capacity,
        BigDecimal pricePerNight,
        BigDecimal totalPrice
) {}
