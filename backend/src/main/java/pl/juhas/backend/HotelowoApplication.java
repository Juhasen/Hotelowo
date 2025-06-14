package pl.juhas.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import pl.juhas.backend.address.Address;
import pl.juhas.backend.address.AddressRepository;
import pl.juhas.backend.auth.AuthenticationService;
import pl.juhas.backend.auth.RegisterRequest;
import pl.juhas.backend.hotel.Hotel;
import pl.juhas.backend.hotel.HotelRepository;
import pl.juhas.backend.hotelImage.HotelImage;
import pl.juhas.backend.hotelImage.HotelImageRepository;
import pl.juhas.backend.room.Room;
import pl.juhas.backend.room.RoomRepository;
import pl.juhas.backend.room.RoomType;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static pl.juhas.backend.user.Role.ADMIN;

@SpringBootApplication
public class HotelowoApplication {

    public static void main(String[] args) {
        SpringApplication.run(HotelowoApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(
            AuthenticationService service,
            HotelRepository hotelRepository,
            RoomRepository roomRepository,
            AddressRepository addressRepository,
            HotelImageRepository hotelImageRepository
    ) {
        return args -> {
            // Tworzenie administratora
            var admin = RegisterRequest.builder()
                    .firstname("Admin")
                    .lastname("Admin")
                    .email("admin@mail.com")
                    .password("password")
                    .role(ADMIN)
                    .build();
            System.out.println("Admin token: " + service.register(admin).getAccessToken());

            // Tworzenie przykładowego hotelu z 3 pokojami
            createSampleHotel(hotelRepository, roomRepository, addressRepository, hotelImageRepository);
        };
    }

    private void createSampleHotel(
            HotelRepository hotelRepository,
            RoomRepository roomRepository,
            AddressRepository addressRepository,
            HotelImageRepository hotelImageRepository
    ) {
        // Sprawdzenie czy hotel przykładowy już istnieje
        if (hotelRepository.findAll().stream().anyMatch(h -> h.getName().equals("Grand Hotel Warszawa"))) {
            System.out.println("Przykładowy hotel już istnieje w bazie danych.");
            return;
        }

        // 1. Utworzenie adresu hotelu
        Address address = new Address()
                .withCountry("Poland")
                .withStreet("ul. Nowy Świat 12")
                .withCity("Warszawa")
                .withPostalCode("00-001")
                .withLatitude(52.2297)
                .withLongitude(21.0122);
        addressRepository.save(address);

        // 2. Utworzenie hotelu
        Hotel hotel = new Hotel()
                .withName("Grand Hotel Warszawa")
                .withDescription_pl("Luksusowy hotel położony w centrum Warszawy, oferujący najwyższy standard obsługi i komfortowe pokoje.")
                .withDescription_en("Luxury hotel located in the center of Warsaw, offering the highest standard of service and comfortable rooms.")
                .withAddress(address)
                .withPhone("+48 22 123 45 67")
                .withEmail("rezerwacje@grandhotelwarszawa.pl")
                .withWebsite("www.grandhotelwarszawa.pl")
                .withIsAvailableSearch(true)
                .withRating(new BigDecimal("4.7"))
                .withRooms(new ArrayList<>())
                .withImages(new ArrayList<>())
                .withAmenities(new ArrayList<>());

        hotelRepository.save(hotel);

        // 3. Utworzenie obrazów hotelu
        HotelImage mainImage = new HotelImage()
                .withHotel(hotel)
                .withFilePath("/images/hotels/grand-warszawa-main.jpg")
                .withAltText("Grand Hotel Warszawa - widok z zewnątrz")
                .withIsPrimary(true);

        HotelImage secondImage = new HotelImage()
                .withHotel(hotel)
                .withFilePath("/images/hotels/grand-warszawa-lobby.jpg")
                .withAltText("Grand Hotel Warszawa - recepcja")
                .withIsPrimary(false);

        List<HotelImage> images = List.of(mainImage, secondImage);
        hotelImageRepository.saveAll(images);

        hotel.setImages(images);
        hotelRepository.save(hotel);

        // 4. Utworzenie pokoi
        Room singleRoom = new Room()
                .withHotel(hotel)
                .withNumber("101")
                .withType(RoomType.SINGLE)
                .withCapacity(1)
                .withPricePerNight(new BigDecimal("350.00"));

        Room doubleRoom = new Room()
                .withHotel(hotel)
                .withNumber("201")
                .withType(RoomType.DOUBLE)
                .withCapacity(2)
                .withPricePerNight(new BigDecimal("550.00"));

        Room suiteRoom = new Room()
                .withHotel(hotel)
                .withNumber("301")
                .withType(RoomType.SUITE)
                .withCapacity(4)
                .withPricePerNight(new BigDecimal("1200.00"));

        List<Room> rooms = List.of(singleRoom, doubleRoom, suiteRoom);
        roomRepository.saveAll(rooms);

        hotel.setRooms(rooms);
        hotelRepository.save(hotel);

        System.out.println("Utworzono przykładowy hotel \"Grand Hotel Warszawa\" z 3 pokojami.");
    }
}
