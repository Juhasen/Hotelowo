package pl.juhas.backend.reservation.dto;

import pl.juhas.backend.reservation.Status;
import pl.juhas.backend.room.RoomType;

import java.math.BigDecimal;

public record ReservationOverview(
        Long id,
        String hotelName,
        String hotelImageUrl,
        RoomType roomType,
        String checkInDate,
        String checkOutDate,
        BigDecimal totalPrice,
        Status status
) {
}
