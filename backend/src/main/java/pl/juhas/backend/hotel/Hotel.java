package pl.juhas.backend.hotel;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;
import org.springframework.data.annotation.CreatedDate;
import pl.juhas.backend.address.Address;

import java.time.LocalDateTime;

@Data
@With
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "hotel")
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "description_pl", nullable = false)
    private String description_pl;

    @Column(name = "description_en", nullable = false)
    private String description_en;

    private Double rating;

    @OneToOne
    private Address address;

    private String phone;

    private String email;

    private Boolean isAvailableSearch;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

}
