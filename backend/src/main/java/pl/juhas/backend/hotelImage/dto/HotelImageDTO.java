package pl.juhas.backend.hotelImage.dto;

public record HotelImageDTO(
    Long id,
    String filePath,
    String altText,
    Boolean isPrimary
) {
}
