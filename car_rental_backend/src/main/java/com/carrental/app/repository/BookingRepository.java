package com.carrental.app.repository;

import com.carrental.app.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByUserId(UUID userId);

    List<Booking> findByVariant_Car_Admin_Id(UUID adminId);

    boolean existsByVariant_Car_IdAndStatusIn(UUID carId, List<String> statuses);
}
