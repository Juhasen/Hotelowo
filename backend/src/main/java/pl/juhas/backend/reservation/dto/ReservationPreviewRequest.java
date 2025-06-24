package pl.juhas.backend.reservation.dto;

public record ReservationPreviewRequest(
        String roomNumber,
        Long hotelId,
        String checkInDate,
        String checkOutDate
) {}
