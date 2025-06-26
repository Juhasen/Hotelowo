package pl.juhas.backend.management;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.juhas.backend.amenity.Amenity;
import pl.juhas.backend.amenity.AmenityRepository;
import pl.juhas.backend.amenity.dto.AmenityResponse;
import pl.juhas.backend.hotel.LocaleType;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ManagementService {
    private final AmenityRepository amenityRepository;

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

}
