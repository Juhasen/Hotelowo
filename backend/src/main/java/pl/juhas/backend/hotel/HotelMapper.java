package pl.juhas.backend.hotel;

import pl.juhas.backend.address.AddressRequest;
import pl.juhas.backend.address.AddressMapper;

public class HotelMapper {
    public static HotelResponse toResponse(Hotel hotel, String locale) {

        String description;
        if(locale.equals("pl")) {
            description = hotel.getDescription_pl();
        } else {
            description = hotel.getDescription_en();
        }

        AddressRequest addressDTO = AddressMapper.mapToAddressDTO(hotel.getAddress());

        return new HotelResponse(
                hotel.getName(),
                description,
                hotel.getPhone(),
                hotel.getEmail(),
                hotel.getWebsite(),
                addressDTO,
                hotel.getIsAvailableSearch(),
                hotel.getAmenities(),
                hotel.getImages()
        );
    }
}
