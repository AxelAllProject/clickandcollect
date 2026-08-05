package com.clickandcollect.backend.admin;

import com.clickandcollect.backend.user.UserResponseDTO;
import com.clickandcollect.backend.common.exception.ResourceNotFoundException;
import com.clickandcollect.backend.user.Role;
import com.clickandcollect.backend.user.User;
import com.clickandcollect.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponseDTO promoteToAdmin(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        user.setRole(Role.ADMIN);
        User saved = userRepository.save(user);
        return mapToResponseDTO(saved);
    }

    public List<UserResponseDTO> listUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public UserResponseDTO updateUserRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        user.setRole(Role.valueOf(role.toUpperCase()));
        User saved = userRepository.save(user);
        return mapToResponseDTO(saved);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    private UserResponseDTO mapToResponseDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstname(),
                user.getLastname(),
                user.getRole().name(),
                null
        );
    }
}
