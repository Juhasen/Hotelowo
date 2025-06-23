package pl.juhas.backend.hotel.dto;

import pl.juhas.backend.address.dto.AddressRequest;
import pl.juhas.backend.amenity.dto.AmenityResponse;
import pl.juhas.backend.hotelImage.dto.HotelImageRequest;

import java.util.List;

public record HotelResponse(
        String name,
        String description,
        String phone,
        String email,
        String website,
        AddressRequest address,
        Boolean isAvailableSearch,
        List<AmenityResponse> amenities,
        List<HotelImageRequest> images,
        String rating,
        String stars
) {}
