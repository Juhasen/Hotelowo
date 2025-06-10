package pl.juhas.backend.amenity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;

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
}
