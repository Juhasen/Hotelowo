package pl.juhas.backend.hotel;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.juhas.backend.address.Address;
import pl.juhas.backend.address.AddressRequest;
import pl.juhas.backend.address.AddressRepository;
import pl.juhas.backend.amenity.Amenity;
import pl.juhas.backend.amenity.AmenityRepository;
import pl.juhas.backend.hotel.dto.HotelRequest;
import pl.juhas.backend.hotel.dto.HotelResponse;
import pl.juhas.backend.hotel.dto.HotelSearchRequest;
import pl.juhas.backend.hotel.dto.HotelSearchResponse;
import pl.juhas.backend.hotelImage.HotelImage;
import pl.juhas.backend.hotelImage.HotelImageRepository;
import pl.juhas.backend.hotelImage.HotelImageRequest;

import java.time.LocalDate;
import java.util.*;


@Service
@AllArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;

    private final AddressRepository addressRepository;

    private final AmenityRepository amenityRepository;

    private final HotelImageRepository hotelImageRepository;

    @Transactional(readOnly = true)
    public Page<HotelSearchResponse> getHotels(String locale, HotelSearchRequest hotelRequest, Pageable pageable) {
        if (!locale.equals("pl") && !locale.equals("en")) {
            return Page.empty(pageable);
        }

        try {
            LocalDate checkInDate = null;
            LocalDate checkOutDate = null;

            if (hotelRequest.checkInDate() != null && !hotelRequest.checkInDate().isEmpty()) {
                checkInDate = LocalDate.parse(hotelRequest.checkInDate());
            }

            if (hotelRequest.checkOutDate() != null && !hotelRequest.checkOutDate().isEmpty()) {
                checkOutDate = LocalDate.parse(hotelRequest.checkOutDate());
            }

            // Jeśli nie podano dat, zwracamy pustą stronę
            if (checkInDate == null || checkOutDate == null) {
                return Page.empty(pageable);
            }

            // Walidacja dat
            if (checkInDate.isAfter(checkOutDate)) {
                return Page.empty(pageable);
            }

            Integer guestCount = hotelRequest.numberOfGuests() != null ? hotelRequest.numberOfGuests() : 1;

            return hotelRepository.findAvailableHotels(
                hotelRequest.country(),
                checkInDate,
                checkOutDate,
                guestCount,
                pageable
            );

        } catch (Exception e) {
            return Page.empty(pageable);
        }
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
        AddressRequest addressRequest = hotel.address();
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

            // Znajdź główny obraz jeśli istnieje
            boolean hasPrimaryImage = hotel.images().stream()
                    .anyMatch(img -> img.isPrimary() != null && img.isPrimary());

            for (HotelImageRequest imageDTO : hotel.images()) {
                // Przy tworzeniu hotelu zawsze tworzymy nowe obrazy, ignorując ewentualnie podane id
                HotelImage hotelImage = new HotelImage()
                        .withFilePath(imageDTO.filePath())
                        .withAltText(imageDTO.altText())
                        .withIsPrimary(imageDTO.isPrimary())
                        .withHotel(savedHotel);

                // Jeśli nie ma głównego obrazu, ustaw pierwszy jako główny
                if (!hasPrimaryImage && hotelImages.isEmpty()) {
                    hotelImage.setIsPrimary(true);
                }

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

        if (hotel.images() != null && !hotel.images().isEmpty()) {

            List<HotelImage> existingImages = hotelImageRepository.findByHotel(existingHotel);

            if (existingImages != null && !existingImages.isEmpty()) {
                hotelImageRepository.deleteAll(existingImages);
                existingHotel.setImages(new ArrayList<>());
            }

            List<HotelImage> newImages = new ArrayList<>();

            boolean hasPrimaryImage = hotel.images().stream()
                    .anyMatch(img -> img.isPrimary() != null && img.isPrimary());

            for (int i = 0; i < hotel.images().size(); i++) {
                HotelImageRequest imageReq = hotel.images().get(i);

                HotelImage newImage = new HotelImage()
                        .withFilePath(imageReq.filePath())
                        .withAltText(imageReq.altText())
                        .withIsPrimary(imageReq.isPrimary())
                        .withHotel(existingHotel);

                // Jeśli nie ma głównego obrazu, ustaw pierwszy jako główny
                if (!hasPrimaryImage && i == 0) {
                    newImage.setIsPrimary(true);
                }

                newImages.add(newImage);
            }

            hotelImageRepository.saveAll(newImages);
            existingHotel.setImages(newImages);
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
