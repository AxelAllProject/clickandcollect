package com.clickandcollect.backend.auth.service;

import com.clickandcollect.backend.auth.dto.ForgotPasswordRequestDTO;
import com.clickandcollect.backend.auth.dto.GoogleLoginRequestDTO;
import com.clickandcollect.backend.auth.dto.GoogleTokenInfoDTO;
import com.clickandcollect.backend.auth.dto.LoginRequestDTO;
import com.clickandcollect.backend.auth.dto.LoginResponseDTO;
import com.clickandcollect.backend.auth.dto.RegisterRequestDTO;
import com.clickandcollect.backend.auth.dto.ResetPasswordRequestDTO;
import com.clickandcollect.backend.auth.dto.TwoFactorResendRequestDTO;
import com.clickandcollect.backend.auth.dto.TwoFactorVerifyRequestDTO;
import com.clickandcollect.backend.user.UserResponseDTO;
import com.clickandcollect.backend.auth.exception.EmailAlreadyUsedException;
import com.clickandcollect.backend.auth.exception.InvalidCredentialsException;
import com.clickandcollect.backend.auth.exception.InvalidTokenException;
import com.clickandcollect.backend.user.Role;
import com.clickandcollect.backend.user.User;
import com.clickandcollect.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class AuthService {
    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final GoogleAuthService googleAuthService;

    private final SecureRandom secureRandom = new SecureRandom();

    public UserResponseDTO register(RegisterRequestDTO request){
        if (userRepository.existsByEmail(request.getEmail())){
            throw new EmailAlreadyUsedException("Cet email est déja utilisé");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setRole(Role.USER);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        return buildUserResponse(savedUser);
    }

    public LoginResponseDTO login(LoginRequestDTO request){
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Identifiants incorrects"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new InvalidCredentialsException("Identifiants incorrects");
        }

        if (user.isTwoFactorEnabled()) {
            sendTwoFactorCode(user);
            return new LoginResponseDTO(true, null);
        }

        return new LoginResponseDTO(false, buildUserResponse(user));
    }

    public UserResponseDTO verifyTwoFactorCode(TwoFactorVerifyRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Identifiants incorrects"));

        if (user.getTwoFactorCode() == null
                || user.getTwoFactorCodeExpiry() == null
                || user.getTwoFactorCodeExpiry().isBefore(LocalDateTime.now())
                || !user.getTwoFactorCode().equals(request.getCode())) {
            throw new InvalidCredentialsException("Code de vérification invalide ou expiré");
        }

        user.setTwoFactorCode(null);
        user.setTwoFactorCodeExpiry(null);
        userRepository.save(user);

        return buildUserResponse(user);
    }

    public void resendTwoFactorCode(TwoFactorResendRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Identifiants incorrects"));

        if (!user.isTwoFactorEnabled()) {
            throw new InvalidCredentialsException("La double authentification n'est pas activée pour ce compte");
        }

        sendTwoFactorCode(user);
    }

    public void forgotPassword(ForgotPasswordRequestDTO request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            user.setResetPasswordToken(token);
            user.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(30));
            userRepository.save(user);
            emailService.sendPasswordResetEmail(user.getEmail(), token);
        });
        // Même réponse que le compte existe ou non, pour ne pas révéler si un email est inscrit.
    }

    public void resetPassword(ResetPasswordRequestDTO request) {
        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new InvalidTokenException("Lien de réinitialisation invalide ou expiré"));

        if (user.getResetPasswordTokenExpiry() == null || user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new InvalidTokenException("Lien de réinitialisation invalide ou expiré");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);
    }

    public UserResponseDTO loginWithGoogle(GoogleLoginRequestDTO request) {
        GoogleTokenInfoDTO tokenInfo = googleAuthService.verify(request.getIdToken());

        User user = userRepository.findByGoogleId(tokenInfo.getSub())
                .or(() -> userRepository.findByEmail(tokenInfo.getEmail()))
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(tokenInfo.getEmail());
                    newUser.setFirstname(tokenInfo.getGivenName() != null ? tokenInfo.getGivenName() : "Utilisateur");
                    newUser.setLastname(tokenInfo.getFamilyName() != null ? tokenInfo.getFamilyName() : "Google");
                    newUser.setRole(Role.USER);
                    newUser.setAuthProvider("GOOGLE");
                    // Compte créé via Google : mot de passe inutilisable généré aléatoirement,
                    // la connexion locale par mot de passe restera toujours refusée pour ce compte.
                    newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                    return newUser;
                });

        // Email vérifié par Google : on peut relier ce compte Google à un compte local existant.
        user.setGoogleId(tokenInfo.getSub());
        User savedUser = userRepository.save(user);

        return buildUserResponse(savedUser);
    }

    private void sendTwoFactorCode(User user) {
        String code = String.format("%06d", secureRandom.nextInt(1_000_000));
        user.setTwoFactorCode(code);
        user.setTwoFactorCodeExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);
        emailService.sendTwoFactorCode(user.getEmail(), code);
    }

    private UserResponseDTO buildUserResponse(User user) {
        String token = jwtService.generateToken(user);
        return new UserResponseDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstname(),
                user.getLastname(),
                user.getRole().name(),
                token
        );
    }
}
