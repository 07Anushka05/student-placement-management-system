package com.placement.controller;

import com.placement.model.Job;
import com.placement.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    // GET /api/jobs - list all jobs
    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // GET /api/jobs/{id} - single job details
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/jobs - add a new job (used by the Add Job page)
    @PostMapping
    public Job createJob(@RequestBody Job job) {
        if (job.getPostedDate() == null) {
            job.setPostedDate(LocalDate.now());
        }
        return jobRepository.save(job);
    }
}
