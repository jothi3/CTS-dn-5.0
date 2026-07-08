package com.cognizant.spring_learn;

import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.cognizant.spring_learn.model.Country;

@SpringBootApplication
public class SpringLearnApplication {

	public static void main(String[] args) {

		SpringApplication.run(SpringLearnApplication.class, args);

		displayCountries();
	}

	public static void displayCountries() {

		System.out.println("START");

		ApplicationContext context =
				new ClassPathXmlApplicationContext("country.xml");

		List<Country> countryList =
				(List<Country>) context.getBean("countryList");

		for (Country country : countryList) {
			System.out.println(country);
		}

		((ClassPathXmlApplicationContext) context).close();

		System.out.println("END");
	}
}