package com.javaRangers.jvcms.service;

import com.javaRangers.jvcms.entity.Role;
import com.javaRangers.jvcms.entity.User;
import com.javaRangers.jvcms.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private User adminUser;
    private User clientUser;

    @BeforeEach
    void setUp() {
        adminUser = new User();
        adminUser.setEmail("admin@test.com");
        adminUser.setPassword("encoded");
        adminUser.setRole(Role.ADMIN);

        clientUser = new User();
        clientUser.setEmail("client@test.com");
        clientUser.setPassword("encoded");
        clientUser.setRole(Role.CLIENT);
    }

    @Test
    void testInitFirstAdmin_Success() {
        when(userRepository.count()).thenReturn(0L);
        when(passwordEncoder.encode(any())).thenReturn("encoded");
        when(jwtService.generateToken(any())).thenReturn("token");

        String token = authService.initFirstAdmin("admin@test.com", "pass");

        assertEquals("token", token);
        verify(userRepository, times(1)).saveAndFlush(any(User.class));
    }

    @Test
    void testInitFirstAdmin_FailsIfUsersExist() {
        when(userRepository.count()).thenReturn(1L);

        assertThrows(IllegalStateException.class, () -> {
            authService.initFirstAdmin("admin@test.com", "pass");
        });
    }

    @Test
    void testCreateClientUser_Success() {
        when(userRepository.findByEmail("new@test.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("pass")).thenReturn("encoded");

        String result = authService.createClientUser("new@test.com", "pass");
        
        assertNotNull(result);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testDeleteUser_Success() {
        when(userRepository.findByEmail("client@test.com")).thenReturn(Optional.of(clientUser));
        
        authService.deleteUser("client@test.com");
        
        verify(userRepository, times(1)).delete(clientUser);
    }

    @Test
    void testDeleteUser_FailsOnAdmin() {
        when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(adminUser));
        
        assertThrows(IllegalArgumentException.class, () -> {
            authService.deleteUser("admin@test.com");
        });
        
        verify(userRepository, never()).delete(any());
    }

    @Test
    void testUpdateUser_Success() {
        when(userRepository.findByEmail("client@test.com")).thenReturn(Optional.of(clientUser));
        when(passwordEncoder.encode("newpass")).thenReturn("newencoded");
        
        authService.updateUser("client@test.com", "newemail@test.com", "newpass");
        
        assertEquals("newemail@test.com", clientUser.getEmail());
        assertEquals("newencoded", clientUser.getPassword());
        verify(userRepository, times(1)).save(clientUser);
    }
}
