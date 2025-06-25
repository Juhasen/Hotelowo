package pl.juhas.backend.reservation.dto;

import pl.juhas.backend.hotel.dto.HotelResponse;
import pl.juhas.backend.reservation.PaymentMethod;
import pl.juhas.backend.reservation.Status;
import pl.juhas.backend.room.dto.RoomResponse;
import pl.juhas.backend.user.dto.UserResponse;

import java.math.BigDecimal;

public record ReservationPreviewResponse(
        Status status,
        HotelResponse hotel,
        RoomResponse room,
        UserResponse guest,
        String checkInDate,
        String checkOutDate,
        Integer nights,
        BigDecimal totalPrice,
        PaymentMethod paymentMethod,
        String createdAt
) {
}
