package com.carrental.app.controller;

import com.carrental.app.model.Admin;
import com.carrental.app.repository.AdminRepository;
import com.carrental.app.dto.BookingRequest;
import com.carrental.app.model.Booking;
import com.carrental.app.model.User;
import com.carrental.app.repository.UserRepository;
import com.carrental.app.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    public BookingController(BookingService bookingService, UserRepository userRepository,
            AdminRepository adminRepository) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request) {
        // For MVP, getting user from email (assuming Basic Auth or just passing ID if
        // we changing architecture)
        // Ideally we get from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(bookingService.createBooking(user.getId(), request));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getUserBookings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(bookingService.getUserBookings(user.getId()));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        return ResponseEntity.ok(bookingService.getDealerBookings(admin.getId()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable("id") java.util.UUID bookingId,
            @RequestParam String status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        boolean isAdmin = adminRepository.findByEmail(email).isPresent();
        boolean isUser = userRepository.findByEmail(email).isPresent();

        if (!isAdmin && !isUser) {
            throw new RuntimeException("User/Admin not found");
        }

        // In a real app, verify the user/admin owns the related resource
        return ResponseEntity.ok(bookingService.updateBookingStatus(bookingId, status));
    }
}
