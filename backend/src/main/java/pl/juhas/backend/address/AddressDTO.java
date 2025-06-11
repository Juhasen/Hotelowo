package pl.juhas.backend.address;

public record AddressDTO(
    String street,
    String city,
    String postalCode,
    Double latitude,
    Double longitude
) {
}
