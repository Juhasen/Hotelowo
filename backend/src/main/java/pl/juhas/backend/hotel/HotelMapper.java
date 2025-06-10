package pl.juhas.backend.hotel;

public class HotelMapper {
    public static HotelResponse toResponse(Hotel hotel) {
        return new HotelResponse(
                hotel.getId().intValue(),
                hotel.getName(),
                hotel.getDescription_pl(),
                hotel.getDescription_en(),
                hotel.getPhone(),
                hotel.getEmail(),
                hotel.getWebsite(),
                hotel.getAddress(),
                hotel.getIsAvailableSearch(),
                hotel.getAmenities()
        );
    }
}
