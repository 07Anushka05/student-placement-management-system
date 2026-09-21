package com.placement.repository;

import com.placement.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
	java.util.List<Application> findByStudentId(Long studentId);
}
