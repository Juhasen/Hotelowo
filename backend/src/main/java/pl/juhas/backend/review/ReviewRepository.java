package pl.juhas.backend.review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.juhas.backend.reservation.Reservation;
import pl.juhas.backend.user.User;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("""
            SELECT AVG(r.rating)
            FROM Review r
            WHERE r.hotel.id = :hotelId
            """)
    Optional<BigDecimal> findAverageRatingByHotelId(Long hotelId);

    @Query("""
            SELECT COUNT(r)
            FROM Review r
            WHERE r.hotel.id = :hotelId
            AND r.user = :user
            """)
    Long countByUserAndReservation(User user, Long hotelId);

    @Query("SELECT r FROM Review r WHERE r.hotel.id = :hotelId ORDER BY RANDOM() LIMIT 3")
    List<Review> findRandomReviewsByHotelId(@Param("hotelId") Long hotelId);
}
