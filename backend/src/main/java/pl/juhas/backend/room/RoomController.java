package pl.juhas.backend.room;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.juhas.backend.room.dto.RoomResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1/room")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService service;


    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<?> getRooms(@PathVariable Long hotelId,
                                      @RequestParam String checkInDate,
                                      @RequestParam String checkOutDate,
                                      @RequestParam Integer capacity) {
        List<RoomResponse> rooms = service.getRooms(hotelId, checkInDate, checkOutDate, capacity);
        if (rooms.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(rooms);
    }

}
