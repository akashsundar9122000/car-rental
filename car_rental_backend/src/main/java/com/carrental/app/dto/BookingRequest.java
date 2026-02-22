package com.carrental.app.dto;

import java.time.LocalDate;
import java.util.UUID;

public class BookingRequest {
    private UUID carId;
    private UUID variantId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String source;
    private String destination;
    private boolean isDriverNeeded;
    private java.math.BigDecimal totalPrice;

    public BookingRequest() {
    }

    public BookingRequest(UUID carId, UUID variantId, LocalDate startDate, LocalDate endDate) {
        this.carId = carId;
        this.variantId = variantId;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public UUID getCarId() {
        return carId;
    }

    public void setCarId(UUID carId) {
        this.carId = carId;
    }

    public UUID getVariantId() {
        return variantId;
    }

    public void setVariantId(UUID variantId) {
        this.variantId = variantId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public boolean isDriverNeeded() {
        return isDriverNeeded;
    }

    public void setDriverNeeded(boolean driverNeeded) {
        isDriverNeeded = driverNeeded;
    }

    public java.math.BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(java.math.BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}
