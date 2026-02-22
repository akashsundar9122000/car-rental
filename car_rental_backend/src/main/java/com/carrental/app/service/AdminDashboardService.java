package com.carrental.app.service;

import com.carrental.app.dto.SalesDataDto;
import com.carrental.app.model.Booking;
import com.carrental.app.model.Car;
import com.carrental.app.repository.BookingRepository;
import com.carrental.app.repository.CarRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
public class AdminDashboardService {

    private final BookingRepository bookingRepository;
    private final CarRepository carRepository;

    public AdminDashboardService(BookingRepository bookingRepository, CarRepository carRepository) {
        this.bookingRepository = bookingRepository;
        this.carRepository = carRepository;
    }

    public SalesDataDto getSalesData(UUID adminId) {
        List<Booking> bookings = bookingRepository.findByVariant_Car_Admin_Id(adminId);
        List<Car> cars = carRepository.findByAdminId(adminId);

        BigDecimal totalRevenue = bookings.stream()
                .filter(b -> !"CANCELLED".equalsIgnoreCase(b.getStatus())
                        && !"REJECTED".equalsIgnoreCase(b.getStatus()))
                .map(Booking::getTotalPrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalBookings = bookings.size();
        long activeCars = cars.size();

        // Calculate revenue by month for the current year, or last 6 months
        // To keep it simple, we group by "YYYY-MM"
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        Map<String, BigDecimal> revenueByMonth = new LinkedHashMap<>();

        bookings.stream()
                .filter(b -> !"CANCELLED".equalsIgnoreCase(b.getStatus())
                        && !"REJECTED".equalsIgnoreCase(b.getStatus()))
                .filter(b -> b.getCreatedAt() != null && b.getTotalPrice() != null)
                .sorted((b1, b2) -> b1.getCreatedAt().compareTo(b2.getCreatedAt()))
                .forEach(b -> {
                    String month = b.getCreatedAt().format(formatter);
                    revenueByMonth.merge(month, b.getTotalPrice(), BigDecimal::add);
                });

        SalesDataDto dto = new SalesDataDto();
        dto.setTotalRevenue(totalRevenue);
        dto.setTotalBookings(totalBookings);
        dto.setActiveCars(activeCars);
        dto.setRevenueByMonth(revenueByMonth);

        return dto;
    }
}
