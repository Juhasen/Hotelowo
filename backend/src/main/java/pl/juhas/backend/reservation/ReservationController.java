package pl.juhas.backend.reservation;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.juhas.backend.reservation.dto.ReservationPreviewRequest;
import pl.juhas.backend.reservation.dto.ReservationPreviewResponse;


@RestController
@RequestMapping("/api/v1/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService service;

    @GetMapping("/preview")
    public ResponseEntity<ReservationPreviewResponse> getReservationPreview(
            ReservationPreviewRequest request
    ) {
        ReservationPreviewResponse response = service.getReservationPreview(request);
        return ResponseEntity.ok(response);
    }
}
