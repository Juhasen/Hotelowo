package pl.juhas.backend.hotel.dto;

import java.math.BigDecimal;

public record HotelSearchResponse(
        Long id,
        String name,
        String mainImageUrl,
        BigDecimal rating,
        BigDecimal oneNightPrice,
        Integer stars
) {
}
