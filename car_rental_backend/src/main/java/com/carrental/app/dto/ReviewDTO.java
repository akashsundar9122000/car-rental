package com.carrental.app.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ReviewDTO {
    private UUID id;
    private Integer rating;
    private String comment;
    private String authorName;
    private UUID carId;
    private LocalDateTime createdAt;

    public ReviewDTO() {
    }

    public ReviewDTO(UUID id, Integer rating, String comment, String authorName, UUID carId, LocalDateTime createdAt) {
        this.id = id;
        this.rating = rating;
        this.comment = comment;
        this.authorName = authorName;
        this.carId = carId;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public UUID getCarId() {
        return carId;
    }

    public void setCarId(UUID carId) {
        this.carId = carId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
