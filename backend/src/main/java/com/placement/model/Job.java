package com.placement.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String jobTitle;
    private String location;
    private String jobType;       // Full Time, Internship, etc.
    private String experience;    // e.g. "0-1 years"

    // Comma-separated list of required skills
    private String skills;

    @Column(length = 2000)
    private String description;

    private LocalDate postedDate;

    public Job() {
    }

    public Job(String companyName, String jobTitle, String location, String jobType,
               String experience, String skills, String description, LocalDate postedDate) {
        this.companyName = companyName;
        this.jobTitle = jobTitle;
        this.location = location;
        this.jobType = jobType;
        this.experience = experience;
        this.skills = skills;
        this.description = description;
        this.postedDate = postedDate;
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getPostedDate() {
        return postedDate;
    }

    public void setPostedDate(LocalDate postedDate) {
        this.postedDate = postedDate;
    }
}
