package pl.juhas.backend.management;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.juhas.backend.address.Address;
import pl.juhas.backend.address.AddressRepository;
import pl.juhas.backend.amenity.Amenity;
import pl.juhas.backend.amenity.AmenityRepository;
import pl.juhas.backend.amenity.dto.AdminAmenityResponse;

import pl.juhas.backend.hotel.Hotel;
import pl.juhas.backend.room.Room;
import pl.juhas.backend.hotel.HotelRepository;
import pl.juhas.backend.hotel.dto.HotelCreateRequest;
import pl.juhas.backend.hotel.dto.HotelSearchResponse;
import pl.juhas.backend.hotelImage.HotelImage;
import pl.juhas.backend.hotelImage.HotelImageRepository;
import pl.juhas.backend.reservation.ReservationRepository;
import pl.juhas.backend.room.RoomRepository;
import pl.juhas.backend.token.TokenRepository;
import pl.juhas.backend.user.User;
import pl.juhas.backend.user.UserRepository;
import pl.juhas.backend.user.dto.UserResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class ManagementService {
    private final AmenityRepository amenityRepository;
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final TokenRepository tokenRepository;
    private final HotelRepository hotelRepository;
    private final HotelImageRepository hotelImageRepository;
    private final AddressRepository addressRepository;
    private final RoomRepository roomRepository;

    public List<AdminAmenityResponse> getAmenities(String locale) {
        return amenityRepository.findAll().stream()
                .map(amenity -> {
                    String name = locale.equals("pl")
                            ? amenity.getName_pl()
                            : amenity.getName_en();
                    return new AdminAmenityResponse(amenity.getId(), name);
                })
                .collect(Collectors.toList());
    }

    public List<UserResponse> getUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getFirstname(),
                        user.getLastname(),
                        user.getEmail(),
                        user.getPhoneNumber(),
                        user.getRole()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(String email) {
        // Znajdź użytkownika
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Użytkownik o emailu " + email + " nie został znaleziony"));

        // Usuń wszystkie tokeny użytkownika
        tokenRepository.deleteAllByUserId(user.getId());
        // Usuń wszystkie rezerwacje użytkownika
        reservationRepository.deleteAllByUserId(user.getId());

        // Teraz możesz bezpiecznie usunąć użytkownika
        userRepository.delete(user);
    }

    public UserResponse updateUser(String email, UserResponse userRequest) {
        // Znajdź użytkownika
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Użytkownik o emailu " + email + " nie został znaleziony"));

        // Zaktualizuj dane użytkownika
        user.setFirstname(userRequest.firstname());
        user.setLastname(userRequest.lastname());
        user.setPhoneNumber(userRequest.phoneNumber());
        user.setRole(userRequest.role());

        // Zapisz zmiany
        userRepository.save(user);

        return new UserResponse(
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole()
        );
    }

    public Page<HotelSearchResponse> getHotels(int page, int size, String sort) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort));

        Page<Hotel> hotelsPage = hotelRepository.findAll(pageable);

        return hotelsPage.map(hotel -> new HotelSearchResponse(
                hotel.getId(),
                hotel.getName(),
                hotelRepository.findMainImageForHotel(hotel.getId()),
                hotel.getRating(),
                null,
                hotel.getStars(),
                null,
                null
        ));
    }

    public void deleteHotel(Long id) {
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Hotel o ID " + id + " nie został znaleziony"));

        // Usuń hotel
        hotelRepository.delete(hotel);
    }

    @Transactional
    public HotelSearchResponse createHotel(HotelCreateRequest request) {
        // 1. Ustawienie podstawowych pól
        Hotel hotel = new Hotel();
        hotel.setName(request.name());
        hotel.setStars(request.stars());
        hotel.setRating(BigDecimal.valueOf(0.0));
        hotel.setDescription_pl(request.description_pl());
        hotel.setDescription_en(request.description_en());
        hotel.setPhone(request.phone());
        hotel.setEmail(request.email());
        hotel.setWebsite(request.website());
        hotel.setIsAvailableSearch(request.isAvailableSearch());
        hotelRepository.save(hotel);

        // Dla każdego pokoju w hotelu, ustawiamy hotel
        if (request.rooms() != null && !request.rooms().isEmpty()) {
            List<Room> rooms = request.rooms().stream()
                    .map(roomRequest -> {
                        Room room = new Room();
                        room.setNumber(roomRequest.number());
                        room.setType(roomRequest.roomType());
                        room.setCapacity(roomRequest.capacity());
                        room.setPricePerNight(BigDecimal.valueOf(roomRequest.pricePerNight()));
                        room.setHotel(hotel);
                        return room;
                    }).collect(Collectors.toList());
            hotel.setRooms(rooms);
            roomRepository.saveAll(rooms);
        }



        // 2. Adres (z kaskadą w encji Hotel)
        Address address = new Address();
        address.setCountry(request.address().country());
        address.setStreet(request.address().street());
        address.setCity(request.address().city());
        address.setPostalCode(request.address().postalCode());
        address.setLatitude(request.address().latitude());
        address.setLongitude(request.address().longitude());

        addressRepository.save(address);

        hotel.setAddress(address);

        hotelRepository.save(hotel);

        // 3. Amenities
        if (request.amenityIds() != null && !request.amenityIds().isEmpty()) {
            List<Amenity> amenities = amenityRepository.findAllById(request.amenityIds());
            hotel.setAmenities(amenities);
        }

        // 4. Images (kaskada z OneToMany)
        if (request.images() != null && !request.images().isEmpty()) {
            List<HotelImage> images = request.images().stream()
                    .map(img -> {
                        HotelImage hi = new HotelImage();
                        hi.setFilePath(img.filePath());
                        hi.setAltText(img.altText());
                        hi.setIsPrimary(img.isPrimary());
                        hi.setHotel(hotel);
                        hotelImageRepository.save(hi);
                        return hi;
                    }).collect(Collectors.toList());
            hotel.setImages(images);
        }

        // 5. Zapisujemy wszystko na raz
        Hotel saved = hotelRepository.save(hotel);

        // 6. Główne zdjęcie
        String mainImage = hotelRepository.findMainImageForHotel(saved.getId());

        // 7. Odpowiedź
        return new HotelSearchResponse(
                saved.getId(),
                saved.getName(),
                mainImage,
                saved.getRating(),
                null,
                saved.getStars(),
                null,
                null
        );
    }
}
