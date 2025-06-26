package pl.juhas.backend.management;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.juhas.backend.amenity.dto.AmenityResponse;
import pl.juhas.backend.hotel.LocaleType;

import java.util.List;

@RestController
@RequestMapping("/api/v1/management")
public class ManagementController {
    private final ManagementService managementService;

    public ManagementController(ManagementService managementService) {
        this.managementService = managementService;
    }

    @GetMapping("/amenities/{locale}")
    public ResponseEntity<List<AmenityResponse>> getAmenities(@PathVariable LocaleType locale) {
        return ResponseEntity.ok(managementService.getAmenities(locale.name()));
    }

    @PostMapping("/create/hotel")
    public String createHotel() {
        // Logic to create a hotel
        return "Hotel created successfully";
    }

    @PostMapping("/create/room")
    public String createRoom() {
        // Logic to create a room
        return "Room created successfully";
    }

    @PostMapping("/create/amenity")
    public String createAmenity() {
        // Logic to create an amenity
        return "Amenity created successfully";
    }

    @DeleteMapping("/delete/hotel")
    public String deleteHotel() {
        // Logic to delete a hotel
        return "Hotel deleted successfully";
    }

    @DeleteMapping("/delete/room")
    public String deleteRoom() {
        // Logic to delete a room
        return "Room deleted successfully";
    }

    @DeleteMapping("/delete/amenity")
    public String deleteAmenity() {
        // Logic to delete an amenity
        return "Amenity deleted successfully";
    }

    @PatchMapping("/update/hotel")
    public String updateHotel() {
        // Logic to update a hotel
        return "Hotel updated successfully";
    }

    @PatchMapping("/update/room")
    public String updateRoom() {
        // Logic to update a room
        return "Room updated successfully";
    }

    @PatchMapping("/update/amenity")
    public String updateAmenity() {
        // Logic to update an amenity
        return "Amenity updated successfully";
    }

    @PatchMapping("/update/reservation")
    public String updateReservation() {
        // Logic to update an amenity
        return "Amenity updated successfully";
    }
}
