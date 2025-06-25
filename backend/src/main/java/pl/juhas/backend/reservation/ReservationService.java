package pl.juhas.backend.reservation;

import org.hibernate.Hibernate;
import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import pl.juhas.backend.hotel.LocaleType;
import pl.juhas.backend.reservation.dto.ReservationPreviewRequest;
import pl.juhas.backend.reservation.dto.ReservationPreviewResponse;
import pl.juhas.backend.reservation.dto.ReservationRequest;
import pl.juhas.backend.reservation.dto.ReservationResponse;
import pl.juhas.backend.user.User;
import pl.juhas.backend.utils.DateParser;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;


    public ReservationPreviewResponse getReservationPreview(ReservationPreviewRequest request, LocaleType locale,
                                                            Principal connectedUser) {
        List<LocalDate> checkInOutDates = DateParser.parseCheckDates(request.checkInDate(), request.checkOutDate());
        if (checkInOutDates.isEmpty()) {
            System.out.println("Invalid check-in or check-out date format");
            return null;
        }

        LocalDate startDate = checkInOutDates.get(0);
        LocalDate endDate = checkInOutDates.get(1);

        if (startDate.isAfter(endDate)) {
            System.out.println("Check-in date cannot be after check-out date");
            return null;
        }
        if (startDate.isBefore(LocalDate.now())) {
            System.out.println("Check-in date cannot be in the past");
            return null;
        }

        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();


        return ReservationMapper.toPreviewResponse(request, locale, user, startDate, endDate);
    }

    @Transactional
    public String confirmReservation(ReservationRequest request, Principal connectedUser, LocaleType locale) {
        List<LocalDate> checkInOutDates = DateParser.parseCheckDates(request.checkInDate(), request.checkOutDate());
        if (checkInOutDates.isEmpty()) {
            System.out.println("Invalid check-in or check-out date format");
            return null;
        }

        LocalDate startDate = checkInOutDates.get(0);
        LocalDate endDate = checkInOutDates.get(1);

        if (startDate.isAfter(endDate)) {
            System.out.println("Check-in date cannot be after check-out date");
            return null;
        }
        if (startDate.isBefore(LocalDate.now())) {
            System.out.println("Check-in date cannot be in the past");
            return null;
        }

        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        Reservation reservation = reservationRepository.save(ReservationMapper.toReservation(request, user, startDate, endDate));

        return reservation.getConfirmationCode();
    }

    public ReservationResponse getReservationById(Long id, LocaleType locale, Principal connectedUser) {
        var reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ReservationNotFoundException("Reservation not found"));

        if (!Hibernate.isInitialized(reservation.getRoom())) {
            Hibernate.initialize(reservation.getRoom());
        }

        if (!Hibernate.isInitialized(reservation.getUser())) {
            Hibernate.initialize(reservation.getUser());
        }

        var user = (User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

        return ReservationMapper.toResponse(reservation, locale, user);
    }
}
