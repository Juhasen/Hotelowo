package pl.juhas.backend.review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("""
            SELECT AVG(r.rating)
            FROM Review r
            WHERE r.hotel.id = :hotelId
            """)
    Optional<BigDecimal> findAverageRatingByHotelId(Long hotelId);
}
