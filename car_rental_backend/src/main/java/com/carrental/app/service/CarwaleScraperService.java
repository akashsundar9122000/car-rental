package com.carrental.app.service;

import com.carrental.app.dto.CarScrapeResult;
import com.carrental.app.model.CarVariant;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class CarwaleScraperService {

    public CarScrapeResult scrapeVehicleDetails(String carName) {
        try {
            List<CarVariant> variants = generateEducatedMockVariants(carName);
            String imageUrl = getMockImageUrl(carName);
            String description = getMockDescription(carName);
            return new CarScrapeResult(imageUrl, description, variants);
        } catch (Exception e) {
            System.err.println("Scraping failed for " + carName + ": " + e.getMessage());
            return new CarScrapeResult("", "", new ArrayList<>());
        }
    }

    private String getMockImageUrl(String carName) {
        String normalized = carName.toLowerCase();
        if (normalized.contains("nexon ev"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/142515/nexon-ev-exterior-right-front-three-quarter-71.jpeg";
        if (normalized.contains("nexon"))
            return "https://imgd.aeplcdn.com/664x374/cw/ec/41645/Tata-Nexon-Right-Front-Three-Quarter-170028.jpg";
        if (normalized.contains("safari"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/142739/safari-exterior-right-front-three-quarter-77.jpeg";
        if (normalized.contains("harrier"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/142865/harrier-exterior-right-front-three-quarter-2.jpeg";
        if (normalized.contains("punch"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/39015/punch-exterior-right-front-three-quarter-2.jpeg";
        if (normalized.contains("tiago"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/39345/tiago-exterior-right-front-three-quarter-24.jpeg";
        if (normalized.contains("altroz"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/32597/altroz-exterior-right-front-three-quarter-79.jpeg";
        if (normalized.contains("creta"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/141115/creta-exterior-right-front-three-quarter-1.jpeg";
        if (normalized.contains("venue"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/141117/venue-exterior-right-front-three-quarter-2.jpeg";
        if (normalized.contains("i20"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/137351/i20-exterior-right-front-three-quarter-3.jpeg";
        if (normalized.contains("xuv700"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/42355/xuv700-exterior-right-front-three-quarter-3.jpeg";
        if (normalized.contains("scorpio"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/128039/scorpio-n-exterior-right-front-three-quarter-46.jpeg";
        if (normalized.contains("thar"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/40087/thar-exterior-right-front-three-quarter-35.jpeg";
        if (normalized.contains("xuv300"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/142645/xuv3xo-exterior-right-front-three-quarter-4.jpeg";
        if (normalized.contains("innova"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/140809/innova-crysta-exterior-right-front-three-quarter-2.jpeg";
        if (normalized.contains("fortuner"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-20.jpeg";
        if (normalized.contains("glanza"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/112839/glanza-exterior-right-front-three-quarter-2.jpeg";
        if (normalized.contains("swift"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/141617/swift-exterior-right-front-three-quarter-2.jpeg";
        if (normalized.contains("wagon r"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/112513/wagon-r-exterior-right-front-three-quarter-3.jpeg";
        if (normalized.contains("baleno"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/102663/baleno-exterior-right-front-three-quarter-60.jpeg";
        if (normalized.contains("brezza"))
            return "https://imgd.aeplcdn.com/664x374/n/cw/ec/123185/brezza-exterior-right-front-three-quarter-2.jpeg";

        return "https://imgd.aeplcdn.com/664x374/n/cw/ec/41645/Tata-Nexon-Right-Front-Three-Quarter-170028.jpg"; // Default
                                                                                                                 // Generic
                                                                                                                 // Image
    }

    private String getMockDescription(String carName) {
        return "The " + carName
                + " is a highly popular and visually striking vehicle in the Indian market, blending modern design with advanced technical features. It provides an excellent balance of comfort, performance, and efficiency, making it perfect for both daily city commutes and longer weekend road trips.";
    }

    private List<CarVariant> generateEducatedMockVariants(String carName) {
        List<CarVariant> generated = new ArrayList<>();
        String normalized = carName.toLowerCase();

        // Base specs
        String transmission = normalized.contains("automatic") || normalized.contains(" amt ") ? "Automatic" : "Manual";
        String fuelType = normalized.contains("diesel") ? "Diesel"
                : (normalized.contains("ev") ? "Electric" : "Petrol");
        int seats = normalized.contains("innova") || normalized.contains("safari") || normalized.contains("xuv700")
                || normalized.contains("scorpio") || normalized.contains("fortuner") ? 7
                        : 5;

        double baseMileage = fuelType.equals("Diesel") ? 18.5 : (fuelType.equals("Electric") ? 400.0 : 16.0);
        BigDecimal basePrice = BigDecimal.valueOf(1500.00);
        String engine = fuelType.equals("Electric") ? "NA" : "1197 cc";

        // Variant 1: Base Model
        CarVariant base = new CarVariant();
        base.setName(carName + " Base");
        base.setTransmission(transmission);
        base.setFuelType(fuelType);
        base.setSeats(seats);
        base.setPricePerDay(basePrice);
        base.setMileage(baseMileage + (fuelType.equals("Electric") ? " km/charge" : " kmpl"));
        base.setFeatures(Arrays.asList("AC", "Power Windows", "Dual Airbags"));
        base.setEngineCapacity(engine);
        generated.add(base);

        // Variant 2: Top Model
        CarVariant top = new CarVariant();
        top.setName(carName + " Topline");
        top.setTransmission("Automatic");
        top.setFuelType(fuelType);
        top.setSeats(seats);
        top.setPricePerDay(basePrice.add(BigDecimal.valueOf(800)));
        top.setMileage((baseMileage - 1.5) + (fuelType.equals("Electric") ? " km/charge" : " kmpl"));
        top.setFeatures(Arrays.asList("AC", "Power Windows", "Sunroof", "Cruise Control", "360 Camera", "6 Airbags",
                "Ventilated Seats"));
        top.setEngineCapacity(fuelType.equals("Electric") ? "NA" : "1498 cc");
        generated.add(top);

        return generated;
    }
}
