package com.clickandcollect.backend.controller;

import com.clickandcollect.backend.model.User;
import com.clickandcollect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

import com.clickandcollect.backend.dto.UserResponseDTO;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/promote")
    public User promoteToAdmin(@RequestBody Map<String, String> body){
        String email = body.get("email");
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        user.setRole("ADMIN");
        return userRepository.save(user);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/users")
    public List<UserResponseDTO> listUsers(){
        return userRepository.findAll().stream()
                .map(u -> new UserResponseDTO(u.getId(), u.getEmail(), u.getFirstname(), u.getLastname(), u.getRole(), null))
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/users/{id}/role")
    public UserResponseDTO updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body){
        String role = body.get("role");
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        user.setRole(role);
        User saved = userRepository.save(user);
        return new UserResponseDTO(saved.getId(), saved.getEmail(), saved.getFirstname(), saved.getLastname(), saved.getRole(), null);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id){
        userRepository.deleteById(id);
    }
}
