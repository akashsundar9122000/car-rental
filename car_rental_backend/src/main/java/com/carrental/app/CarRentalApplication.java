package com.carrental.app;

import com.carrental.app.model.User;
import com.carrental.app.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class CarRentalApplication {

	public static void main(String[] args) {
		SpringApplication.run(CarRentalApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (!userRepository.existsByEmail("admin@carrental.com")) {
				User admin = new User();
				admin.setEmail("admin@carrental.com");
				admin.setFullName("System Admin");
				admin.setPasswordHash(passwordEncoder.encode("admin123"));
				admin.setRole("ADMIN");
				userRepository.save(admin);
				System.out.println("Default Admin User created: admin@carrental.com / admin123");
			}
		};
	}
}
