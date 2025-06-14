package pl.juhas.backend.address;

public record AddressRequest(
        String country,
        String street,
        String city,
        String postalCode,
        Double latitude,
        Double longitude
) {
}
