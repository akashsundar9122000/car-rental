package com.carrental.app.service;

import com.carrental.app.dto.LoginRequest;
import com.carrental.app.dto.SignupRequest;
import com.carrental.app.model.User;
import com.carrental.app.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @Test
    void signup_Success() {
        SignupRequest req = new SignupRequest();
        req.setEmail("test@test.com");
        req.setPassword("password");
        req.setFullName("Test User");

        when(userRepository.existsByEmail("test@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(java.util.UUID.randomUUID());
            return u;
        });

        User result = authService.signup(req);

        assertNotNull(result);
        assertEquals("test@test.com", result.getEmail());
        assertEquals("USER", result.getRole());
    }

    @Test
    void login_Success() {
        LoginRequest req = new LoginRequest();
        req.setEmail("admin@test.com");
        req.setPassword("admin123");

        User admin = new User();
        admin.setEmail("admin@test.com");
        admin.setPasswordHash("encoded");
        admin.setRole("ADMIN");

        when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(admin));
        when(passwordEncoder.matches("admin123", "encoded")).thenReturn(true);

        User result = authService.login(req);

        assertNotNull(result);
        assertEquals("ADMIN", result.getRole());
    }
}
