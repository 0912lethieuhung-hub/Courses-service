package vn.edu.crs.course_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private Long id;

    @NotBlank(message = "Ten mon hoc khong duoc de trong")
    private String tenMonHoc;

    @NotNull(message = "So tin chi khong duoc de trong")
    @Min(value = 1, message = "So tin chi phai lon hon 0")
    private Integer soTinChi;

    @NotNull(message = "So cho toi da khong duoc de trong")
    @Min(value = 1, message = "So cho toi da phai lon hon 0")
    private Integer soChoToiDa;

    // Khong bat buoc client gui khi tao moi; se tu gan = soChoToiDa trong Service
    private Integer soChoConLai;
}