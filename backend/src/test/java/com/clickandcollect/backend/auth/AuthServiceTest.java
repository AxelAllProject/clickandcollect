package com.clickandcollect.backend.auth;

import com.clickandcollect.backend.auth.dto.ForgotPasswordRequestDTO;
import com.clickandcollect.backend.auth.dto.GoogleLoginRequestDTO;
import com.clickandcollect.backend.auth.dto.GoogleTokenInfoDTO;
import com.clickandcollect.backend.auth.dto.LoginRequestDTO;
import com.clickandcollect.backend.auth.dto.LoginResponseDTO;
import com.clickandcollect.backend.auth.dto.RegisterRequestDTO;
import com.clickandcollect.backend.auth.dto.ResetPasswordRequestDTO;
import com.clickandcollect.backend.auth.dto.TwoFactorResendRequestDTO;
import com.clickandcollect.backend.auth.dto.TwoFactorVerifyRequestDTO;
import com.clickandcollect.backend.auth.exception.EmailAlreadyUsedException;
import com.clickandcollect.backend.auth.exception.InvalidCredentialsException;
import com.clickandcollect.backend.auth.exception.InvalidTokenException;
import com.clickandcollect.backend.auth.service.AuthService;
import com.clickandcollect.backend.auth.service.EmailService;
import com.clickandcollect.backend.auth.service.GoogleAuthService;
import com.clickandcollect.backend.auth.service.JwtService;
import com.clickandcollect.backend.user.Role;
import com.clickandcollect.backend.user.User;
import com.clickandcollect.backend.user.UserRepository;
import com.clickandcollect.backend.user.UserResponseDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

