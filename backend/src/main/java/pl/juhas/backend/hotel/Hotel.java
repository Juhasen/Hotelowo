package pl.juhas.backend.hotel;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import pl.juhas.backend.address.Address;
import pl.juhas.backend.amenity.Amenity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@With
@Entity
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
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

    @Column(precision = 2, scale = 1)
    private BigDecimal rating;

    @OneToOne
    private Address address;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    private Boolean isAvailableSearch;

    @ManyToMany(mappedBy = "hotels")
    private List<Amenity> amenities;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
