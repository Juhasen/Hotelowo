package pl.juhas.backend.user.dto;

public record UserResponse(
        String firstname,
        String lastname,
        String email,
        String phoneNumber
) {}
