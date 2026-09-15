package com.cognizant.springlearn.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
public class UserConfig {

    @Bean
    public InMemoryUserDetailsManager userDetailsService() {

        return new InMemoryUserDetailsManager(
                User.withUsername("user")
                        .password("{noop}pwd")
                        .roles("USER")
                        .build()
        );
    }
}