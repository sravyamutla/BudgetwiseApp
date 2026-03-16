package com.budgetwise.backend.controller;

import com.budgetwise.backend.entity.SavingsGoal;
import com.budgetwise.backend.entity.User;
import com.budgetwise.backend.repository.SavingsGoalRepository;
import com.budgetwise.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/savings")
@CrossOrigin(origins = "*") // Allow React Frontend
public class SavingsGoalController {

    @Autowired
    private SavingsGoalRepository savingsGoalRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<SavingsGoal>> getSavingsGoals(@RequestParam("userId") Long userId) {
        List<SavingsGoal> goals = savingsGoalRepository.findByUserId(userId);
        return ResponseEntity.ok(goals);
    }

    @PostMapping
    public ResponseEntity<?> addOrUpdateSavingsGoal(@RequestBody SavingsGoalRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        SavingsGoal goal;

        if (request.getId() != null && savingsGoalRepository.existsById(request.getId())) {
            goal = savingsGoalRepository.findById(request.getId()).get();
            goal.setName(request.getName());
            goal.setTargetAmount(request.getTargetAmount());
            goal.setCurrentAmount(request.getCurrentAmount());
            goal.setTargetDate(request.getTargetDate());
        } else {
            goal = new SavingsGoal(user, request.getName(), request.getTargetAmount(), request.getCurrentAmount(),
                    request.getTargetDate());
        }

        SavingsGoal savedGoal = savingsGoalRepository.save(goal);
        return ResponseEntity.ok(savedGoal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSavingsGoal(@PathVariable("id") Long id) {
        if (!savingsGoalRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        savingsGoalRepository.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    public static class SavingsGoalRequest {
        private Long id;
        private Long userId;
        private String name;
        private Double targetAmount;
        private Double currentAmount;
        private LocalDate targetDate;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Double getTargetAmount() {
            return targetAmount;
        }

        public void setTargetAmount(Double targetAmount) {
            this.targetAmount = targetAmount;
        }

        public Double getCurrentAmount() {
            return currentAmount;
        }

        public void setCurrentAmount(Double currentAmount) {
            this.currentAmount = currentAmount;
        }

        public LocalDate getTargetDate() {
            return targetDate;
        }

        public void setTargetDate(LocalDate targetDate) {
            this.targetDate = targetDate;
        }
    }
}
