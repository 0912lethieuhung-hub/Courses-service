package vn.edu.crs.authservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.crs.authservice.entity.ApiKey;

import java.util.Optional;

public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {
    Optional<ApiKey> findByKeyValue(String keyValue);
}
