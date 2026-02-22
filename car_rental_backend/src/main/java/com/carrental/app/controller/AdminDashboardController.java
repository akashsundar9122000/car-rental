package com.carrental.app.controller;

import com.carrental.app.dto.SalesDataDto;
import com.carrental.app.model.Admin;
import com.carrental.app.repository.AdminRepository;
import com.carrental.app.service.AdminDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;
    private final AdminRepository adminRepository;

    public AdminDashboardController(AdminDashboardService adminDashboardService, AdminRepository adminRepository) {
        this.adminDashboardService = adminDashboardService;
        this.adminRepository = adminRepository;
    }

    @GetMapping("/sales")
    public ResponseEntity<SalesDataDto> getSalesData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        SalesDataDto data = adminDashboardService.getSalesData(admin.getId());
        return ResponseEntity.ok(data);
    }
}
