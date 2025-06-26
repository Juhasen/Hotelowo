package pl.juhas.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.Transactional;
import pl.juhas.backend.address.Address;
import pl.juhas.backend.address.AddressRepository;
import pl.juhas.backend.amenity.Amenity;
import pl.juhas.backend.amenity.AmenityRepository;
import pl.juhas.backend.auth.AuthenticationService;
import pl.juhas.backend.auth.RegisterRequest;
import pl.juhas.backend.hotel.Hotel;
import pl.juhas.backend.reservation.Reservation;

import pl.juhas.backend.hotel.HotelRepository;
import pl.juhas.backend.hotelImage.HotelImage;
import pl.juhas.backend.hotelImage.HotelImageRepository;
import pl.juhas.backend.reservation.ReservationRepository;
import pl.juhas.backend.reservation.Status;
import pl.juhas.backend.room.Room;
import pl.juhas.backend.room.RoomRepository;
import pl.juhas.backend.room.RoomType;
import pl.juhas.backend.utils.RandomStringGenerator;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static pl.juhas.backend.user.Role.ADMIN;
import static pl.juhas.backend.user.Role.USER;

@SpringBootApplication
public class HotelowoApplication {

    public static void main(String[] args) {
        SpringApplication.run(HotelowoApplication.class, args);
    }

    @Transactional
    @Bean
    public CommandLineRunner commandLineRunner(
            AuthenticationService service,
            HotelRepository hotelRepository,
            RoomRepository roomRepository,
            AddressRepository addressRepository,
            HotelImageRepository hotelImageRepository,
            AmenityRepository amenityRepository,
            ReservationRepository reservationRepository
    ) {
        return args -> {
            // Tworzenie administratora
            var admin = RegisterRequest.builder()
                    .firstname("Admin")
                    .lastname("Admin")
                    .email("admin@mail.com")
                    .password("password123!")
                    .role(ADMIN)
                    .build();
            System.out.println("Admin token: " + service.register(admin).getAccessToken());

            var user = RegisterRequest.builder()
                    .firstname("Krystian")
                    .lastname("Juszczyk")
                    .email("juszczyk-krystian@wp.pl")
                    .phoneNumber("692187092")
                    .password("qwerty123!")
                    .role(USER)
                    .build();
            System.out.println("User token: " + service.register(user).getAccessToken());


            // Tworzenie udogodnień
            createAmenities(amenityRepository);

            // Tworzenie przykładowego hotelu z 3 pokojami
            createSampleHotel(hotelRepository, roomRepository, addressRepository, hotelImageRepository);

            // Tworzenie dodatkowych hoteli w Polsce
            createMorePolishHotels(hotelRepository, roomRepository, addressRepository, hotelImageRepository);

            // Przypisanie udogodnień do hoteli
            addAmenitiesToHotels(hotelRepository, amenityRepository);

            // create reservation for user and Aparthotel Centrum
            // create reservation for user and Aparthotel Centrum
            var aparthotelCentrum = hotelRepository.findByName("Aparthotel Centrum")
                    .map(hotel -> {
                        // Inicjalizacja kolekcji pokoi jawnie w ramach otwartej sesji
                        if (hotel.getRooms() != null) {
                            hotel.getRooms().size(); // To wymusza załadowanie kolekcji
                        }
                        return hotel;
                    })
                    .orElse(null);
            var userAccount = service.getUserByEmail("juszczyk-krystian@wp.pl");

            if (aparthotelCentrum != null && userAccount != null) {
                var room = aparthotelCentrum.getRooms().getFirst();

                String confirmationCode = String.format("%s-%s-%s-%s", RandomStringGenerator.generateRandomCode(4), RandomStringGenerator.generateRandomCode(4), RandomStringGenerator.generateRandomCode(4), userAccount.getId());
                // Tworzenie przykładowej rezerwacji
                var reservation = new Reservation()
                        .withRoom(room)
                        .withUser(userAccount)
                        .withCheckInDate(LocalDate.now().minusDays(4).atStartOfDay())
                        .withCheckOutDate(LocalDate.now().minusDays(1).atStartOfDay())
                        .withNights(3)
                        .withStatus(Status.BOOKED)
                        .withConfirmationCode(confirmationCode)
                        .withTotalPrice(room.getPricePerNight().multiply(BigDecimal.valueOf(3))); // 3 noce

                reservationRepository.save(reservation);

                System.out.println("Utworzono przykładową rezerwację w hotelu " + aparthotelCentrum.getName() +
                        " dla użytkownika " + userAccount.getFirstname() + " " + userAccount.getLastname() +
                        ", kod potwierdzenia: " + reservation.getConfirmationCode());

            } else {
                System.out.println("Nie znaleziono hotelu Aparthotel Centrum lub użytkownika");
            }
        };
    }

