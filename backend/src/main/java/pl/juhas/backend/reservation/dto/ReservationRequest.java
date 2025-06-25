package pl.juhas.backend.reservation.dto;

import pl.juhas.backend.reservation.PaymentMethod;

public record ReservationRequest(
        String roomNumber,
        Long hotelId,
        String checkInDate,
        String checkOutDate,
        PaymentMethod paymentMethod
) {
}
