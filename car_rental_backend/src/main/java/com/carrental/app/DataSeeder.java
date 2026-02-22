package com.carrental.app;

import com.carrental.app.model.Admin;
import com.carrental.app.model.Car;
import com.carrental.app.model.CarVariant;
import com.carrental.app.repository.AdminRepository;
import com.carrental.app.repository.CarRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

        private final CarRepository carRepository;
        private final AdminRepository adminRepository;
        private final PasswordEncoder passwordEncoder;

        public DataSeeder(CarRepository carRepository, AdminRepository adminRepository,
                        PasswordEncoder passwordEncoder) {
                this.carRepository = carRepository;
                this.adminRepository = adminRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @Override
        @Transactional
        public void run(String... args) throws Exception {
                Admin defaultAdmin = adminRepository.findByEmail("admin@admin.com").orElse(null);
                if (defaultAdmin == null) {
                        System.out.println("Seeding default admin...");
                        defaultAdmin = new Admin();
                        defaultAdmin.setEmail("admin@admin.com");
                        defaultAdmin.setFullName("System Admin");
                        defaultAdmin.setPasswordHash(passwordEncoder.encode("admin123"));
                        defaultAdmin = adminRepository.save(defaultAdmin);
                }

                if (carRepository.count() > 0) {
                        return;
                }

                System.out.println("Seeding initial car data...");
                if (carRepository.count() > 0) {
                        return;
                }

                System.out.println("Seeding initial car data...");

                // 1. Nexon EV
                Car nexonEv = new Car();
                nexonEv.setName("Nexon EV");
                nexonEv.setBrand("Tata");
                nexonEv.setImageUrl(
                                "https://cdni.autocarindia.com/ExtraImages/20230118124412_Nexon%20EV%20Max%20static%20front%20three%20quarter%20_1_.jpg");
                nexonEv.setDescription("India's best-selling electric SUV with enhanced range and safety features.");
                nexonEv.setAdmin(defaultAdmin);

                List<CarVariant> nexonVariants = new ArrayList<>();

                CarVariant nexonMr = new CarVariant();
                nexonMr.setName("Medium Range (30kWh)");
                nexonMr.setTransmission("Automatic");
                nexonMr.setFuelType("Electric");
                nexonMr.setSeats(5);
                nexonMr.setPricePerDay(new BigDecimal("2200"));
                nexonMr.setMileage("325 km/charge");
                nexonMr.setFeatures(Arrays.asList("Sunroof", "Ventilated Seats", "Wireless Charger", "360 Camera"));
                nexonMr.setEngineCapacity("30 kWh Battery");
                nexonMr.setCar(nexonEv);
                nexonVariants.add(nexonMr);

                CarVariant nexonLr = new CarVariant();
                nexonLr.setName("Long Range (45kWh)");
                nexonLr.setTransmission("Automatic");
                nexonLr.setFuelType("Electric");
                nexonLr.setSeats(5);
                nexonLr.setPricePerDay(new BigDecimal("2500"));
                nexonLr.setMileage("465 km/charge");
                nexonLr.setFeatures(
                                Arrays.asList("Sunroof", "Ventilated Seats", "Wireless Charger", "360 Camera", "ADAS"));
                nexonLr.setEngineCapacity("45 kWh Battery");
                nexonLr.setCar(nexonEv);
                nexonVariants.add(nexonLr);

                nexonEv.setVariants(nexonVariants);
                // We set default variant ID after saving to get the IDs?
                // Or we pick the first one. But ID is generated.
                // Actually, we can just save, then fetch to set default if needed.
                // For simplicity, let's just save. The defaultVariantId logic in frontend might
                // use index or we update it later.
                // But the frontend expects an ID string.
                carRepository.save(nexonEv);

                // 2. Thar
                Car thar = new Car();
                thar.setName("Thar");
                thar.setBrand("Mahindra");
                thar.setImageUrl(
                                "https://upload.wikimedia.org/wikipedia/commons/1/13/Mahindra_Thar_Photoshoot_At_Perupalem_Beach_%28West_Godavari_District%2CAP%2CIndia_%29_Djdavid.jpg");
                thar.setDescription("The ultimate off-road icon. Go anywhere, do anything.");
                thar.setAdmin(defaultAdmin);

                List<CarVariant> tharVariants = new ArrayList<>();

                CarVariant tharPetrolManual = createVariant("Petrol RWD Manual", "Manual", "Petrol", 4, "3500",
                                "15.2 kmpl",
                                Arrays.asList("Convertible Top", "Touchscreen Info", "Adventure Ready"),
                                "2.0L Turbo Petrol", "RWD",
                                thar);
                tharVariants.add(tharPetrolManual);

                CarVariant tharPetrolAuto = createVariant("Petrol 4x4 Automatic", "Automatic", "Petrol", 4, "4200",
                                "14.8 kmpl",
                                Arrays.asList("4x4 Drive", "Convertible Top", "Touchscreen Info", "Adventure Ready"),
                                "2.0L Turbo Petrol", "4x4", thar);
                tharVariants.add(tharPetrolAuto);

                CarVariant tharDieselManual = createVariant("Diesel RWD Manual", "Manual", "Diesel", 4, "3200",
                                "18.6 kmpl",
                                Arrays.asList("Convertible Top", "Touchscreen Info", "Adventure Ready"), "1.5L Diesel",
                                "RWD", thar);
                tharVariants.add(tharDieselManual);

                thar.setVariants(tharVariants);
                carRepository.save(thar);

                // 3. Swift
                Car swift = new Car();
                swift.setName("Swift");
                swift.setBrand("Maruti Suzuki");
                swift.setImageUrl(
                                "https://i0.wp.com/bestsellingcarsblog.com/wp-content/uploads/2022/06/Suzuki-Swift-South-Africa-May-2022.jpeg?resize=600%2C400");
                swift.setDescription("Sporty, stylish, and fun to drive. The perfect city hatchback.");
                swift.setAdmin(defaultAdmin);

                List<CarVariant> swiftVariants = new ArrayList<>();
                swiftVariants.add(createVariant("Petrol Manual", "Manual", "Petrol", 5, "1500", "22.38 kmpl",
                                Arrays.asList("Fuel Efficient", "Sporty Design", "SmartPlay Studio", "Cruise Control"),
                                "1.2L Petrol",
                                null, swift));
                swiftVariants
                                .add(createVariant(
                                                "Petrol AMT", "AMT", "Petrol", 5, "1700", "22.56 kmpl",
                                                Arrays.asList("Fuel Efficient",
                                                                "Sporty Design", "SmartPlay Studio", "Cruise Control",
                                                                "Auto Gear Shift"),
                                                "1.2L Petrol", null, swift));

                swift.setVariants(swiftVariants);
                carRepository.save(swift);

                // 4. XUV700
                Car xuv = new Car();
                xuv.setName("XUV700");
                xuv.setBrand("Mahindra");
                xuv.setImageUrl(
                                "https://images.hindustantimes.com/auto/img/2024/01/15/600x338/2024_XUV700_1705319660660_1705319664328.jpeg");
                xuv.setDescription("A rush of adrenaline. Advanced technology meets powerful performance.");
                xuv.setAdmin(defaultAdmin);

                List<CarVariant> xuvVariants = new ArrayList<>();
                xuvVariants.add(createVariant("Diesel Manual 7-Seater", "Manual", "Diesel", 7, "3200", "16.5 kmpl",
                                Arrays.asList("ADAS Level 2", "Skyroof", "Dual HD Screens", "Sony 3D Audio"),
                                "2.2L Diesel", null,
                                xuv));
                xuvVariants.add(createVariant("Diesel Automatic 7-Seater", "Automatic", "Diesel", 7, "3500",
                                "14.5 kmpl",
                                Arrays.asList("ADAS Level 2", "Skyroof", "Dual HD Screens", "Sony 3D Audio", "AWD"),
                                "2.2L Diesel",
                                "4x4", xuv));

                xuv.setVariants(xuvVariants);
                carRepository.save(xuv);

                System.out.println("Data seeding completed.");
        }

        private CarVariant createVariant(String name, String transmission, String fuelType, int seats, String price,
                        String mileage, List<String> features, String engine, String driveType, Car car) {
                CarVariant v = new CarVariant();
                v.setName(name);
                v.setTransmission(transmission);
                v.setFuelType(fuelType);
                v.setSeats(seats);
                v.setPricePerDay(new BigDecimal(price));
                v.setMileage(mileage);
                v.setFeatures(features);
                v.setEngineCapacity(engine);
                v.setDriveType(driveType);
                v.setCar(car);
                return v;
        }
}
