package pl.juhas.backend.hotel;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.juhas.backend.hotel.dto.HotelRequest;
import pl.juhas.backend.hotel.dto.HotelResponse;
import pl.juhas.backend.hotel.dto.HotelSearchRequest;
import pl.juhas.backend.hotel.dto.HotelSearchResponse;

@RestController
@RequestMapping("/api/v1/hotel")
@RequiredArgsConstructor
public class HotelController {

    private final HotelService service;

    @GetMapping("/{locale}")
    public ResponseEntity<Page<HotelSearchResponse>> getHotels(
            @PathVariable LocaleType locale,
            HotelSearchRequest hotelRequest,
            @PageableDefault(
                    size = 10,
                    page = 0,
                    sort = "name",
                    direction = Sort.Direction.ASC
            ) Pageable pageable
    ) {

        return ResponseEntity.ok(
                service.getHotels(locale.name(), hotelRequest, pageable)
        );
    }

    @GetMapping("/{locale}/{id}")
    public ResponseEntity<HotelResponse> getHotelById(@PathVariable LocaleType locale, @PathVariable Long id) {
        HotelResponse hotelResponse = service.getHotelById(locale.name(), id);
        if (hotelResponse == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
        return ResponseEntity.ok(hotelResponse);
    }

    @PostMapping
    public ResponseEntity<HttpStatus> createHotel(
            @RequestBody HotelRequest request
    ) {
        Boolean res = service.createHotel(request);
        if (!res) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<HttpStatus> updateHotel(@PathVariable Long id,
                                         @RequestBody HotelRequest request
    ) {
        Boolean res = service.updateHotel(id, request);
        if (!res) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteHotel(@PathVariable Long id) {
        Boolean res = service.deleteHotel(id);
        if (!res) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}

