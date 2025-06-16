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
import pl.juhas.backend.hotelImage.HotelImage;
import pl.juhas.backend.room.Room;

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

    @Column(name = "description_pl", nullable = false, columnDefinition = "TEXT")
    private String description_pl;

    @Column(name = "description_en", nullable = false, columnDefinition = "TEXT")
    private String description_en;

    @Column(precision = 2, scale = 1)
    private BigDecimal rating;

    @OneToOne
    private Address address;

    @OneToMany(mappedBy = "hotel", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Room> rooms;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(length = 100)
    private String website;

    private Boolean isAvailableSearch;

    @ManyToMany(fetch = FetchType.EAGER)
    private List<Amenity> amenities;

    @OneToMany(mappedBy = "hotel", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HotelImage> images;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
