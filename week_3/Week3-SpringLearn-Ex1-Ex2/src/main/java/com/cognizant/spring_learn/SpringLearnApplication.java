package com.cognizant.spring_learn;

import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.support.ClassPathXmlApplicationContext;

@SpringBootApplication
public class SpringLearnApplication {

	public static void main(String[] args) {

		SpringApplication.run(SpringLearnApplication.class, args);

		displayCountries();

	}

	public static void displayCountries() {

		System.out.println("START");

		ClassPathXmlApplicationContext context =
				new ClassPathXmlApplicationContext("country.xml");

		List<Country> countries =
				(List<Country>) context.getBean("countryList");

		for (Country country : countries) {

			System.out.println(country);

		}

		context.close();

		System.out.println("END");

	}

}