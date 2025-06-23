package pl.juhas.backend.hotelImage;

import pl.juhas.backend.hotelImage.dto.HotelImageDTO;
import pl.juhas.backend.hotelImage.dto.HotelImageRequest;

public class HotelImageMapper {
    public static HotelImageRequest mapToHotelImageRequest(HotelImage hotelImage) {
        if (hotelImage == null) {
            return null;
        }
        return new HotelImageRequest(
            hotelImage.getFilePath(),
            hotelImage.getAltText(),
            hotelImage.getIsPrimary()
        );
    }

    public static HotelImageDTO mapToHotelImageDTO(HotelImage hotelImage) {
        if (hotelImage == null) {
            return null;
        }
        return new HotelImageDTO(
            hotelImage.getId(),
            hotelImage.getFilePath(),
            hotelImage.getAltText(),
            hotelImage.getIsPrimary()
        );
    }
}
