package pl.juhas.backend.management;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.juhas.backend.amenity.Amenity;
import pl.juhas.backend.amenity.AmenityRepository;
import pl.juhas.backend.amenity.dto.AmenityResponse;
import pl.juhas.backend.hotel.LocaleType;
import pl.juhas.backend.user.UserRepository;
import pl.juhas.backend.user.dto.UserResponse;

import java.util.List;
import java.util.stream.Collectors;

import static java.util.Arrays.stream;

@Service
@AllArgsConstructor
public class ManagementService {
    private final AmenityRepository amenityRepository;
    private final UserRepository userRepository;

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

    public void deleteUser(String email) {
        userRepository.findByEmail(email)
                .ifPresent(userRepository::delete);
    }
}
