package com.clickandcollect.backend.user;

import com.clickandcollect.backend.pickup.model.PickupLocation;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstname;

    @Column(nullable = false)
    private String lastname;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column
    private String phone;

    @ManyToOne
    @JoinColumn(name = "favorite_location_id")
    private PickupLocation favoriteLocation;

    // "LOCAL" (email + mot de passe) ou "GOOGLE" (connexion via Google)
    @Column(nullable = false)
    @ColumnDefault("'LOCAL'")
    private String authProvider = "LOCAL";

    @Column(unique = true)
    private String googleId;

    @Column(name = "reset_password_token")
    private String resetPasswordToken;

    @Column(name = "reset_password_token_expiry")
    private LocalDateTime resetPasswordTokenExpiry;

    @Column(nullable = false)
    @ColumnDefault("false")
    private boolean twoFactorEnabled = false;

    @Column(name = "two_factor_code")
    private String twoFactorCode;

    @Column(name = "two_factor_code_expiry")
    private LocalDateTime twoFactorCodeExpiry;
}