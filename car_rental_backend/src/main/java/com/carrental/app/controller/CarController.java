package com.carrental.app.controller;

import com.carrental.app.model.Car;
import com.carrental.app.model.Admin;
import com.carrental.app.dto.DeleteCarRequest;
import com.carrental.app.repository.AdminRepository;
import com.carrental.app.service.CarService;
import com.carrental.app.service.CarwaleScraperService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    private final CarService carService;
    private final CarwaleScraperService scraperService;
    private final AdminRepository adminRepository;

    public CarController(CarService carService, CarwaleScraperService scraperService, AdminRepository adminRepository) {
        this.carService = carService;
        this.scraperService = scraperService;
        this.adminRepository = adminRepository;
    }

    @GetMapping
    public ResponseEntity<List<Car>> getAllCars() {
        return ResponseEntity.ok(carService.getAllCars());
    }

    @GetMapping("/dealer")
    public ResponseEntity<List<Car>> getDealerCars() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        return ResponseEntity.ok(carService.getCarsByDealer(admin.getId()));
    }

    @PostMapping
    public ResponseEntity<Car> createCar(@RequestBody Car car) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        car.setAdmin(admin);
        return ResponseEntity.ok(carService.createCar(car));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable("id") UUID id, @RequestBody Car carDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        return ResponseEntity.ok(carService.updateCar(id, carDetails, admin.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable("id") UUID id) {
        return carService.getCarById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCar(@PathVariable("id") UUID id, @RequestBody DeleteCarRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        try {
            carService.deleteCar(id, request.getPassword(), admin.getId());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/scrape")
    public ResponseEntity<com.carrental.app.dto.CarScrapeResult> scrapeCarDetails(
            @RequestBody java.util.Map<String, String> request) {
        String carName = request.get("carName");
        if (carName == null || carName.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(scraperService.scrapeVehicleDetails(carName));
    }
}
