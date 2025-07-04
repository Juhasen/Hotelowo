package pl.juhas.backend.hotel.dto;

import pl.juhas.backend.address.dto.AddressRequest;
import pl.juhas.backend.hotelImage.dto.HotelImageRequest;

import java.util.List;

public record HotelRequest(
    String name,
    String description_pl,
    String description_en,
    String phone,
    String email,
    String website,
    Boolean isAvailableSearch,
    Integer[] amenityIds,
    AddressRequest address,
    List<HotelImageRequest> images
) {
}
