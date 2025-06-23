package pl.juhas.backend.hotelImage.dto;

public record HotelImageRequest(
        String filePath,
        String altText,
        Boolean isPrimary
) {
}
