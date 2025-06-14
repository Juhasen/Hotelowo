package pl.juhas.backend.hotel.dto;

public record HotelSearchRequest(
        String country,
        String checkInDate,
        String checkOutDate,
        Integer numberOfGuests
) {
}
