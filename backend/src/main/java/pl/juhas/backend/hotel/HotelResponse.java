package pl.juhas.backend.hotel;

import pl.juhas.backend.address.Address;
import pl.juhas.backend.amenity.Amenity;

import java.util.List;

public record HotelResponse(
    Integer id,
    String name,
    String description_pl,
    String description_en,
    String phone,
    String email,
    String website,
    Address address,
    Boolean isAvailableSearch,
    List<Amenity> amenities
) {
}
