package com.clickandcollect.backend.user;

import com.clickandcollect.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    Optional<User> findByResetPasswordToken(String resetPasswordToken);
    Optional<User> findByGoogleId(String googleId);
    List<User> findByFavoriteLocationId(Long favoriteLocationId);
}
