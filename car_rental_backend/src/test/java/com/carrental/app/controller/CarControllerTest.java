package com.carrental.app.controller;

import com.carrental.app.model.Car;
import com.carrental.app.service.CarService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;

import com.carrental.app.model.Admin;
import com.carrental.app.repository.AdminRepository;
import com.carrental.app.service.CarwaleScraperService;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class CarControllerTest {

    @Mock
    private CarService carService;

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private CarwaleScraperService scraperService;

    @InjectMocks
    private CarController carController;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getAllCars_Success() {
        when(carService.getAllCars()).thenReturn(Collections.emptyList());

        ResponseEntity<List<Car>> response = carController.getAllCars();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
    }

    @Test
    void createCar_Success() {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("admin@test.com");

        Admin admin = new Admin();
        admin.setId(UUID.randomUUID());
        admin.setEmail("admin@test.com");
        when(adminRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(admin));

        Car car = new Car();
        car.setName("Test Car");

        when(carService.createCar(any(Car.class))).thenReturn(car);

        ResponseEntity<Car> response = carController.createCar(car);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("Test Car", response.getBody().getName());
    }
}
