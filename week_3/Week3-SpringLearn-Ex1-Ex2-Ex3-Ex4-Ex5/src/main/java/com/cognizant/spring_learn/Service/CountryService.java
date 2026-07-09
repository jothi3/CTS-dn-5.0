package com.cognizant.spring_learn.service;

import com.cognizant.spring_learn.model.Country;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CountryService {

    public Country getCountry(String code) {

        List<Country> countries = new ArrayList<>();

        countries.add(new Country("IN", "India"));
        countries.add(new Country("US", "United States"));
        countries.add(new Country("UK", "United Kingdom"));

        return countries.stream()
                .filter(country -> country.getCode()
                        .equalsIgnoreCase(code))
                .findFirst()
                .orElse(null);
    }
}