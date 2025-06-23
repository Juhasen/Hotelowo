package pl.juhas.backend.room;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.juhas.backend.room.dto.RoomRequest;
import pl.juhas.backend.room.dto.RoomResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1/room")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService service;


    @GetMapping()
    public ResponseEntity<?> getRooms(@RequestBody RoomRequest roomRequest) {
        List<RoomResponse> rooms = service.getRooms(roomRequest);
        if (rooms.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(rooms);
    }

}
