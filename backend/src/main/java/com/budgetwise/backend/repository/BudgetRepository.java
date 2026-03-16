package com.budgetwise.backend.repository;

import com.budgetwise.backend.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserId(Long userId);

    List<Budget> findByUserIdAndMonthYear(Long userId, String monthYear);

    Optional<Budget> findByUserIdAndCategoryAndMonthYear(Long userId, String category, String monthYear);
}
