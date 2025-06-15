package pl.juhas.backend.hotelImage;

public record HotelImageRequest(
        String filePath,
        String altText,
        Boolean isPrimary
) {
}
