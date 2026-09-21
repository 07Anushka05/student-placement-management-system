package com.placement.controller;

import com.placement.model.Application;
import com.placement.model.Job;
import com.placement.repository.ApplicationRepository;
import com.placement.repository.JobRepository;
import com.placement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private StudentRepository studentRepository;

    // GET /api/applications - list all applications (for "My Applications" page)
    @GetMapping
    public List<Application> getAllApplications(@RequestParam(required = false) Long studentId) {
        return studentId == null ? applicationRepository.findAll() : applicationRepository.findByStudentId(studentId);
    }

    // POST /api/applications - submit a new application
    // Expects JSON body with jobId + applicant details from the apply form.
    @PostMapping
    public ResponseEntity<Application> createApplication(@RequestBody ApplicationRequest request) {
        Optional<Job> jobOpt = jobRepository.findById(request.jobId);
        if (jobOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Application application = new Application();
        application.setJob(jobOpt.get());
        if (request.studentId != null) {
            Optional<com.placement.model.Student> studentOpt = studentRepository.findById(request.studentId);
            if (studentOpt.isEmpty()) return ResponseEntity.badRequest().build();
            application.setStudent(studentOpt.get());
        }
        application.setApplicantName(request.applicantName);
        application.setApplicantEmail(request.applicantEmail);
        application.setApplicantPhone(request.applicantPhone);
        application.setApplicantSkills(request.applicantSkills);
        application.setResumeLink(request.resumeLink);
        application.setCoverLetter(request.coverLetter);
        application.setStatus("Applied");
        application.setAppliedDate(LocalDate.now());

        Application saved = applicationRepository.save(application);
        return ResponseEntity.ok(saved);
    }

    // PUT /api/applications/{id} - update status (e.g. move to "Under Review")
    @PutMapping("/{id}")
    public ResponseEntity<Application> updateApplication(@PathVariable Long id, @RequestBody Application updated) {
        return applicationRepository.findById(id)
                .map(existing -> {
                    existing.setStatus(updated.getStatus());
                    Application saved = applicationRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/applications/{id} - withdraw an application
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        if (!applicationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        applicationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Simple request DTO matching the fields sent by the frontend's apply form.
    public static class ApplicationRequest {
        public Long jobId;
        public Long studentId;
        public String applicantName;
        public String applicantEmail;
        public String applicantPhone;
        public String applicantSkills;
        public String resumeLink;
        public String coverLetter;
    }
}
