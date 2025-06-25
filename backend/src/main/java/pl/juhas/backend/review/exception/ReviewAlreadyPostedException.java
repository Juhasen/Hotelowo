package pl.juhas.backend.review.exception;

public class ReviewAlreadyPostedException extends RuntimeException {
    public ReviewAlreadyPostedException(String message) {
        super(message);
    }
}
