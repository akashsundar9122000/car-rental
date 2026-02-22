package com.carrental.app.dto;

import java.math.BigDecimal;
import java.util.Map;

public class SalesDataDto {
    private BigDecimal totalRevenue;
    private long totalBookings;
    private long activeCars;
    private Map<String, BigDecimal> revenueByMonth;

    public SalesDataDto() {
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getActiveCars() {
        return activeCars;
    }

    public void setActiveCars(long activeCars) {
        this.activeCars = activeCars;
    }

    public Map<String, BigDecimal> getRevenueByMonth() {
        return revenueByMonth;
    }

    public void setRevenueByMonth(Map<String, BigDecimal> revenueByMonth) {
        this.revenueByMonth = revenueByMonth;
    }
}
