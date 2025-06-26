package pl.juhas.backend.management;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.juhas.backend.amenity.dto.AdminAmenityResponse;
import pl.juhas.backend.amenity.dto.AmenityResponse;
import pl.juhas.backend.hotel.LocaleType;
import pl.juhas.backend.hotel.dto.HotelCreateRequest;
import pl.juhas.backend.hotel.dto.HotelSearchResponse;
import pl.juhas.backend.user.dto.UserResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1/management")
public class ManagementController {
    private final ManagementService managementService;

    public ManagementController(ManagementService managementService) {
        this.managementService = managementService;
    }

    @GetMapping("/hotels")
    public ResponseEntity<Page<HotelSearchResponse>> getHotels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sort) {

        return ResponseEntity.ok(managementService.getHotels(page, size, sort));
    }

    @PostMapping("/hotels")
    public ResponseEntity<HotelSearchResponse> createHotel(@RequestBody HotelCreateRequest hotelRequest) {
        try {
            HotelSearchResponse createdHotel = managementService.createHotel(hotelRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdHotel);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/hotels/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        try {
            managementService.deleteHotel(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
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

    @PutMapping("/users/{email}")
    public ResponseEntity<UserResponse> updateUserRole(@PathVariable String email, @RequestBody UserResponse userRequest) {
        return ResponseEntity.ok(managementService.updateUser(email, userRequest));
    }

    @GetMapping("/amenities/{locale}")
    public ResponseEntity<List<AdminAmenityResponse>> getAmenities(@PathVariable LocaleType locale) {
        return ResponseEntity.ok(managementService.getAmenities(locale.name()));
    }

}
