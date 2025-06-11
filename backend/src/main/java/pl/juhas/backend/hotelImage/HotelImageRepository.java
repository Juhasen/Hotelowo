package pl.juhas.backend.hotelImage;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.juhas.backend.hotel.Hotel;

import java.util.List;

public interface HotelImageRepository extends JpaRepository<HotelImage, Long> {

    List<HotelImage> findByHotel(Hotel hotel);

    List<HotelImage> findByHotelId(Long hotelId);

}
