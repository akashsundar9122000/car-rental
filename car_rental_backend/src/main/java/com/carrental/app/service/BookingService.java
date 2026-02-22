package com.carrental.app.service;

import com.carrental.app.dto.BookingRequest;
import com.carrental.app.model.Booking;
import com.carrental.app.model.CarVariant;
import com.carrental.app.model.User;
import com.carrental.app.repository.BookingRepository;
import com.carrental.app.repository.CarVariantRepository;
import com.carrental.app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CarVariantRepository carVariantRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
            CarVariantRepository carVariantRepository,
            UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.carVariantRepository = carVariantRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Booking createBooking(UUID userId, BookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CarVariant variant = carVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Car variant not found"));

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (days <= 0) {
            throw new RuntimeException("Invalid booking dates");
        }

        BigDecimal totalPrice = variant.getPricePerDay().multiply(BigDecimal.valueOf(days));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setVariant(variant);
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setTotalPrice(totalPrice);
        booking.setSource(request.getSource());
        booking.setDestination(request.getDestination());
        booking.setDriverNeeded(request.isDriverNeeded());
        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(UUID userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getDealerBookings(UUID dealerId) {
        return bookingRepository.findByVariant_Car_Admin_Id(dealerId);
    }

    @Transactional
    public Booking updateBookingStatus(UUID bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        // Additional validation could be added here (e.g. check if status is valid)
        booking.setStatus(status.toUpperCase());
        return bookingRepository.save(booking);
    }
}
