package com.cognizant.account.model;

public class Account {

    private String number;
    private String type;
    private double balance;

    // Default Constructor
    public Account() {
    }

    // Parameterized Constructor
    public Account(String number, String type, double balance) {
        this.number = number;
        this.type = type;
        this.balance = balance;
    }

    // Getter for number
    public String getNumber() {
        return number;
    }

    // Setter for number
    public void setNumber(String number) {
        this.number = number;
    }

    // Getter for type
    public String getType() {
        return type;
    }

    // Setter for type
    public void setType(String type) {
        this.type = type;
    }

    // Getter for balance
    public double getBalance() {
        return balance;
    }

    // Setter for balance
    public void setBalance(double balance) {
        this.balance = balance;
    }
}