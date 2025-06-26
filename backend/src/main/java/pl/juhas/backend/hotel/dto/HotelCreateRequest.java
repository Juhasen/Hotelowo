package pl.juhas.backend.hotel.dto;

import pl.juhas.backend.address.dto.AddressRequest;
import pl.juhas.backend.hotelImage.dto.HotelImageRequest;
import pl.juhas.backend.room.dto.CreateRoomRequest;

import java.util.List;

public record HotelCreateRequest(
        String name,
        String description_pl,
        String description_en,
        String phone,
        String email,
        Integer stars,
        String website,
        boolean isAvailableSearch,
        List<Integer> amenityIds,
        AddressRequest address,
        List<HotelImageRequest> images,
        List<CreateRoomRequest> rooms
) {}
