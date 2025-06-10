package pl.juhas.backend.hotel;

public record CreateHotelRequest(
    String name,
    String description_pl,
    String description_en,
    String phone,
    String email,
    String website,
    String city,
    String postalCode,
    String street,
    String latitude,
    String longitude,
    Boolean isAvailableSearch,
    Integer[] amenityIds
) {
}
