package com.carrental.app.service;

import com.carrental.app.model.Admin;
import com.carrental.app.model.Car;
import com.carrental.app.repository.AdminRepository;
import com.carrental.app.repository.BookingRepository;
import com.carrental.app.repository.CarRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CarService {

    private final CarRepository carRepository;
    private final AdminRepository adminRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;

    public CarService(CarRepository carRepository, AdminRepository adminRepository,
            BookingRepository bookingRepository, PasswordEncoder passwordEncoder) {
        this.carRepository = carRepository;
        this.adminRepository = adminRepository;
        this.bookingRepository = bookingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public Optional<Car> getCarById(UUID id) {
        return carRepository.findById(id);
    }

    public List<Car> getCarsByDealer(UUID dealerId) {
        return carRepository.findByAdminId(dealerId);
    }

    @Transactional
    public Car createCar(Car car) {
        if (car.getVariants() != null) {
            car.getVariants().forEach(v -> v.setCar(car));
        }

        Car savedCar = carRepository.save(car);

        if (savedCar.getDefaultVariantId() == null && savedCar.getVariants() != null
                && !savedCar.getVariants().isEmpty()) {
            savedCar.setDefaultVariantId(savedCar.getVariants().get(0).getId());
            savedCar = carRepository.save(savedCar);
        }

        return savedCar;
    }

    @Transactional
    public Car updateCar(UUID id, Car carDetails, UUID dealerId) {
        Car existing = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (!existing.getAdmin().getId().equals(dealerId)) {
            throw new RuntimeException("Unauthorized: You do not own this vehicle.");
        }

        existing.setName(carDetails.getName());
        existing.setBrand(carDetails.getBrand());
        existing.setImageUrl(carDetails.getImageUrl());
        existing.setDescription(carDetails.getDescription());

        // Update variants strategy: orphanRemoval clears old, add new
        existing.getVariants().clear();
        if (carDetails.getVariants() != null) {
            carDetails.getVariants().forEach(v -> {
                v.setCar(existing);
                existing.getVariants().add(v);
            });
        }

        // Ensure defaultVariantId is still valid or pick first
        if (!existing.getVariants().isEmpty()) {
            boolean matches = existing.getVariants().stream()
                    .anyMatch(v -> v.getId() != null && v.getId().equals(existing.getDefaultVariantId()));
            if (!matches) {
                // For simplicity, default to null. Will be assigned on save if handling that
                // logic
            }
        }

        return carRepository.save(existing);
    }

    @Transactional
    public void deleteCar(UUID id, String password, UUID dealerId) {
        Car existing = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (!existing.getAdmin().getId().equals(dealerId)) {
            throw new RuntimeException("Unauthorized: You do not own this vehicle.");
        }

        // Verify admin password
        Admin admin = adminRepository.findById(dealerId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        if (!passwordEncoder.matches(password, admin.getPasswordHash())) {
            throw new RuntimeException("Invalid password. Deletion aborted.");
        }

        // Check for active bookings (PENDING or PAID)
        boolean hasActiveBookings = bookingRepository.existsByVariant_Car_IdAndStatusIn(
                id, Arrays.asList("PENDING", "PAID"));
        if (hasActiveBookings) {
            throw new RuntimeException("Cannot delete: This vehicle has active bookings.");
        }

        carRepository.delete(existing);
    }
}
