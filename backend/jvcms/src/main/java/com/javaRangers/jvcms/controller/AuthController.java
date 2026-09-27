package com.javaRangers.jvcms.controller;

import com.javaRangers.jvcms.dto.AuthRequest;
import com.javaRangers.jvcms.dto.AuthResponse;
import com.javaRangers.jvcms.dto.UpdateUserRequest;
import com.javaRangers.jvcms.service.AuthService;
import com.javaRangers.jvcms.service.LoginAttemptService;
import com.javaRangers.jvcms.repository.UserRepository; 
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository; 
    private final LoginAttemptService loginAttemptService;

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty() || !xfHeader.contains(request.getRemoteAddr())) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    
    @GetMapping("/init-check")
    public ResponseEntity<Boolean> checkInit() {
        return ResponseEntity.ok(userRepository.count() > 0);
    }

    @PostMapping("/init")
    public ResponseEntity<AuthResponse> initFirstAdmin(@RequestBody AuthRequest request, jakarta.servlet.http.HttpServletResponse httpResponse) {
        String token = authService.initFirstAdmin(request.email(), request.password());
        org.springframework.http.ResponseCookie springCookie = org.springframework.http.ResponseCookie.from("jwt_token", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("Lax")
                .maxAge(java.time.Duration.ofDays(1))
                .build();
        httpResponse.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, springCookie.toString());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request, HttpServletRequest httpRequest, jakarta.servlet.http.HttpServletResponse httpResponse) {
        String ip = getClientIP(httpRequest);
        if (loginAttemptService.isBlocked(ip)) {
            throw new LockedException("Too many failed login attempts. Please wait 15 minutes.");
        }
        
        try {
            String token = authService.authenticate(request.email(), request.password());
            loginAttemptService.loginSucceeded(ip);
            
            org.springframework.http.ResponseCookie springCookie = org.springframework.http.ResponseCookie.from("jwt_token", token)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .sameSite("Lax")
                    .maxAge(java.time.Duration.ofDays(1))
                    .build();
            httpResponse.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, springCookie.toString());
            
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (BadCredentialsException ex) {
            loginAttemptService.loginFailed(ip);
            throw ex;
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(jakarta.servlet.http.HttpServletResponse httpResponse) {
        org.springframework.http.ResponseCookie springCookie = org.springframework.http.ResponseCookie.from("jwt_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .sameSite("Lax")
                .maxAge(0)
                .build();
        httpResponse.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, springCookie.toString());
        return ResponseEntity.noContent().build();
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

    @PutMapping("/users/{email}")
    public ResponseEntity<Void> updateUser(@PathVariable String email, @RequestBody UpdateUserRequest request) {
        authService.updateUser(email, request.newEmail(), request.newPassword());
        return ResponseEntity.ok().build();
    }
}