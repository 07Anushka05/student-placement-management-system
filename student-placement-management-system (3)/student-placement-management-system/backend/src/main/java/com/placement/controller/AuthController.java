package com.placement.controller;

import com.placement.model.Student;
import com.placement.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final StudentRepository studentRepository;

    public AuthController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.email == null || request.email.isBlank() || request.password == null || request.password.length() < 6) {
            return ResponseEntity.badRequest().body("Email and a password of at least 6 characters are required.");
        }
        if (studentRepository.existsByEmail(request.email.trim().toLowerCase())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("An account with this email already exists.");
        }

        Student student = new Student();
        student.setName(request.name);
        student.setEmail(request.email.trim().toLowerCase());
        student.setPassword(request.password);
        student.setPhone(request.phone);
        student.setCollege(request.college);
        student.setDegree(request.degree);
        student.setGraduationYear(request.graduationYear);
        student.setSkills(request.skills);
        return ResponseEntity.ok(studentRepository.save(student));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return studentRepository.findByEmail(request.email == null ? "" : request.email.trim().toLowerCase())
                .filter(student -> student.getPassword() != null && student.getPassword().equals(request.password))
                .<ResponseEntity<?>>map(student -> ResponseEntity.ok(student))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password."));
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class RegisterRequest extends LoginRequest {
        public String name;
        public String phone;
        public String college;
        public String degree;
        public String graduationYear;
        public String skills;
    }
}