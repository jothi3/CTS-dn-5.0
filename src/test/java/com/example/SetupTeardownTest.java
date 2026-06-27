package com.example;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SetupTeardownTest {

    private Calculator calculator;

    // Runs before each test
    @BeforeEach
    public void setUp() {
        System.out.println("setUp executed: Initializing fresh Calculator instance.");
        calculator = new Calculator();
    }

    // Runs after each test
    @AfterEach
    public void tearDown() {
        System.out.println("tearDown executed: Cleaning up resources.");
        calculator = null;
    }

    @Test
    public void testAdditionWithAAA() {
        // Arrange
        int num1 = 4;
        int num2 = 5;
        int expectedResult = 9;

        // Act
        int actualResult = calculator.add(num1, num2);

        // Assert
        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testMultiplicationWithAAA() {
        // Arrange
        int num1 = 4;
        int num2 = 5;
        int expectedResult = 20;

        // Act
        int actualResult = calculator.multiply(num1, num2);

        // Assert
        assertEquals(expectedResult, actualResult);
    }
}