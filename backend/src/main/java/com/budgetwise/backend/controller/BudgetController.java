package com.budgetwise.backend.controller;

import com.budgetwise.backend.entity.Budget;
import com.budgetwise.backend.entity.Transaction;
import com.budgetwise.backend.entity.User;
import com.budgetwise.backend.repository.BudgetRepository;
import com.budgetwise.backend.repository.TransactionRepository;
import com.budgetwise.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin(origins = "*") // Allow React Frontend
public class BudgetController {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<BudgetDTO>> getBudgetsWithSpent(
            @RequestParam("userId") Long userId,
            @RequestParam("monthYear") String monthYear) {

        // monthYear is expected in format "YYYY-MM"
        List<Budget> budgets = budgetRepository.findByUserIdAndMonthYear(userId, monthYear);

        // Parse dates for aggregating expenses
        YearMonth ym = YearMonth.parse(monthYear);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<Transaction> monthExpenses = transactionRepository.findByUserIdAndTypeAndDateBetween(userId, "expense",
                start, end);

        List<BudgetDTO> responseList = new ArrayList<>();

        for (Budget b : budgets) {
            double spent = monthExpenses.stream()
                    .filter(t -> t.getCategory().equalsIgnoreCase(b.getCategory()))
                    .mapToDouble(Transaction::getAmount)
                    .sum();

            responseList.add(new BudgetDTO(b.getId(), b.getCategory(), b.getAmountLimit(), spent, b.getMonthYear()));
        }

        return ResponseEntity.ok(responseList);
    }

    @PostMapping
    public ResponseEntity<?> addOrUpdateBudget(@RequestBody BudgetRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        Optional<Budget> existingOpt = budgetRepository.findByUserIdAndCategoryAndMonthYear(
                user.getId(), request.getCategory(), request.getMonthYear());

        Budget budget;
        if (existingOpt.isPresent()) {
            budget = existingOpt.get();
            budget.setAmountLimit(request.getAmountLimit());
        } else {
            budget = new Budget(user, request.getCategory(), request.getAmountLimit(), request.getMonthYear());
        }

        budgetRepository.save(budget);
        return ResponseEntity.ok(budget);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable("id") Long id) {
        if (!budgetRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        budgetRepository.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    public static class BudgetRequest {
        private Long userId;
        private String category;
        private Double amountLimit;
        private String monthYear;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public Double getAmountLimit() {
            return amountLimit;
        }

        public void setAmountLimit(Double amountLimit) {
            this.amountLimit = amountLimit;
        }

        public String getMonthYear() {
            return monthYear;
        }

        public void setMonthYear(String monthYear) {
            this.monthYear = monthYear;
        }
    }

    public static class BudgetDTO {
        private Long id;
        private String category;
        private Double amountLimit;
        private Double spentAmount;
        private String monthYear;

        public BudgetDTO(Long id, String category, Double amountLimit, Double spentAmount, String monthYear) {
            this.id = id;
            this.category = category;
            this.amountLimit = amountLimit;
            this.spentAmount = spentAmount;
            this.monthYear = monthYear;
        }

        public Long getId() {
            return id;
        }

        public String getCategory() {
            return category;
        }

        public Double getAmountLimit() {
            return amountLimit;
        }

        public Double getSpentAmount() {
            return spentAmount;
        }

        public String getMonthYear() {
            return monthYear;
        }
    }
}
