package com.clickandcollect.backend.admin;

import com.clickandcollect.backend.user.UserResponseDTO;
import com.clickandcollect.backend.admin.UserService;
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

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/promote")
    public UserResponseDTO promoteToAdmin(@RequestBody Map<String, String> body){
        return userService.promoteToAdmin(body.get("email"));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/users")
    public List<UserResponseDTO> listUsers(){
        return userService.listUsers();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/users/{id}/role")
    public UserResponseDTO updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body){
        return userService.updateUserRole(id, body.get("role"));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
    }
}
