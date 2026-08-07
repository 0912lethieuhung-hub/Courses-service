// path: course-
//service/src/main/java/vn/edu/crs/courseservice/entity/Course.java

// purpose: entity anh xa bang course trong database course_db
package vn.edu.crs.course_service.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "course")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "ten_mon_hoc", nullable = false, length = 255)
    private String tenMonHoc;
    @Column(name = "so_tin_chi", nullable = false)
    private Integer soTinChi;
    @Column(name = "so_cho_toi_da", nullable = false)
    private Integer soChoToiDa;
    @Column(name = "so_cho_con_lai", nullable = false)
    private Integer soChoConLai;
}