    private void createMorePolishHotels(
            HotelRepository hotelRepository,
            RoomRepository roomRepository,
            AddressRepository addressRepository,
            HotelImageRepository hotelImageRepository
    ) {
        // Tablica danych hoteli [nazwa, miasto, ulica, opis_pl, szerokość geo, długość geo]
        Object[][] hotelData = {
                {"Hotel Panorama", "Kraków", "ul. Wawelska 8", "Elegancki hotel z widokiem na Wawel, położony w sercu Krakowa.", 50.0578, 19.9371},
                {"Baltic Resort & Spa", "Gdańsk", "ul. Nadmorska 22", "Nowoczesny hotel z dostępem do prywatnej plaży i centrum SPA.", 54.3520, 18.6466},
                {"Hotel Victoria", "Wrocław", "ul. Rynek 12", "Butikowy hotel położony przy wrocławskim Rynku, łączący nowoczesność z klasyczną elegancją.", 51.1079, 17.0385},
                {"Górski Azyl", "Zakopane", "ul. Krupówki 45", "Tradycyjny hotel w stylu góralskim z niesamowitym widokiem na Tatry.", 49.2992, 19.9496},
                {"Aparthotel Centrum", "Poznań", "ul. Półwiejska 3", "Aparthotel Centrum położony jest w samym sercu miasta, oferując komfortowy pobyt zarówno dla turystów, jak i osób podróżujących służbowo. Do dyspozycji Gości oddajemy ogród oraz bezpłatny prywatny parking, co stanowi wyjątkowy atut w centrum. Goście mogą również korzystać z bezpłatnego Wi-Fi dostępnego na terenie całego obiektu.\n" +
                        "\n\n" +
                        "W pobliżu znajdują się liczne atrakcje, takie jak Centrum handlowe Manufaktura (800 m), PKP Łódź Kaliska (2 km) oraz Hala Atlas Arena (2,5 km). Doskonała lokalizacja umożliwia łatwy dostęp do komunikacji miejskiej, restauracji, muzeów oraz terenów rekreacyjnych.\n" +
                        "\n\n" +
                        "Każda opcja zakwaterowania wyposażona jest w ekspres do kawy, prywatną łazienkę z prysznicem i suszarką do włosów, a wybrane apartamenty posiadają również aneks kuchenny z płytą grzewczą. W cenie pobytu zapewniona jest pościel oraz ręczniki.\n" +
                        "\n\n" +
                        "Recepcja czynna jest codziennie, a personel posługujący się językiem polskim, angielskim i rosyjskim chętnie udzieli wszelkich informacji oraz pomoże zaplanować pobyt.\n" +
                        "\n\n" +
                        "Odległość od dworca Łódź Fabryczna wynosi 2,5 km, natomiast Port Lotniczy im. Władysława Reymonta oddalony jest o 7 km.", 52.4064, 16.9252},
                {"Royal Palace", "Łódź", "ul. Piotrkowska 100", "Prestiżowy hotel w sercu Łodzi z dostępem do centrum wellness i restauracją.", 51.7592, 19.4560},
                {"Seaside Resort", "Sopot", "ul. Bohaterów Monte Cassino 5", "Ekskluzywny kurort z widokiem na morze i bezpośrednim dostępem do plaży.", 54.4454, 18.5682},
                {"Hotel Metalurg", "Katowice", "ul. Mariackia 15", "Stylowy hotel biznesowy z nowoczesnymi udogodnieniami i świetną lokalizacją.", 50.2599, 19.0200},
                {"Zamkowy Dwór", "Lublin", "ul. Zamkowa 3", "Historyczny hotel w odrestaurowanym dworku z widokiem na Stare Miasto.", 51.2465, 22.5684},
                {"Residence Toruń", "Toruń", "ul. Piernikowa 10", "Kameralny hotel w zabytkowej kamienicy blisko rynku staromiejskiego.", 53.0138, 18.5981},
                {"Nadmorski Relaks", "Kołobrzeg", "ul. Nadbrzeżna 42", "Komfortowy hotel z basenem i strefą spa, zaledwie 200 metrów od morza.", 54.1849, 15.5734},
                {"Hotel Kopernik", "Olsztyn", "ul. Planetarna 8", "Nowoczesny hotel z restauracją serwującą dania kuchni regionalnej.", 53.7784, 20.4801},
                {"Green Valley Resort", "Beskid Śląski", "ul. Górska 15", "Ekologiczny hotel z widokiem na góry i własnym centrum odnowy biologicznej.", 49.7246, 19.0139},
                {"Park Hotel", "Szczecin", "Aleja Parkowa 22", "Elegancki hotel położony w zabytkowym parku z widokiem na Odrę.", 53.4285, 14.5528},
                {"Continental Hotel", "Białystok", "ul. Lipowa 33", "Luksusowy hotel w centrum miasta z przestronnymi pokojami i salą konferencyjną.", 53.1324, 23.1592}
        };

        for (Object[] data : hotelData) {
            String name = (String) data[0];

            // Sprawdzenie czy hotel już istnieje
            if (hotelRepository.findAll().stream().anyMatch(h -> h.getName().equals(name))) {
                System.out.println("Hotel " + name + " już istnieje w bazie danych.");
                continue;
            }

            // 1. Utworzenie adresu hotelu
            Address address = new Address()
                    .withCountry("PL")
                    .withStreet((String) data[2])
                    .withCity((String) data[1])
                    .withPostalCode(generateRandomPostalCode())
                    .withLatitude((Double) data[4])
                    .withLongitude((Double) data[5]);
            addressRepository.save(address);

            // 2. Utworzenie hotelu
            String descriptionPl = (String) data[3];
            String descriptionEn = "A wonderful hotel in " + data[1] + "."; // Prosty angielski opis

            Hotel hotel = new Hotel()
                    .withName(name)
                    .withDescription_pl(descriptionPl)
                    .withDescription_en(descriptionEn)
                    .withAddress(address)
                    .withPhone("+48 " + generateRandomPhone())
                    .withEmail("kontakt@" + name.toLowerCase().replace(" ", "") + ".pl")
                    .withWebsite("www." + name.toLowerCase().replace(" ", "") + ".pl")
                    .withIsAvailableSearch(true)
                    .withRating(new BigDecimal(String.format("%.2f", 3.5 + Math.random() * 1.5).replace(',', '.')))
                    .withStars(1 + (int) (Math.random() * 5))
                    .withRooms(new ArrayList<>())
                    .withImages(new ArrayList<>())
                    .withAmenities(new ArrayList<>());

            hotelRepository.save(hotel);

            // 3. Utworzenie obrazów hotelu
            List<HotelImage> images = new ArrayList<>();

            // Główny obraz
            images.add(new HotelImage()
                    .withHotel(hotel)
                    .withFilePath("/images/hotels/" + name.toLowerCase().replace(" ", "-") + "-main.jpg")
                    .withAltText(name + " - widok główny")
                    .withIsPrimary(true));

            // Dodatkowe obrazy (4 różne typy)
            String[] imageTypes = {"-room", "-bathroom", "-restaurant", "-exterior", "-lobby"};
            for (int i = 0; i < 4; i++) {
                String imageType = imageTypes[i];
                images.add(new HotelImage()
                        .withHotel(hotel)
                        .withFilePath("/images/hotels/" + name.toLowerCase().replace(" ", "-") + imageType + ".jpg")
                        .withAltText(name + imageType.replace("-", " "))
                        .withIsPrimary(false));
            }

            hotelImageRepository.saveAll(images);
            hotel.setImages(images);
            hotelRepository.save(hotel);

            // 4. Utworzenie pokoi (3-5 pokoi na hotel)
            List<Room> rooms = new ArrayList<>();

            // Pokój jednoosobowy
            rooms.add(new Room()
                    .withHotel(hotel)
                    .withNumber("101")
                    .withType(RoomType.SINGLE)
                    .withCapacity(1)
                    .withPricePerNight(BigDecimal.valueOf(250 + Math.random() * 200)));

            // Pokój dwuosobowy
            rooms.add(new Room()
                    .withHotel(hotel)
                    .withNumber("201")
                    .withType(RoomType.DOUBLE)
                    .withCapacity(2)
                    .withPricePerNight(BigDecimal.valueOf(400 + Math.random() * 200)));

            // Pokój rodzinny
            rooms.add(new Room()
                    .withHotel(hotel)
                    .withNumber("301")
                    .withType(RoomType.SUITE)
                    .withCapacity(4)
                    .withPricePerNight(BigDecimal.valueOf(600 + Math.random() * 400)));

            roomRepository.saveAll(rooms);

            hotel.setRooms(rooms);
            hotelRepository.save(hotel);

            System.out.println("Utworzono hotel: " + name);
        }
    }

