package pl.juhas.backend.hotel;

import pl.juhas.backend.address.AddressRequest;
import pl.juhas.backend.amenity.Amenity;
import pl.juhas.backend.hotelImage.HotelImage;
import java.util.List;

public record HotelResponse(
    String name,
    String description,
    String phone,
    String email,
    String website,
    AddressRequest address,
    Boolean isAvailableSearch,
    List<Amenity> amenities,
    List<HotelImage> images
) {}
