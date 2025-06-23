package pl.juhas.backend.room;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import pl.juhas.backend.room.dto.RoomRequest;
import pl.juhas.backend.room.dto.RoomResponse;
import pl.juhas.backend.utils.DateParser;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
@AllArgsConstructor
public class RoomService {
    private final RoomRepository repository;


    public List<RoomResponse> getRooms(RoomRequest roomRequest) {

        List<LocalDate> checkInOutDates = DateParser.parseCheckDates(roomRequest.checkInDate(), roomRequest.checkOutDate());
        if (checkInOutDates.isEmpty()) {
            System.out.println("Invalid check-in or check-out date format");
            return List.of();
        }

        Long hotelId = roomRequest.hotelId();
        LocalDate checkInDate = checkInOutDates.getFirst();
        LocalDate checkOutDate = checkInOutDates.get(1);
        Integer capacity = roomRequest.capacity();

        List<RoomResponse> rooms = repository.findAvailableRooms(hotelId, checkInDate, checkOutDate, capacity)
                .stream()
                .map(RoomMapper::toResponse)
                .toList();

        return List.of();
    }

    private LocalDate parseDate(String dateStr, DateTimeFormatter[] formatters) {
        for (DateTimeFormatter formatter : formatters) {
            try {
                return LocalDate.parse(dateStr, formatter);
            } catch (DateTimeParseException e) {
                // Próbuj kolejnego formatu
            }
        }
        return null; // Żaden format nie pasuje
    }
}
