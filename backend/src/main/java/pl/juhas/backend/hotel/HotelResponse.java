package pl.juhas.backend.hotel;

import pl.juhas.backend.address.Address;
import pl.juhas.backend.amenity.Amenity;
import java.util.List;

public record HotelResponse(
    String name,
    String description,
    String phone,
    String email,
    String website,
    Address address,
    Boolean isAvailableSearch,
    List<Amenity> amenities
) {}
