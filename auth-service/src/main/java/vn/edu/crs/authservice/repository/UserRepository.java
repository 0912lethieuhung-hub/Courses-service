package vn.edu.crs.authservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.crs.authservice.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
