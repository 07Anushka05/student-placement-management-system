package com.placement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Entry point of the Spring Boot backend.
// Run this class (or `mvn spring-boot:run`) to start the REST API on port 8080.
@SpringBootApplication
public class PlacementApplication {
    public static void main(String[] args) {
        SpringApplication.run(PlacementApplication.class, args);
    }
}
