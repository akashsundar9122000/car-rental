package com.carrental.app.dto;

import com.carrental.app.model.CarVariant;
import java.util.List;

public class CarScrapeResult {
    private String imageUrl;
    private String description;
    private List<CarVariant> variants;

    public CarScrapeResult() {
    }

    public CarScrapeResult(String imageUrl, String description, List<CarVariant> variants) {
        this.imageUrl = imageUrl;
        this.description = description;
        this.variants = variants;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<CarVariant> getVariants() {
        return variants;
    }

    public void setVariants(List<CarVariant> variants) {
        this.variants = variants;
    }
}
