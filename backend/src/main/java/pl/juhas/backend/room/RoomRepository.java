package pl.juhas.backend.room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    @Query("""
            SELECT r FROM Room r
            WHERE r.hotel.id = :hotelId
            AND r NOT IN (
                SELECT b.room FROM Reservation b
                WHERE b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate
            )
            AND r.capacity >= :capacity
            """)
    List<Room> findAvailableRooms(Long hotelId, LocalDate checkInDate, LocalDate checkOutDate, Integer capacity);
}
