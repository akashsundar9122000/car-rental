package com.carrental.app.controller;

import com.carrental.app.model.Admin;
import com.carrental.app.model.Booking;
import com.carrental.app.repository.AdminRepository;
import com.carrental.app.service.BookingService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingControllerTest {

    @Mock
    private BookingService bookingService;

    @Mock
    private AdminRepository adminRepository;

    @InjectMocks
    private BookingController bookingController;

    @Test
    void getAllBookings_Success() {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("admin@test.com");

        Admin admin = new Admin();
        admin.setId(UUID.randomUUID());
        when(adminRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(admin));

        when(bookingService.getDealerBookings(any())).thenReturn(Collections.emptyList());

        ResponseEntity<List<Booking>> response = bookingController.getAllBookings();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
    }
}
