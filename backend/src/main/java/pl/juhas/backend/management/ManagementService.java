package pl.juhas.backend.management;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.juhas.backend.amenity.AmenityRepository;
import pl.juhas.backend.amenity.dto.AmenityResponse;
import pl.juhas.backend.hotel.Hotel;
import pl.juhas.backend.hotel.HotelRepository;
import pl.juhas.backend.hotel.dto.HotelSearchResponse;
import pl.juhas.backend.reservation.ReservationRepository;
import pl.juhas.backend.token.TokenRepository;
import pl.juhas.backend.user.User;
import pl.juhas.backend.user.UserRepository;
import pl.juhas.backend.user.dto.UserResponse;

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

    public List<AmenityResponse> getAmenities(String locale) {
        return amenityRepository.findAll().stream()
                .map(amenity -> {
                    String name = locale.equals("pl")
                            ? amenity.getName_pl()
                            : amenity.getName_en();
                    return new AmenityResponse(name, amenity.getIcon());
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
}
