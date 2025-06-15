package pl.juhas.backend.hotel;

import pl.juhas.backend.address.AddressRequest;
import pl.juhas.backend.address.AddressMapper;
import pl.juhas.backend.hotel.dto.HotelResponse;
import pl.juhas.backend.hotelImage.HotelImageMapper;
import pl.juhas.backend.hotelImage.HotelImageRequest;

import java.util.List;

public class HotelMapper {
    public static HotelResponse toResponse(Hotel hotel, String locale) {

        String description;
        if(locale.equals("pl")) {
            description = hotel.getDescription_pl();
        } else {
            description = hotel.getDescription_en();
        }

        AddressRequest addressDTO = AddressMapper.mapToAddressDTO(hotel.getAddress());
        List<HotelImageRequest> images = hotel.getImages().stream()
                .map(HotelImageMapper::mapToHotelImageRequest)
                .toList();

        return new HotelResponse(
                hotel.getName(),
                description,
                hotel.getPhone(),
                hotel.getEmail(),
                hotel.getWebsite(),
                addressDTO,
                hotel.getIsAvailableSearch(),
                hotel.getAmenities(),
                images
        );
    }
}
