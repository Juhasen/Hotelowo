package pl.juhas.backend.hotel;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.juhas.backend.address.Address;
import pl.juhas.backend.address.AddressRepository;
import pl.juhas.backend.amenity.Amenity;
import pl.juhas.backend.amenity.AmenityRepository;

import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@Service
@AllArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;

    private final AddressRepository addressRepository;

    private final AmenityRepository amenityRepository;

    @Transactional(readOnly = true)
    public List<HotelResponse> getAllHotels() {
        List<Hotel> hotels = hotelRepository.findAll();

        if (hotels.isEmpty()) {
            return List.of();
        }

        return hotels.stream()
                .map(HotelMapper::toResponse)
                .toList();
    }

    public Optional<Hotel> getHotelById(Integer id) {
        return hotelRepository.findById(id);
    }

    public Boolean createHotel(CreateHotelRequest hotel) {

        //1. Save address
        Address address;
        if (hotel.latitude() != null && hotel.longitude() != null) {
            address = new Address()
                    .withStreet(hotel.street())
                    .withCity(hotel.city())
                    .withPostalCode(hotel.postalCode())
                    .withLatitude(hotel.latitude())
                    .withLongitude(hotel.longitude());
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

}
