package pl.juhas.backend.hotel;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.juhas.backend.address.Address;
import pl.juhas.backend.address.AddressDTO;
import pl.juhas.backend.address.AddressRepository;
import pl.juhas.backend.amenity.Amenity;
import pl.juhas.backend.amenity.AmenityRepository;

import java.util.List;
import java.util.Optional;


@Service
@AllArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;

    private final AddressRepository addressRepository;

    private final AmenityRepository amenityRepository;

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

    public Optional<Hotel> getHotelById(Integer id) {
        return hotelRepository.findById(id);
    }

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
                .withAddress(address);

        hotelRepository.save(newHotel);
        return true;
    }

    public Boolean updateHotel(Integer id, HotelRequest hotel) {
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

        existingHotel.setName(hotel.name());
        existingHotel.setDescription_pl(hotel.description_pl());
        existingHotel.setDescription_en(hotel.description_en());
        existingHotel.setPhone(hotel.phone());
        existingHotel.setEmail(hotel.email());
        existingHotel.setWebsite(hotel.website());
        existingHotel.setIsAvailableSearch(hotel.isAvailableSearch());
        existingHotel.setAmenities(amenities);

        hotelRepository.save(existingHotel);
        return true;
    }

    public Boolean deleteHotel(Integer id) {
        Optional<Hotel> optionalHotel = hotelRepository.findById(id);
        if (optionalHotel.isEmpty()) {
            return false;
        }

        Hotel hotel = optionalHotel.get();
        hotelRepository.delete(hotel);
        return true;
    }
}
