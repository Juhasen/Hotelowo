package pl.juhas.backend.hotelImage;

public record HotelImageDTO(
    Long id,
    String filePath,
    String altText,
    Boolean isPrimary
) {
}
