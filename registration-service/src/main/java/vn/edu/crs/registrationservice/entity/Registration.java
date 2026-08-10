package vn.edu.crs.registrationservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "registration")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    // Chi luu dang so, KHONG dung @ManyToOne toi Course vi Course nam o database khac
    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "trang_thai", nullable = false, length = 20)
    private String trangThai; // "DA_DANG_KY" / "DA_HUY"

    @Column(name = "ngay_dang_ky", nullable = false)
    private LocalDateTime ngayDangKy;
}