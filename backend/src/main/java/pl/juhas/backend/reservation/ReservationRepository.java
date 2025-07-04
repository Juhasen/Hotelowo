package pl.juhas.backend.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.juhas.backend.user.User;
import pl.juhas.backend.hotel.Hotel;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {



    @Query("""
    SELECT DISTINCT
        r.id,
        r.user,
        r.status,
        r.checkInDate,
        r.checkOutDate,
        r.nights,
        r.totalPrice,
        r.createdAt
    FROM Reservation r
    WHERE r.room.hotel.id = :hotelId
      AND r.room.number = :roomNumber
      AND (
          (r.checkInDate = :checkOutDate AND r.checkOutDate = :checkInDate)
      )
""")
    Reservation findReservationsByHotelIdAndRoomBetweenDates(
            Long hotelId,
            String roomNumber,
            LocalDateTime checkInDate,
            LocalDateTime checkOutDate
    );

    List<Reservation> findByUser(User user);

    void deleteAllByUserId(Integer user_id);

}
