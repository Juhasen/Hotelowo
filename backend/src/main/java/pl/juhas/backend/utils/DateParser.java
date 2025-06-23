package pl.juhas.backend.utils;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

public class DateParser {

    // Tablice formatów dat, które będziemy próbować parsować
    static DateTimeFormatter[] formatters = {
            DateTimeFormatter.ISO_LOCAL_DATE,                // YYYY-MM-DD
            DateTimeFormatter.ofPattern("dd/MM/yyyy"),       // DD/MM/YYYY
            DateTimeFormatter.ofPattern("MM/dd/yyyy"),       // MM/DD/YYYY
            DateTimeFormatter.ofPattern("dd-MM-yyyy"),       // DD-MM-YYYY
            DateTimeFormatter.ofPattern("dd.MM.yyyy")        // DD.MM.YYYY
    };

    public static List<LocalDate> parseCheckDates(String checkInDate, String checkOutDate) {
        LocalDate parsedCheckInDate = null;
        LocalDate parsedCheckOutDate = null;

        // Próba parsowania daty zameldowania
        if (checkInDate != null && !checkInDate.isEmpty()) {
            parsedCheckInDate = parseDate(checkInDate, formatters);
            if (parsedCheckInDate == null) {
                System.out.println("Invalid check-in date format: " + checkInDate);
                return List.of();
            }
        }

        // Próba parsowania daty wymeldowania
        if (checkOutDate != null && !checkOutDate.isEmpty()) {
            parsedCheckOutDate = parseDate(checkOutDate, formatters);
            if (parsedCheckOutDate == null) {
                System.out.println("Invalid check-out date format: " + checkOutDate);
                return List.of();
            }
        }

        // Jeśli nie podano dat, zwracamy pustą stronę
        if (parsedCheckInDate == null || parsedCheckOutDate == null) {
            System.out.println("Empty check-in or check-out date");
            return List.of();
        }

        // Walidacja dat
        if (parsedCheckInDate.isAfter(parsedCheckOutDate)) {
            System.out.println("Wrong data: check-in date is after check-out date");
            return List.of();
        }

        //Validate if check-in date is not in the past
        if (parsedCheckInDate.isBefore(LocalDate.now())) {
            System.out.println("Check-in date cannot be in the past: " + parsedCheckInDate);
            return List.of();
        }

        return List.of(parsedCheckInDate, parsedCheckOutDate);
    }

    private static LocalDate parseDate(String dateStr, DateTimeFormatter[] formatters) {
        for (DateTimeFormatter formatter : formatters) {
            try {
                return LocalDate.parse(dateStr, formatter);
            } catch (DateTimeParseException e) {
                // Próbuj kolejnego formatu
            }
        }
        return null; // Żaden format nie pasuje
    }

}
