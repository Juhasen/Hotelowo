package pl.juhas.backend.user.dto;

import pl.juhas.backend.user.Role;

public record UserResponse(
        String firstname,
        String lastname,
        String email,
        String phoneNumber,
        Role role
) {}
