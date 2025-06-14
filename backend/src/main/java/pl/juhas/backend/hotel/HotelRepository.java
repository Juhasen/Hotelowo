package pl.juhas.backend.hotel;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.juhas.backend.hotel.dto.HotelSearchResponse;

import java.time.LocalDate;

public interface HotelRepository extends JpaRepository<Hotel, Long> {

    @Query(value = """
            SELECT new pl.juhas.backend.hotel.dto.HotelSearchResponse(
                h.id,\s
                h.name,\s
                COALESCE((SELECT img.filePath FROM HotelImage img WHERE img.hotel = h AND img.isPrimary = true),\s
                         (SELECT img2.filePath FROM HotelImage img2 WHERE img2.hotel = h ORDER BY img2.id ASC LIMIT 1)),\s
                CAST(h.rating AS string),\s
                CAST((SELECT MIN(r3.pricePerNight) FROM Room r3 WHERE r3.hotel = h AND r3.capacity >= :guestCount) AS string),
                CAST(:guestCount AS string)
            )
            FROM Hotel h
            WHERE h.isAvailableSearch = true
            AND (:country IS NULL OR h.address.city = :country)
            AND EXISTS (
                SELECT r2 FROM Room r2
                WHERE r2.hotel = h
                AND r2.capacity >= :guestCount
                AND NOT EXISTS (
                    SELECT res FROM Reservation res
                    WHERE res.room = r2
                    AND res.status != pl.juhas.backend.reservation.Status.CANCELED
                    AND (
                        (res.checkInDate <= :checkOutDate AND res.checkOutDate >= :checkInDate)
                    )
                )
            )
            ORDER BY h.rating DESC NULLS LAST
           \s""")
    Page<HotelSearchResponse> findAvailableHotels(
            @Param("country") String country,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate,
            @Param("guestCount") Integer guestCount,
            Pageable pageable
    );

}
