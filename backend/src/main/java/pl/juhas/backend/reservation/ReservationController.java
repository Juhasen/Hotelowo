package pl.juhas.backend.reservation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.juhas.backend.hotel.LocaleType;
import pl.juhas.backend.reservation.dto.ReservationPreviewRequest;
import pl.juhas.backend.reservation.dto.ReservationPreviewResponse;

import java.security.Principal;


@RestController
@RequestMapping("/api/v1/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService service;

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
}
