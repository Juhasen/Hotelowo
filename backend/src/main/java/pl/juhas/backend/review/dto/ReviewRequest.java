package pl.juhas.backend.review.dto;

public record ReviewRequest(
        Long reservationId,
        Byte rating,
        String comment
) {
}
