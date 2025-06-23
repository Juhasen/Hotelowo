package pl.juhas.backend.room;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.juhas.backend.room.dto.RoomRequest;
import pl.juhas.backend.room.dto.RoomResponse;
import pl.juhas.backend.utils.DateParser;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class RoomService {
    private final RoomRepository repository;


    public List<RoomResponse> getRooms(Long hotelId, String checkInDate, String checkOutDate, Integer capacity) {

        if(hotelId == null || checkInDate == null || checkOutDate == null || capacity == null) {
            System.out.println("Invalid input parameters");
            return List.of();
        }
        
        List<LocalDate> checkInOutDates = DateParser.parseCheckDates(checkInDate, checkOutDate);
        if (checkInOutDates.isEmpty()) {
            System.out.println("Invalid check-in or check-out date format");
            return List.of();
        }

        LocalDate parsedCheckInDate = checkInOutDates.getFirst();
        LocalDate parsedCheckOutDate = checkInOutDates.get(1);


        long daysDifference = parsedCheckInDate.until(parsedCheckOutDate).getDays();

        return repository.findAvailableRooms(hotelId, parsedCheckInDate, parsedCheckOutDate, capacity)
                .stream()
                .map(RoomMapper.toResponse(daysDifference))
                .toList();
    }
}
