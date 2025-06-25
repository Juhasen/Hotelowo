package pl.juhas.backend.review;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.juhas.backend.review.dto.ReviewRequest;
import pl.juhas.backend.review.exception.ReviewAlreadyPostedException;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/review")
@AllArgsConstructor
public class ReviewController {
    private final ReviewService service;

    @PostMapping("/create")
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest request,
                                          Principal connectedUser) {
        try {
            service.createReview(request, connectedUser);
            return ResponseEntity.ok().build();
        } catch (ReviewAlreadyPostedException e) {
            System.out.println("Review already posted: " + e.getMessage());
            return ResponseEntity.status(409).build();
        } catch (Exception e) {
            System.out.println("Error while creating review: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
