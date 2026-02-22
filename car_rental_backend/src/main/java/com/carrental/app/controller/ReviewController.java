package com.carrental.app.controller;

import com.carrental.app.dto.ReviewDTO;
import com.carrental.app.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/car/{carId}")
    public ResponseEntity<List<ReviewDTO>> getCarReviews(@PathVariable UUID carId) {
        return ResponseEntity.ok(reviewService.getReviewsForCar(carId));
    }

    @PostMapping("/car/{carId}")
    public ResponseEntity<ReviewDTO> addReview(
            @PathVariable UUID carId,
            @RequestBody ReviewDTO reviewDTO,
            Authentication authentication) {

        // Extract authenticated user's email
        String email = authentication.getName();
        ReviewDTO createdReview = reviewService.addReview(carId, email, reviewDTO);
        return ResponseEntity.ok(createdReview);
    }
}
