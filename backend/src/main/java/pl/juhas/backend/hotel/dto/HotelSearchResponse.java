package pl.juhas.backend.hotel.dto;

public record HotelSearchResponse(
        Long id,
        String name,
        String mainImageUrl,
        String rating,
        String oneNightPrice
) {
}
