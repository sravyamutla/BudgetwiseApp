package com.budgetwise.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    // 🔴 Email must be unique
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private Double income;
    private Double savings;
    private Double targetExpense;

    // ----- Default constructor (required by JPA)
    public User() {
    }

    // ----- Optional constructor (useful)
    public User(String username, String email, String password,
            Double income, Double savings, Double targetExpense) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.income = income;
        this.savings = savings;
        this.targetExpense = targetExpense;
    }

    // ----- Getters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public Double getIncome() {
        return income;
    }

    public Double getSavings() {
        return savings;
    }

    public Double getTargetExpense() {
        return targetExpense;
    }

    // ----- Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setIncome(Double income) {
        this.income = income;
    }

    public void setSavings(Double savings) {
        this.savings = savings;
    }

    public void setTargetExpense(Double targetExpense) {
        this.targetExpense = targetExpense;
    }
}