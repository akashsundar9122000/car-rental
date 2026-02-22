package com.carrental.app.service;

import com.carrental.app.dto.ReviewDTO;
import com.carrental.app.model.Car;
import com.carrental.app.model.Review;
import com.carrental.app.model.User;
import com.carrental.app.repository.CarRepository;
import com.carrental.app.repository.ReviewRepository;
import com.carrental.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ReviewDTO> getReviewsForCar(UUID carId) {
        return reviewRepository.findByCarIdOrderByCreatedAtDesc(carId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ReviewDTO addReview(UUID carId, String userEmail, ReviewDTO reviewDTO) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = new Review();
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setCar(car);
        review.setUser(user);

        Review savedReview = reviewRepository.save(review);
        return convertToDTO(savedReview);
    }

    private ReviewDTO convertToDTO(Review review) {
        return new ReviewDTO(
                review.getId(),
                review.getRating(),
                review.getComment(),
                review.getUser().getFullName() != null ? review.getUser().getFullName() : "Anonymous",
                review.getCar().getId(),
                review.getCreatedAt());
    }
}
