package com.carrental.app.service;

import com.carrental.app.dto.LoginRequest;
import com.carrental.app.dto.SignupRequest;
import com.carrental.app.model.Admin;
import com.carrental.app.repository.AdminRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class AdminAuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminAuthService(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Admin signup(SignupRequest request) {
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        Admin admin = new Admin();
        admin.setEmail(request.getEmail());
        admin.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        admin.setFullName(request.getFullName());
        admin.setRole("ADMIN");

        return adminRepository.save(admin);
    }

    public Admin login(LoginRequest request) {
        Optional<Admin> adminOpt = adminRepository.findByEmail(request.getEmail());
        if (adminOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        Admin admin = adminOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return admin;
    }

    @Transactional
    public void deleteAccount(UUID adminId, String password) {
        Admin admin = adminRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        if (!passwordEncoder.matches(password, admin.getPasswordHash())) {
            throw new RuntimeException("Invalid password. Account deletion aborted.");
        }
        adminRepository.delete(admin);
    }
}
