package pl.juhas.backend.hotel;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/hotel")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService service;
    
    @GetMapping("/{locale}")
    public ResponseEntity<List<HotelResponse>> getAllHotels(@PathVariable String locale) {
        if (!locale.equals("pl") && !locale.equals("en")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(List.of());
        }
        return ResponseEntity.ok(service.getAllHotels(locale));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createHotel(
            @RequestBody CreateHotelRequest request
    ) {
        Boolean res = service.createHotel(request);
        if (!res) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid hotel data provided.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}