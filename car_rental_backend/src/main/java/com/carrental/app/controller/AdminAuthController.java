package com.carrental.app.controller;

import com.carrental.app.dto.DeleteCarRequest;
import com.carrental.app.dto.LoginRequest;
import com.carrental.app.dto.SignupRequest;
import com.carrental.app.model.Admin;
import com.carrental.app.repository.AdminRepository;
import com.carrental.app.service.AdminAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    private final AdminAuthService adminAuthService;
    private final AdminRepository adminRepository;

    public AdminAuthController(AdminAuthService adminAuthService, AdminRepository adminRepository) {
        this.adminAuthService = adminAuthService;
        this.adminRepository = adminRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<Admin> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(adminAuthService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<Admin> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(adminAuthService.login(request));
    }

    @DeleteMapping("/account")
    public ResponseEntity<?> deleteAccount(@RequestBody DeleteCarRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        try {
            adminAuthService.deleteAccount(admin.getId(), request.getPassword());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
