package pl.juhas.backend.review;

import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import pl.juhas.backend.hotel.Hotel;
import pl.juhas.backend.hotel.HotelRepository;
import pl.juhas.backend.reservation.Reservation;
import pl.juhas.backend.reservation.ReservationRepository;
import pl.juhas.backend.review.dto.ReviewRequest;
import pl.juhas.backend.user.User;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;
    private final HotelRepository hotelRepository;

    public void saveReview(Review review) {
        reviewRepository.save(review);
    }

    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ReviewNotFoundException("Review not found with id: " + id));
    }

    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ReviewNotFoundException("Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }

    public void createReview(ReviewRequest request, Principal connectedUser) {
        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        Optional<Reservation> reservation = reservationRepository.findById(request.reservationId());
        if (reservation.isEmpty()) {
            throw new IllegalArgumentException("Reservation not found with id: " + request.reservationId());
        }

        Review review = new Review();
        review.setRating(request.rating());
        review.setComment(request.comment());
        review.setUser(user);
        review.setHotel(reservation.get().getRoom().getHotel());
        saveReview(review);
        updateHotelRating(reservation.get().getRoom().getHotel().getId());
    }

    private void updateHotelRating(Long hotelId) {
        BigDecimal averageRating = reviewRepository.findAverageRatingByHotelId(hotelId)
                .orElse(BigDecimal.valueOf(0.0));

        Hotel hotel = hotelRepository.findHotelById(hotelId)
                .orElseThrow(() -> new IllegalArgumentException("Hotel not found with id: " + hotelId));

        hotel.setRating(averageRating);
        hotelRepository.save(hotel);
    }
}
