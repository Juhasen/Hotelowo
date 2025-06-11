package pl.juhas.backend.hotel;

public class HotelMapper {
    public static HotelResponse toResponse(Hotel hotel, String locale) {

        String description;
        if(locale.equals("pl")) {
            description = hotel.getDescription_pl();
        } else {
            description = hotel.getDescription_en();
        }

        return new HotelResponse(
                hotel.getName(),
                description,
                hotel.getPhone(),
                hotel.getEmail(),
                hotel.getWebsite(),
                hotel.getAddress(),
                hotel.getIsAvailableSearch(),
                hotel.getAmenities()
        );
    }
}
