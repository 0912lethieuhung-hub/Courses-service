package vn.edu.crs.authservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "api_key")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "key_value", nullable = false, unique = true, length = 100)
    private String keyValue;

    @Column(name = "owner_name", nullable = false, length = 255)
    private String ownerName;

    // Danh sach scope, phan tach boi dau phay. Vi du: "courses:read,courses:read-detail"
    @Column(nullable = false, length = 500)
    private String scopes;

    @Column(nullable = false, length = 20)
    private String status; // "ACTIVE" hoac "REVOKED"

    @Column(name = "expires_at")
    private LocalDateTime expiresAt; // null = khong gioi han

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
