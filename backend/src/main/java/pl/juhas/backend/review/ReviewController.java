package pl.juhas.backend.review;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.juhas.backend.review.dto.ReviewRequest;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/review")
@AllArgsConstructor
public class ReviewController {
    private final ReviewService service;

    @PostMapping()
    public ResponseEntity<?> createReview(ReviewRequest request,
                                          Principal connectedUser) {
        try {
            service.createReview(request, connectedUser);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Error while creating review: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
