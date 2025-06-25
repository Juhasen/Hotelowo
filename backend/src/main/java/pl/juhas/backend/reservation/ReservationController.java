package pl.juhas.backend.reservation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.juhas.backend.hotel.LocaleType;
import pl.juhas.backend.reservation.dto.*;

import java.security.Principal;
import java.util.List;


@RestController
@RequestMapping("/api/v1/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService service;

    @GetMapping("/user")
    public ResponseEntity<List<ReservationOverview>> getUserReservations(
            Principal connectedUser
    ) {
        try {
            return ResponseEntity.ok(service.getUserReservations(connectedUser));
        } catch (Exception e) {
            System.out.println("Error while getting user reservations: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{locale}/{id}")
    public ResponseEntity<ReservationResponse> getReservationById(
            @PathVariable LocaleType locale,
            @PathVariable Long id,
            Principal connectedUser
    ) {
        ReservationResponse reservationResponse;
        try {
            reservationResponse = service.getReservationById(id, locale, connectedUser);
        } catch (ReservationNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.out.println("Error while getting reservation by ID: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(reservationResponse);
    }

    @GetMapping("/preview/{locale}")
    public ResponseEntity<ReservationPreviewResponse> getReservationPreview(
            @PathVariable LocaleType locale,
            ReservationPreviewRequest request,
            Principal connectedUser
    ) {
        ReservationPreviewResponse response;
        try{
            response = service.getReservationPreview(request, locale, connectedUser);
        }
        catch (ReservationNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
        catch (Exception e) {
            System.out.println("Error while getting reservation preview: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/confirm/{locale}")
    public ResponseEntity<String> confirmReservation(
            @PathVariable LocaleType locale,
            @RequestBody ReservationRequest request,
            Principal connectedUser
    ) {
        String response;
        try {
            response = service.confirmReservation(request, connectedUser, locale);
        } catch (ReservationNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.out.println("Error while confirming reservation: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(response);
    }


}
