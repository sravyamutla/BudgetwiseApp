package com.budgetwise.backend.repository;

import com.budgetwise.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email (used for login & signup validation)
    Optional<User> findByEmail(String email);

    // Optional but useful (for validation checks)
    boolean existsByEmail(String email);
}