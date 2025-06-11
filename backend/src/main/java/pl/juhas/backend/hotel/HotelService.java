package pl.juhas.backend.hotel;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.juhas.backend.address.Address;
import pl.juhas.backend.address.AddressDTO;
import pl.juhas.backend.address.AddressRepository;
import pl.juhas.backend.amenity.Amenity;
import pl.juhas.backend.amenity.AmenityRepository;
import pl.juhas.backend.hotelImage.HotelImage;
import pl.juhas.backend.hotelImage.HotelImageDTO;
import pl.juhas.backend.hotelImage.HotelImageRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@AllArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;

    private final AddressRepository addressRepository;

    private final AmenityRepository amenityRepository;

    private final HotelImageRepository hotelImageRepository;

    @Transactional(readOnly = true)
    public List<HotelResponse> getAllHotels(String locale) {
        List<Hotel> hotels = hotelRepository.findAll();

        if (hotels.isEmpty() || (!locale.equals("pl") && !locale.equals("en"))) {
            return List.of();
        }

        return hotels.stream()
                .map(hotel -> HotelMapper.toResponse(hotel, locale))
                .toList();
    }

    public HotelResponse getHotelById(String locale, Long id) {
        Optional<Hotel> existingHotel = hotelRepository.findById(id);
        if (existingHotel.isEmpty()) {
            return null;
        }
        Hotel hotel = existingHotel.get();

        return HotelMapper.toResponse(hotel, locale);
    }

    @Transactional
    public Boolean createHotel(HotelRequest hotel) {

        //1. Save address
        Address address;
        AddressDTO addressRequest = hotel.address();
        if (addressRequest != null) {
            address = new Address()
                    .withStreet(addressRequest.street())
                    .withCity(addressRequest.city())
                    .withPostalCode(addressRequest.postalCode())
                    .withLatitude(addressRequest.latitude())
                    .withLongitude(addressRequest.longitude());
            addressRepository.save(address);
        } else {
            return false;
        }


        //2. Search for amenities
        List<Amenity> amenities = null;

        if (hotel.amenityIds() != null && hotel.amenityIds().length > 0) {
            amenities = amenityRepository.findAmenitiesByIds(hotel.amenityIds());
        }

        //3. Create hotel without images first
        Hotel newHotel = new Hotel()
                .withName(hotel.name())
                .withDescription_pl(hotel.description_pl())
                .withDescription_en(hotel.description_en())
                .withPhone(hotel.phone())
                .withEmail(hotel.email())
                .withWebsite(hotel.website())
                .withRating(null) // Rating is null until set by the review system
                .withIsAvailableSearch(hotel.isAvailableSearch())
                .withAmenities(amenities)
                .withAddress(address)
                .withImages(new ArrayList<>());

        // Save hotel to generate ID
        Hotel savedHotel = hotelRepository.save(newHotel);

        //4. Create and save hotel images if provided
        if (hotel.images() != null && !hotel.images().isEmpty()) {
            List<HotelImage> hotelImages = new ArrayList<>();

            for (HotelImageDTO imageDTO : hotel.images()) {
                HotelImage hotelImage = new HotelImage()
                        .withFilePath(imageDTO.filePath())
                        .withAltText(imageDTO.altText())
                        .withIsPrimary(imageDTO.isPrimary())
                        .withHotel(savedHotel);
                hotelImages.add(hotelImage);
            }

            // Save all images
            hotelImageRepository.saveAll(hotelImages);

            // Update hotel with images
            savedHotel.setImages(hotelImages);
            hotelRepository.save(savedHotel);
        }

        return true;
    }

    @Transactional
    public Boolean updateHotel(Long id, HotelRequest hotel) {
        Optional<Hotel> optionalHotel = hotelRepository.findById(id);
        if (optionalHotel.isEmpty()) {
            return false;
        }

        Hotel existingHotel = optionalHotel.get();

        // Update address
        Address address = existingHotel.getAddress();
        if (hotel.address() != null) {
            address.setStreet(hotel.address().street());
            address.setCity(hotel.address().city());
            address.setPostalCode(hotel.address().postalCode());
            address.setLatitude(hotel.address().latitude());
            address.setLongitude(hotel.address().longitude());
            addressRepository.save(address);
        }

        // Update amenities
        List<Amenity> amenities = null;
        if (hotel.amenityIds() != null && hotel.amenityIds().length > 0) {
            amenities = amenityRepository.findAmenitiesByIds(hotel.amenityIds());
        }

        // Update basic hotel information
        existingHotel.setName(hotel.name());
        existingHotel.setDescription_pl(hotel.description_pl());
        existingHotel.setDescription_en(hotel.description_en());
        existingHotel.setPhone(hotel.phone());
        existingHotel.setEmail(hotel.email());
        existingHotel.setWebsite(hotel.website());
        existingHotel.setIsAvailableSearch(hotel.isAvailableSearch());
        existingHotel.setAmenities(amenities);

        // Handle images - remove existing images if there are new ones
        if (hotel.images() != null && !hotel.images().isEmpty()) {
            // Clear existing images that are not in the new list
            List<HotelImage> existingImages = existingHotel.getImages();
            if (existingImages != null) {
                // Create a map of ID to existing images for faster lookup
                List<Long> newImageIds = hotel.images().stream()
                        .filter(img -> img.id() != null)
                        .map(HotelImageDTO::id)
                        .toList();

                // Remove images that are not in the new list
                List<HotelImage> imagesToRemove = existingImages.stream()
                        .filter(image -> image.getId() != null &&
                                !newImageIds.contains(image.getId()))
                        .toList();

                for (HotelImage image : imagesToRemove) {
                    existingHotel.getImages().remove(image);
                }
            }

            // Add or update images
            for (HotelImageDTO imageDTO : hotel.images()) {
                if (imageDTO.id() == null) {
                    // Create new image
                    HotelImage newImage = new HotelImage()
                            .withFilePath(imageDTO.filePath())
                            .withAltText(imageDTO.altText())
                            .withIsPrimary(imageDTO.isPrimary())
                            .withHotel(existingHotel);

                    hotelImageRepository.save(newImage);
                    existingHotel.getImages().add(newImage);
                } else {
                    // Update existing image
                    Optional<HotelImage> existingImage = existingHotel.getImages().stream()
                            .filter(img -> img.getId().intValue() == imageDTO.id())
                            .findFirst();

                    if (existingImage.isPresent()) {
                        HotelImage image = existingImage.get();
                        image.setFilePath(imageDTO.filePath());
                        image.setAltText(imageDTO.altText());
                        image.setIsPrimary(imageDTO.isPrimary());
                        hotelImageRepository.save(image);
                    }
                }
            }
        }

        hotelRepository.save(existingHotel);
        return true;
    }

    public Boolean deleteHotel(Long id) {
        Optional<Hotel> optionalHotel = hotelRepository.findById(id);
        if (optionalHotel.isEmpty()) {
            return false;
        }

        Hotel hotel = optionalHotel.get();
        hotelRepository.delete(hotel);
        return true;
    }
}
