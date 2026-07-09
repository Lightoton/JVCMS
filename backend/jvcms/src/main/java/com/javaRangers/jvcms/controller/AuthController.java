package com.javaRangers.jvcms.controller;

import com.javaRangers.jvcms.dto.AuthRequest;
import com.javaRangers.jvcms.dto.AuthResponse;
import com.javaRangers.jvcms.service.AuthService;
import com.javaRangers.jvcms.repository.UserRepository; 
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository; 

    
    @GetMapping("/init-check")
    public ResponseEntity<Boolean> checkInit() {
        return ResponseEntity.ok(userRepository.count() > 0);
    }

    @PostMapping("/init")
    public ResponseEntity<AuthResponse> initFirstAdmin(@RequestBody AuthRequest request) {
        String token = authService.initFirstAdmin(request.email(), request.password());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        String token = authService.authenticate(request.email(), request.password());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/create-client")
    public ResponseEntity<Map<String, String>> createClient(@RequestBody AuthRequest request) {
        String result = authService.createClientUser(request.email(), request.password());
        return ResponseEntity.ok(Map.of("message", result));
    }

    @GetMapping("/users")
    public ResponseEntity<java.util.List<java.util.Map<String, String>>> getUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @DeleteMapping("/users/{email}")
    public ResponseEntity<Void> deleteUser(@PathVariable String email) {
        authService.deleteUser(email);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{email}/password")
    public ResponseEntity<Void> changePassword(@PathVariable String email, @RequestBody AuthRequest request) {
        authService.changePassword(email, request.password());
        return ResponseEntity.ok().build();
    }
}