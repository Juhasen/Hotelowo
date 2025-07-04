package pl.juhas.backend.reservation;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import pl.juhas.backend.room.Room;
import pl.juhas.backend.user.User;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@With
@Entity
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "reservation")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(nullable = false)
    private LocalDateTime checkInDate;

    @Column(nullable = false)
    private LocalDateTime checkOutDate;

    @Enumerated(value = EnumType.STRING)
    private Status status;

    @Enumerated(value = EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(nullable = false)
    private Integer nights;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "confirmation_code", unique = true, nullable = false)
    private String confirmationCode;

    @CreatedDate
    @Column(name ="created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Reservation(User user, Room room, Status status, LocalDate startDate, LocalDate endDate, int nights, BigDecimal totalPrice, PaymentMethod paymentMethod, String confirmationCode) {
        this.user = user;
        this.room = room;
        this.status = status;
        this.checkInDate = startDate.atStartOfDay();
        this.checkOutDate = endDate.atStartOfDay();
        this.nights = nights;
        this.totalPrice = totalPrice;
        this.paymentMethod = paymentMethod;
        this.confirmationCode = confirmationCode;
    }
}