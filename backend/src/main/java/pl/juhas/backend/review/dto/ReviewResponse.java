package pl.juhas.backend.review.dto;

public record ReviewResponse(
        String firstname,
        String lastname,
        Byte rating,
        String comment
) {
}
