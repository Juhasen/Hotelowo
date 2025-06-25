package pl.juhas.backend.reservation;

import org.springframework.stereotype.Component;
import pl.juhas.backend.hotel.HotelMapper;
import pl.juhas.backend.hotel.HotelRepository;
import pl.juhas.backend.hotel.LocaleType;
import pl.juhas.backend.hotel.dto.HotelResponse;
import pl.juhas.backend.reservation.dto.ReservationPreviewRequest;
import pl.juhas.backend.reservation.dto.ReservationPreviewResponse;
import pl.juhas.backend.reservation.dto.ReservationRequest;
import pl.juhas.backend.room.RoomMapper;
import pl.juhas.backend.room.RoomRepository;
import pl.juhas.backend.room.dto.RoomResponse;
import pl.juhas.backend.user.User;
import pl.juhas.backend.user.UserMapper;
import pl.juhas.backend.user.UserRepository;
import pl.juhas.backend.user.dto.UserResponse;

import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
public class ReservationMapper {
    private static HotelRepository hotelRepository = null;
    private static RoomRepository roomRepository = null;

    public ReservationMapper(
            HotelRepository hotelRepository,
            RoomRepository roomRepository
    ) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
    }

    public static ReservationPreviewResponse toPreviewResponse(ReservationPreviewRequest request, LocaleType locale, User user, LocalDate startDate, LocalDate endDate) {
        // Pobierz hotel
        var hotel = hotelRepository.findById(request.hotelId())
                .orElseThrow(() -> new ReservationNotFoundException("Hotel not found"));

        // Pobierz pokój
        var room = roomRepository.findByNumberAndHotel(request.roomNumber(), hotel)
                .orElseThrow(() -> new ReservationNotFoundException("Room not found"));


        // Oblicz liczbę nocy
        long nights = ChronoUnit.DAYS.between(startDate, endDate);

        // Oblicz cenę całkowitą
        BigDecimal totalPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        // Tworzenie odpowiedzi
        HotelResponse hotelResponse = HotelMapper.toResponse(hotel, locale.name());
        RoomResponse roomResponse = RoomMapper.toResponse(room, nights);
        UserResponse userResponse = UserMapper.toResponse(user);

        return new ReservationPreviewResponse(
                Status.PENDING, // Domyślny status
                hotelResponse,
                roomResponse,
                userResponse,
                request.checkInDate(),
                request.checkOutDate(),
                (int) nights,
                totalPrice,
                PaymentMethod.CREDIT_CARD, // Domyślna metoda płatności
                LocalDate.now().toString() // Obecna data jako data utworzenia podglądu
        );
    }

    public static Reservation toReservation(ReservationRequest request, User user, LocalDate startDate, LocalDate endDate) {
        // Pobierz hotel
        var hotel = hotelRepository.findById(request.hotelId())
                .orElseThrow(() -> new ReservationNotFoundException("Hotel not found"));

        // Pobierz pokój
        var room = roomRepository.findByNumberAndHotel(request.roomNumber(), hotel)
                .orElseThrow(() -> new ReservationNotFoundException("Room not found"));

        // Oblicz liczbę nocy
        long nights = ChronoUnit.DAYS.between(startDate, endDate);

        // Oblicz cenę całkowitą
        BigDecimal totalPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        return new Reservation(
                user,
                room,
                Status.BOOKED,
                startDate,
                endDate,
                (int) nights,
                totalPrice,
                request.paymentMethod()
        );
    }

    public static ReservationPreviewResponse toResponse(Reservation reservation, LocaleType locale, User user) {
        // Pobierz hotel
        var hotel = hotelRepository.findById(reservation.getRoom().getHotel().getId())
                .orElseThrow(() -> new ReservationNotFoundException("Hotel not found"));

        // Pobierz pokój
        var room = roomRepository.findByNumberAndHotel(reservation.getRoom().getNumber(), hotel)
                .orElseThrow(() -> new ReservationNotFoundException("Room not found"));


        // Tworzenie odpowiedzi
        HotelResponse hotelResponse = HotelMapper.toResponse(hotel, locale.name());
        RoomResponse roomResponse = RoomMapper.toResponse(room, reservation.getNights());
        UserResponse userResponse = UserMapper.toResponse(user);

        return new ReservationPreviewResponse(
                Status.BOOKED, // Domyślny status
                hotelResponse,
                roomResponse,
                userResponse,
                reservation.getCheckInDate().toString(),
                reservation.getCheckOutDate().toString(),
                reservation.getNights(),
                reservation.getTotalPrice(),
                reservation.getPaymentMethod(),
                reservation.getCreatedAt().toString()// Domyślna metoda płatności
                 // Obecna data jako data utworzenia podglądu
        );
    }
}