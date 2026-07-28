package com.clickandcollect.backend.controller;

import com.clickandcollect.backend.model.User;
import com.clickandcollect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

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
}
