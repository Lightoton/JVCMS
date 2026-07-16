package com.javaRangers.jvcms.service;

import com.javaRangers.jvcms.entity.Role;
import com.javaRangers.jvcms.entity.User;
import com.javaRangers.jvcms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public String initFirstAdmin(String email, String rawPassword) {
        if (userRepository.count() > 0) {
            throw new IllegalStateException("System is already initialized. First admin creation is unavailable.");
        }

        User admin = new User();
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(rawPassword));
        admin.setRole(Role.ADMIN);

        try {
            userRepository.saveAndFlush(admin);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Admin was just created by another process.", e);
        }
        return jwtService.generateToken(admin);
    }

    public String authenticate(String email, String rawPassword) {
        
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, rawPassword)
        );

        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return jwtService.generateToken(user);
    }

    @Transactional
    public String createClientUser(String email, String rawPassword) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }

        User client = new User();
        client.setEmail(email);
        client.setPassword(passwordEncoder.encode(rawPassword));
        client.setRole(Role.CLIENT); 

        userRepository.save(client);
        return "User created successfully";
    }

    public java.util.List<java.util.Map<String, String>> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> java.util.Map.of(
                        "email", user.getEmail(),
                        "role", user.getRole().name()
                ))
                .toList();
    }

    @Transactional
    public void deleteUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (user.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Cannot delete an administrator");
        }
        userRepository.delete(user);
    }

    @Transactional
    public void updateUser(String oldEmail, String newEmail, String newRawPassword) {
        User user = userRepository.findByEmail(oldEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (newEmail != null && !newEmail.isBlank() && !newEmail.equals(oldEmail)) {
            if (userRepository.findByEmail(newEmail).isPresent()) {
                throw new IllegalArgumentException("Email already taken");
            }
            user.setEmail(newEmail);
        }

        if (newRawPassword != null && !newRawPassword.isBlank()) {
            if (newRawPassword.length() < 5) {
                throw new IllegalArgumentException("Password is too short");
            }
            user.setPassword(passwordEncoder.encode(newRawPassword));
        }

        userRepository.save(user);
    }
}