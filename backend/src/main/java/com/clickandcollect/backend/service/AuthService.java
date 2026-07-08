package com.clickandcollect.backend.service;

import com.clickandcollect.backend.dto.LoginRequestDTO;
import com.clickandcollect.backend.dto.RegisterRequestDTO;
import com.clickandcollect.backend.dto.UserResponseDTO;
import com.clickandcollect.backend.model.User;
import com.clickandcollect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class AuthService {
    private final UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserResponseDTO register(RegisterRequestDTO request){
        if (userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Cet email est déja utilisé");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setRole("USER");
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);

        String savedToken = jwtService.generateToken(savedUser);

        UserResponseDTO userResponse = new UserResponseDTO(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstname(),
                savedUser.getLastname(),
                savedUser.getRole(),
                savedToken
        );
        return userResponse;
    }

    public UserResponseDTO login(LoginRequestDTO request){
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Identifiants incorrects"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new RuntimeException("Identifiants incorrects");
        }

        String savedToken = jwtService.generateToken(user);

        UserResponseDTO userResponse = new UserResponseDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstname(),
                user.getLastname(),
                user.getRole(),
                savedToken

        );
        return userResponse;
    }
}
