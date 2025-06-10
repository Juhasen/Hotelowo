package pl.juhas.backend.room;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;
import pl.juhas.backend.hotel.Hotel;

import java.math.BigDecimal;


@Data
@With
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "room")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @JoinColumn(name = "room_number", nullable = false)
    private String number;

    @JoinColumn(name = "room_type", nullable = false)
    private RoomType type;

    @Column(precision = 8, scale = 2)
    private BigDecimal pricePerNight;

    private Integer capacity;
}
