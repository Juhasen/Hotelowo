package pl.juhas.backend.hotelImage;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.juhas.backend.hotel.Hotel;
import pl.juhas.backend.hotel.HotelRepository;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class HotelImageService {

    private final HotelImageRepository hotelImageRepository;
    private final HotelRepository hotelRepository;

    public List<HotelImage> getImagesByHotelId(Long hotelId) {
        return hotelImageRepository.findByHotelId(hotelId);
    }

    public HotelImage addImageToHotel(Long hotelId, String filePath, String altText, Boolean isPrimary) {
        Optional<Hotel> optionalHotel = hotelRepository.findById(hotelId);
        if (optionalHotel.isEmpty()) {
            return null;
        }

        Hotel hotel = optionalHotel.get();

        // Jeśli nowy obraz ma być główny, usuń flagę isPrimary z istniejących obrazów
        if (isPrimary != null && isPrimary) {
            List<HotelImage> existingImages = hotelImageRepository.findByHotel(hotel);
            existingImages.forEach(img -> img.setIsPrimary(false));
            hotelImageRepository.saveAll(existingImages);
        }

        HotelImage newImage = new HotelImage();
        newImage.setHotel(hotel);
        newImage.setFilePath(filePath);
        newImage.setAltText(altText);
        newImage.setIsPrimary(isPrimary);

        return hotelImageRepository.save(newImage);
    }

    public boolean deleteImage(Long imageId) {
        Optional<HotelImage> optionalImage = hotelImageRepository.findById(imageId);
        if (optionalImage.isEmpty()) {
            return false;
        }

        hotelImageRepository.deleteById(imageId);
        return true;
    }

    public HotelImage updateImage(Long imageId, String filePath, String altText, Boolean isPrimary) {
        Optional<HotelImage> optionalImage = hotelImageRepository.findById(imageId);
        if (optionalImage.isEmpty()) {
            return null;
        }

        HotelImage image = optionalImage.get();

        // Jeśli ten obraz ma być ustawiony jako główny
        if (isPrimary != null && isPrimary && (image.getIsPrimary() == null || !image.getIsPrimary())) {
            // Usuń flagę isPrimary z innych obrazów tego hotelu
            List<HotelImage> hotelImages = hotelImageRepository.findByHotel(image.getHotel());
            hotelImages.forEach(img -> {
                if (!img.getId().equals(imageId)) {
                    img.setIsPrimary(false);
                }
            });
            hotelImageRepository.saveAll(hotelImages);
        }

        if (filePath != null) {
            image.setFilePath(filePath);
        }

        if (altText != null) {
            image.setAltText(altText);
        }

        if (isPrimary != null) {
            image.setIsPrimary(isPrimary);
        }

        return hotelImageRepository.save(image);
    }
}
