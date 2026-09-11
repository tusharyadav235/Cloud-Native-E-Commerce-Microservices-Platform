package com.ecommerce.order;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private BigDecimal totalAmount;
    private String status; // e.g., PENDING, COMPLETED, CANCELLED
    private LocalDateTime orderDate;
    
    @PrePersist
    public void prePersist() {
        this.orderDate = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
    }
}
