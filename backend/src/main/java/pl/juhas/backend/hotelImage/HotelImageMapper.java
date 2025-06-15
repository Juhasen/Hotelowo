package pl.juhas.backend.hotelImage;

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
