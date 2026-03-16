package com.budgetwise.backend.repository;

import com.budgetwise.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import java.time.LocalDate;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserId(Long userId);

    List<Transaction> findByUserIdAndTypeAndDateBetween(Long userId, String type, LocalDate startDate,
            LocalDate endDate);
}