    // Generator losowego kodu pocztowego
    private String generateRandomPostalCode() {
        return String.format("%02d-%03d",
                10 + (int) (Math.random() * 80),
                100 + (int) (Math.random() * 900));
    }

    // Generator losowego numeru telefonu
    private String generateRandomPhone() {
        return String.format("%03d %03d %03d",
                100 + (int) (Math.random() * 900),
                100 + (int) (Math.random() * 900),
                100 + (int) (Math.random() * 900));
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
                .withCountry("PL")
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
                .withStars(1 + (int) (Math.random() * 5))
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

    private void createAmenities(AmenityRepository amenityRepository) {
        // Sprawdzenie czy udogodnienia już istnieją
        if (!amenityRepository.findAll().isEmpty()) {
            System.out.println("Udogodnienia już istnieją w bazie danych.");
            return;
        }

        // Tablica danych udogodnień [nazwa_pl, nazwa_en, ikona]
        Object[][] amenityData = {
                {"Darmowe Wi-Fi", "Free Wi-Fi", "wifi"},
                {"Parking", "Parking", "parking"},
                {"Pokoje dla niepalących", "Non-smoking rooms", "no-smoking"},
                {"Ekspres do kawy", "Coffee machine", "coffee"},
                {"Klimatyzacja", "Air conditioning", "air-conditioning"},
                {"Śniadanie w cenie", "Breakfast included", "breakfast"},
                {"Centrum fitness", "Fitness center", "fitness"},
                {"Basen", "Swimming pool", "pool"},
                {"Sauna", "Sauna", "sauna"},
                {"Zwierzęta dozwolone", "Pets allowed", "pets"}
        };

        List<Amenity> amenities = new ArrayList<>();

        for (Object[] data : amenityData) {
            Amenity amenity = new Amenity()
                    .withName_pl((String) data[0])
                    .withName_en((String) data[1])
                    .withIcon((String) data[2])
                    .withHotels(new ArrayList<>());

            amenities.add(amenity);
        }

        amenityRepository.saveAll(amenities);
        System.out.println("Utworzono " + amenities.size() + " przykładowych udogodnień.");
    }

    private void addAmenitiesToHotels(
            HotelRepository hotelRepository,
            AmenityRepository amenityRepository
    ) {
        List<Hotel> hotels = hotelRepository.findAll();
        List<Amenity> allAmenities = amenityRepository.findAll();

        if (hotels.isEmpty() || allAmenities.isEmpty()) {
            System.out.println("Brak hoteli lub udogodnień do powiązania.");
            return;
        }

        for (Hotel hotel : hotels) {
            // Wybieramy losową liczbę udogodnień (od 3 do 8) dla każdego hotelu
            int amenityCount = 3 + (int) (Math.random() * 6);

            // Mieszamy listę wszystkich udogodnień, aby za każdym razem wybierać inne
            Collections.shuffle(allAmenities);

            // Wybieramy podzbiór udogodnień
            List<Amenity> selectedAmenities = allAmenities.subList(0, Math.min(amenityCount, allAmenities.size()));

            // Przypisujemy wybrane udogodnienia do hotelu
            hotel.setAmenities(new ArrayList<>(selectedAmenities));
            hotelRepository.save(hotel);

            System.out.println("Dodano " + selectedAmenities.size() + " udogodnień do hotelu: " + hotel.getName());
        }
    }
}
