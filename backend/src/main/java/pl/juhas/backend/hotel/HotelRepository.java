package pl.juhas.backend.hotel;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.juhas.backend.hotel.dto.HotelSearchResponse;

import java.time.LocalDateTime;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

    @Query("""
                SELECT new pl.juhas.backend.hotel.dto.HotelSearchResponse(
                     h.id,
                     h.name,
                     COALESCE((SELECT img.filePath
                               FROM HotelImage img
                               WHERE img.hotel = h AND img.isPrimary = true),
                              ''),
                     COALESCE(h.rating, 0.0),
                     COALESCE((SELECT MIN(r3.pricePerNight)
                               FROM Room r3
                               WHERE r3.hotel = h
                                 AND r3.capacity >= :guestCount),
                              0.0),
                     h.stars,
                     h.address.latitude,
                     h.address.longitude
                )
                FROM Hotel h
                WHERE h.isAvailableSearch = true
                  AND h.address.country = :country
                  AND EXISTS (
                      SELECT r2
                      FROM Room r2
                      WHERE r2.hotel = h
                        AND r2.capacity >= :guestCount
                        AND NOT EXISTS (
                            SELECT res
                            FROM Reservation res
                            WHERE res.room = r2
                              AND res.status != pl.juhas.backend.reservation.Status.CANCELED
                              AND res.checkInDate <= :checkOutDate
                              AND res.checkOutDate >= :checkInDate
                        )
                  )
            """)
    Page<HotelSearchResponse> findAvailableHotels(
            @Param("country")    String   country,
            @Param("checkInDate") LocalDateTime checkInDate,
            @Param("checkOutDate") LocalDateTime checkOutDate,
            @Param("guestCount")   Integer guestCount,
            Pageable pageable
    );

}
