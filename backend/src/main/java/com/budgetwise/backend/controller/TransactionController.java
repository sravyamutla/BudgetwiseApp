package com.budgetwise.backend.controller;

import com.budgetwise.backend.entity.Transaction;
import com.budgetwise.backend.entity.User;
import com.budgetwise.backend.repository.TransactionRepository;
import com.budgetwise.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*") // Allow React Frontend
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all transactions for a specific user
    @GetMapping
    public ResponseEntity<List<Transaction>> getUserTransactions(@RequestParam("userId") Long userId) {
        List<Transaction> transactions = transactionRepository.findByUserId(userId);
        return ResponseEntity.ok(transactions);
    }

    // Add a new transaction
    @PostMapping
    public ResponseEntity<?> addTransaction(@RequestBody TransactionRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        Transaction transaction = new Transaction(
                user,
                request.getDescription(),
                request.getAmount(),
                request.getDate(),
                request.getCategory(),
                request.getType());

        Transaction savedTransaction = transactionRepository.save(transaction);
        return ResponseEntity.ok(savedTransaction);
    }

    // Update an existing transaction
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(@PathVariable("id") Long id, @RequestBody TransactionRequest request) {
        Optional<Transaction> transactionOpt = transactionRepository.findById(id);
        if (transactionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Transaction transaction = transactionOpt.get();
        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setDate(request.getDate());
        transaction.setCategory(request.getCategory());
        transaction.setType(request.getType());

        Transaction updatedTransaction = transactionRepository.save(transaction);
        return ResponseEntity.ok(updatedTransaction);
    }

    // Delete a transaction
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable("id") Long id) {
        if (!transactionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        transactionRepository.deleteById(id);
        return ResponseEntity.ok("Transaction deleted successfully");
    }

    // Mock endpoint for Google Drive Backup
    @PostMapping("/backup/gdrive")
    public ResponseEntity<?> backupToGoogleDrive(@RequestParam("userId") Long userId) {
        // Here we would normally build a file and utilize Google Drive API
        // For now, simulate a network delay and return success
        try {
            Thread.sleep(2000); // Simulate 2 second upload
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok("Successfully backed up transactions to Google Drive.");
    }

    // Mock endpoint for Dropbox Backup
    @PostMapping("/backup/dropbox")
    public ResponseEntity<?> backupToDropbox(@RequestParam("userId") Long userId) {
        // Here we would normally build a file and utilize Dropbox API
        // For now, simulate a network delay and return success
        try {
            Thread.sleep(2000); // Simulate 2 second upload
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok("Successfully backed up transactions to Dropbox.");
    }

    // Helper DTO class to parse incoming JSON without exposing the User entity
    // directly
    public static class TransactionRequest {
        private Long userId;
        private String description;
        private Double amount;
        private java.time.LocalDate date;
        private String category;
        private String type;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Double getAmount() {
            return amount;
        }

        public void setAmount(Double amount) {
            this.amount = amount;
        }

        public java.time.LocalDate getDate() {
            return date;
        }

        public void setDate(java.time.LocalDate date) {
            this.date = date;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
    }
}
