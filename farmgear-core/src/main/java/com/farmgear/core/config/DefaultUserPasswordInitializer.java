package com.farmgear.core.config;

import com.farmgear.core.entity.User;
import com.farmgear.core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DefaultUserPasswordInitializer implements CommandLineRunner {

    private static final String DEFAULT_PASSWORD = "123456";

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        List<String> defaultUsers = Arrays.asList("admin", "coop1", "farmer1");
        for (String username : defaultUsers) {
            User user = userService.getByUsername(username);
            if (user == null) {
                continue;
            }
            if (!passwordEncoder.matches(DEFAULT_PASSWORD, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(DEFAULT_PASSWORD));
                userService.updateById(user);
            }
        }
    }
}
