package pl.juhas.backend.hotel;

import pl.juhas.backend.address.AddressDTO;
import pl.juhas.backend.hotelImage.HotelImageDTO;

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
    AddressDTO address,
    List<HotelImageDTO> images
) {
}
