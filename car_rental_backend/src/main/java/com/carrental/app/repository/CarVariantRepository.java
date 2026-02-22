package com.carrental.app.repository;

import com.carrental.app.model.CarVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CarVariantRepository extends JpaRepository<CarVariant, UUID> {
    List<CarVariant> findByCarId(UUID carId);
}
