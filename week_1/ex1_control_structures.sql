BEGIN
    FOR cust IN (SELECT customer_id, age, loan_interest_rate 
                 FROM customers) LOOP

        IF cust.age > 60 THEN
            UPDATE customers
            SET loan_interest_rate = loan_interest_rate - 1
            WHERE customer_id = cust.customer_id;
        END IF;

    END LOOP;

    COMMIT;
END;
/