/**
 * Tests unitaires de l'authentification : inscription, connexion, 2FA,
 * mot de passe oublie et connexion Google.
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private EmailService emailService;
    @Mock private GoogleAuthService googleAuthService;

    @InjectMocks private AuthService authService;

    private static User compte(String email, String motDePasseHashe) {
        User user = new User();
        user.setId(1L);
        user.setEmail(email);
        user.setFirstname("Camille");
        user.setLastname("Client");
        user.setPassword(motDePasseHashe);
        user.setRole(Role.USER);
        return user;
    }

    @Nested
    @DisplayName("Inscription")
    class Inscription {

        @Test
        @DisplayName("Le mot de passe est hashe, jamais stocke en clair")
        void register_hasheLeMotDePasse() {
            RegisterRequestDTO request = new RegisterRequestDTO("Camille", "Client", "camille@test.fr", "MotDePasse123!");
            when(userRepository.existsByEmail("camille@test.fr")).thenReturn(false);
            when(passwordEncoder.encode("MotDePasse123!")).thenReturn("$2a$10$hash");
            when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
            when(jwtService.generateToken(any(User.class))).thenReturn("token");

            UserResponseDTO reponse = authService.register(request);

            ArgumentCaptor<User> capture = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(capture.capture());
            assertThat(capture.getValue().getPassword()).isEqualTo("$2a$10$hash");
            assertThat(capture.getValue().getPassword()).isNotEqualTo("MotDePasse123!");
            assertThat(capture.getValue().getRole()).isEqualTo(Role.USER);
            assertThat(reponse.getEmail()).isEqualTo("camille@test.fr");
        }

        @Test
        @DisplayName("Un nouvel inscrit ne peut pas se donner le role ADMIN")
        void register_forceLeRoleUser() {
            when(userRepository.existsByEmail(anyString())).thenReturn(false);
            when(passwordEncoder.encode(anyString())).thenReturn("hash");
            when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
            when(jwtService.generateToken(any(User.class))).thenReturn("token");

            UserResponseDTO reponse = authService.register(
                    new RegisterRequestDTO("Mallory", "Pirate", "mallory@test.fr", "MotDePasse123!"));

            assertThat(reponse.getRole()).isEqualTo("USER");
        }

        @Test
        @DisplayName("Un email deja pris est refuse")
        void register_refuseUnEmailDejaPris() {
            when(userRepository.existsByEmail("camille@test.fr")).thenReturn(true);

            assertThatThrownBy(() -> authService.register(
                    new RegisterRequestDTO("Camille", "Client", "camille@test.fr", "MotDePasse123!")))
                    .isInstanceOf(EmailAlreadyUsedException.class);

            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Connexion")
    class Connexion {

        @Test
        @DisplayName("Un mot de passe correct renvoie un token")
        void login_ok() {
            User user = compte("camille@test.fr", "$2a$10$hash");
            when(userRepository.findByEmail("camille@test.fr")).thenReturn(Optional.of(user));
            when(passwordEncoder.matches("MotDePasse123!", "$2a$10$hash")).thenReturn(true);
            when(jwtService.generateToken(user)).thenReturn("jwt-token");

            LoginResponseDTO reponse = authService.login(new LoginRequestDTO("camille@test.fr", "MotDePasse123!"));

            assertThat(reponse.isTwoFactorRequired()).isFalse();
            assertThat(reponse.getUser().getToken()).isEqualTo("jwt-token");
        }

        @Test
        @DisplayName("Un mauvais mot de passe est refuse sans token")
        void login_mauvaisMotDePasse() {
            User user = compte("camille@test.fr", "$2a$10$hash");
            when(userRepository.findByEmail("camille@test.fr")).thenReturn(Optional.of(user));
            when(passwordEncoder.matches("mauvais", "$2a$10$hash")).thenReturn(false);

            assertThatThrownBy(() -> authService.login(new LoginRequestDTO("camille@test.fr", "mauvais")))
                    .isInstanceOf(InvalidCredentialsException.class);

            verifyNoInteractions(jwtService);
        }

        @Test
        @DisplayName("Email inconnu et mauvais mot de passe donnent le meme message (pas d'enumeration de comptes)")
        void login_memeMessagePourEmailInconnu() {
            User user = compte("camille@test.fr", "$2a$10$hash");
            when(userRepository.findByEmail("camille@test.fr")).thenReturn(Optional.of(user));
            when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);
            when(userRepository.findByEmail("inconnu@test.fr")).thenReturn(Optional.empty());

            Throwable mauvaisMdp = catchThrowable(
                    () -> authService.login(new LoginRequestDTO("camille@test.fr", "mauvais")));
            Throwable emailInconnu = catchThrowable(
                    () -> authService.login(new LoginRequestDTO("inconnu@test.fr", "mauvais")));

            assertThat(mauvaisMdp).isInstanceOf(InvalidCredentialsException.class);
            assertThat(emailInconnu).isInstanceOf(InvalidCredentialsException.class);
            assertThat(emailInconnu.getMessage()).isEqualTo(mauvaisMdp.getMessage());
        }
    }

    @Nested
    @DisplayName("Double authentification")
    class DoubleAuthentification {

        @Test
        @DisplayName("Avec la 2FA active, la connexion n'emet aucun token et envoie un code")
        void login_avecDeuxFacteurs_nEmetPasDeToken() {
            User user = compte("camille@test.fr", "$2a$10$hash");
            user.setTwoFactorEnabled(true);
            when(userRepository.findByEmail("camille@test.fr")).thenReturn(Optional.of(user));
            when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

            LoginResponseDTO reponse = authService.login(new LoginRequestDTO("camille@test.fr", "MotDePasse123!"));

            assertThat(reponse.isTwoFactorRequired()).isTrue();
            assertThat(reponse.getUser()).isNull();
            verifyNoInteractions(jwtService);
            verify(emailService).sendTwoFactorCode(eq("camille@test.fr"), anyString());
        }

        @Test
        @DisplayName("Le code envoye fait 6 chiffres et expire dans 10 minutes")
        void codeDeVerification_sixChiffresEtExpiration() {
            User user = compte("camille@test.fr", "$2a$10$hash");
            user.setTwoFactorEnabled(true);
            when(userRepository.findByEmail("camille@test.fr")).thenReturn(Optional.of(user));
            when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

            authService.login(new LoginRequestDTO("camille@test.fr", "MotDePasse123!"));

            ArgumentCaptor<String> code = ArgumentCaptor.forClass(String.class);
            verify(emailService).sendTwoFactorCode(anyString(), code.capture());
            assertThat(code.getValue()).matches("\\d{6}");
            assertThat(user.getTwoFactorCodeExpiry()).isBetween(
                    LocalDateTime.now().plusMinutes(9), LocalDateTime.now().plusMinutes(11));
        }

        @Test
        @DisplayName("Le bon code renvoie un token et consomme le code")
        void verifyTwoFactorCode_ok() {
            User user = compte("camille@test.fr", "$2a$10$hash");
            user.setTwoFactorEnabled(true);
            user.setTwoFactorCode("123456");
            user.setTwoFactorCodeExpiry(LocalDateTime.now().plusMinutes(5));
            when(userRepository.findByEmail("camille@test.fr")).thenReturn(Optional.of(user));
            when(jwtService.generateToken(user)).thenReturn("jwt-token");

            UserResponseDTO reponse = authService.verifyTwoFactorCode(
                    new TwoFactorVerifyRequestDTO("camille@test.fr", "123456"));

            assertThat(reponse.getToken()).isEqualTo("jwt-token");
            // Code a usage unique : il doit etre efface apres verification.
            assertThat(user.getTwoFactorCode()).isNull();
            assertThat(user.getTwoFactorCodeExpiry()).isNull();
        }

        @Test
        @DisplayName("Un mauvais code est refuse")
        void verifyTwoFactorCode_mauvaisCode() {
            User user = compte("camille@test.fr", "$2a$10$hash");
            user.setTwoFactorCode("123456");
            user.setTwoFactorCodeExpiry(LocalDateTime.now().plusMinutes(5));
            when(userRepository.findByEmail("camille@test.fr")).thenReturn(Optional.of(user));

            assertThatThrownBy(() -> authService.verifyTwoFactorCode(
                    new TwoFactorVerifyRequestDTO("camille@test.fr", "000000")))
                    .isInstanceOf(InvalidCredentialsException.class);

            verifyNoInteractions(jwtService);
        }

        @Test
        @DisplayName("Un code expire est refuse")
        void verifyTwoFactorCode_codeExpire() {
            User user = compte("camille@test.fr", "$2a$10$hash");
            user.setTwoFactorCode("123456");
            user.setTwoFactorCodeExpiry(LocalDateTime.now().minusMinutes(1));
            when(userRepository.findByEmail("camille@test.fr")).thenReturn(Optional.of(user));

            assertThatThrownBy(() -> authService.verifyTwoFactorCode(
                    new TwoFactorVerifyRequestDTO("camille@test.fr", "123456")))
                    .isInstanceOf(InvalidCredentialsException.class);

            verifyNoInteractions(jwtService);
        }

        @Test
        @DisplayName("Aucun code n'est renvoye si la 2FA n'est pas activee")
        void resendTwoFactorCode_refuseSiDesactivee() {
            User user = compte("camille@test.fr", "$2a$10$hash");
            when(userRepository.findByEmail("camille@test.fr")).thenReturn(Optional.of(user));

            assertThatThrownBy(() -> authService.resendTwoFactorCode(
                    new TwoFactorResendRequestDTO("camille@test.fr")))
                    .isInstanceOf(InvalidCredentialsException.class);

            verifyNoInteractions(emailService);
        }
    }

    @Nested
    @DisplayName("Mot de passe oublie")
    class MotDePasseOublie {

        @Test
        @DisplayName("Un email inconnu ne leve pas d'erreur et n'envoie rien")
        void forgotPassword_neRevelePasLesComptes() {
            when(userRepository.findByEmail("inconnu@test.fr")).thenReturn(Optional.empty());

            authService.forgotPassword(new ForgotPasswordRequestDTO("inconnu@test.fr"));

            verifyNoInteractions(emailService);
        }

        @Test
        @DisplayName("Un email connu recoit un token valable 30 minutes")
        void forgotPassword_genereUnToken() {
            User user = compte("camille@test.fr", "$2a$10$hash");
            when(userRepository.findByEmail("camille@test.fr")).thenReturn(Optional.of(user));

            authService.forgotPassword(new ForgotPasswordRequestDTO("camille@test.fr"));

            assertThat(user.getResetPasswordToken()).isNotBlank();
            assertThat(user.getResetPasswordTokenExpiry()).isBetween(
                    LocalDateTime.now().plusMinutes(29), LocalDateTime.now().plusMinutes(31));
            verify(emailService).sendPasswordResetEmail("camille@test.fr", user.getResetPasswordToken());
        }

        @Test
        @DisplayName("Le token de reinitialisation est a usage unique")
        void resetPassword_consommeLeToken() {
            User user = compte("camille@test.fr", "$2a$10$ancien");
            user.setResetPasswordToken("token-valide");
            user.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(10));
            when(userRepository.findByResetPasswordToken("token-valide")).thenReturn(Optional.of(user));
            when(passwordEncoder.encode("NouveauMotDePasse1!")).thenReturn("$2a$10$nouveau");

            authService.resetPassword(new ResetPasswordRequestDTO("token-valide", "NouveauMotDePasse1!"));

            assertThat(user.getPassword()).isEqualTo("$2a$10$nouveau");
            assertThat(user.getResetPasswordToken()).isNull();
            assertThat(user.getResetPasswordTokenExpiry()).isNull();
        }

        @Test
        @DisplayName("Un token expire ne permet pas de changer le mot de passe")
        void resetPassword_tokenExpire() {
            User user = compte("camille@test.fr", "$2a$10$ancien");
            user.setResetPasswordToken("token-expire");
            user.setResetPasswordTokenExpiry(LocalDateTime.now().minusMinutes(1));
            when(userRepository.findByResetPasswordToken("token-expire")).thenReturn(Optional.of(user));

            assertThatThrownBy(() -> authService.resetPassword(
                    new ResetPasswordRequestDTO("token-expire", "NouveauMotDePasse1!")))
                    .isInstanceOf(InvalidTokenException.class);

            assertThat(user.getPassword()).isEqualTo("$2a$10$ancien");
        }

        @Test
        @DisplayName("Un token inconnu est refuse")
        void resetPassword_tokenInconnu() {
            when(userRepository.findByResetPasswordToken("bidon")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> authService.resetPassword(
                    new ResetPasswordRequestDTO("bidon", "NouveauMotDePasse1!")))
                    .isInstanceOf(InvalidTokenException.class);
        }
    }

    @Nested
    @DisplayName("Connexion Google")
    class ConnexionGoogle {

        private GoogleTokenInfoDTO tokenInfo() {
            GoogleTokenInfoDTO info = new GoogleTokenInfoDTO();
            info.setSub("google-sub-123");
            info.setEmail("camille@gmail.com");
            info.setGivenName("Camille");
            info.setFamilyName("Client");
            info.setEmailVerified("true");
            return info;
        }

        @Test
        @DisplayName("Un compte inconnu est cree avec le role USER et un mot de passe inutilisable")
        void loginWithGoogle_creeLeCompte() {
            when(googleAuthService.verify("id-token")).thenReturn(tokenInfo());
            when(userRepository.findByGoogleId("google-sub-123")).thenReturn(Optional.empty());
            when(userRepository.findByEmail("camille@gmail.com")).thenReturn(Optional.empty());
            when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$aleatoire");
            when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
            when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");

            UserResponseDTO reponse = authService.loginWithGoogle(new GoogleLoginRequestDTO("id-token"));

            ArgumentCaptor<User> capture = ArgumentCaptor.forClass(User.class);
            verify(userRepository).save(capture.capture());
            assertThat(capture.getValue().getAuthProvider()).isEqualTo("GOOGLE");
            assertThat(capture.getValue().getGoogleId()).isEqualTo("google-sub-123");
            assertThat(capture.getValue().getRole()).isEqualTo(Role.USER);
            assertThat(reponse.getToken()).isEqualTo("jwt-token");
        }

        @Test
        @DisplayName("Un compte local existant est relie au compte Google, sans doublon")
        void loginWithGoogle_relieLeCompteExistant() {
            User existant = compte("camille@gmail.com", "$2a$10$hash");
            when(googleAuthService.verify("id-token")).thenReturn(tokenInfo());
            when(userRepository.findByGoogleId("google-sub-123")).thenReturn(Optional.empty());
            when(userRepository.findByEmail("camille@gmail.com")).thenReturn(Optional.of(existant));
            when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
            when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");

            authService.loginWithGoogle(new GoogleLoginRequestDTO("id-token"));

            assertThat(existant.getGoogleId()).isEqualTo("google-sub-123");
            assertThat(existant.getId()).isEqualTo(1L);
            // Le mot de passe local n'est pas ecrase par la liaison Google.
            assertThat(existant.getPassword()).isEqualTo("$2a$10$hash");
        }

        @Test
        @DisplayName("Un jeton Google invalide est refuse")
        void loginWithGoogle_jetonInvalide() {
            when(googleAuthService.verify("mauvais-token"))
                    .thenThrow(new InvalidCredentialsException("Jeton Google invalide"));

            assertThatThrownBy(() -> authService.loginWithGoogle(new GoogleLoginRequestDTO("mauvais-token")))
                    .isInstanceOf(InvalidCredentialsException.class);

            verifyNoInteractions(userRepository, jwtService);
        }
    }
}
