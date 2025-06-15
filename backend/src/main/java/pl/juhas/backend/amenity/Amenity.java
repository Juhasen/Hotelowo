package pl.juhas.backend.amenity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;
import pl.juhas.backend.hotel.Hotel;

import java.util.List;

@Data
@With
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "amenity")
public class Amenity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(name = "name_pl", nullable = false, unique = true)
    private String name_pl;

    @Column(name = "name_en", nullable = false, unique = true)
    private String name_en;

    @Column(name = "description_pl")
    private String description_pl;

    @Column(name = "description_en")
    private String description_en;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "hotel_amenity",
            joinColumns = @JoinColumn(name = "amenity_id"),
            inverseJoinColumns = @JoinColumn(name = "hotel_id")
    )
    private List<Hotel> hotels;

}
