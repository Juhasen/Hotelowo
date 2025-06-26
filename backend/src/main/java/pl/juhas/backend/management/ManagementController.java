package pl.juhas.backend.management;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.juhas.backend.amenity.dto.AmenityResponse;
import pl.juhas.backend.hotel.LocaleType;
import pl.juhas.backend.user.dto.UserResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1/management")
public class ManagementController {
    private final ManagementService managementService;

    public ManagementController(ManagementService managementService) {
        this.managementService = managementService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(managementService.getUsers());
    }

    @DeleteMapping("/users/{email}")
    public ResponseEntity<Void> deleteUser(@PathVariable String email) {
        managementService.deleteUser(email);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/amenities/{locale}")
    public ResponseEntity<List<AmenityResponse>> getAmenities(@PathVariable LocaleType locale) {
        return ResponseEntity.ok(managementService.getAmenities(locale.name()));
    }

}
