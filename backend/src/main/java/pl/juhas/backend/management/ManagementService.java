package pl.juhas.backend.management;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.juhas.backend.amenity.Amenity;
import pl.juhas.backend.amenity.AmenityRepository;
import pl.juhas.backend.amenity.dto.AmenityResponse;
import pl.juhas.backend.hotel.LocaleType;
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
}
