package com.textic.fs3_app.config;

import com.textic.fs3_app.model.User;
import com.textic.fs3_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@mail.com");
            admin.setRol("admin");
            userRepository.save(admin);

            User jessica = new User();
            jessica.setUsername("jessica");
            jessica.setPassword(passwordEncoder.encode("jess123"));
            jessica.setEmail("jessica@mail.com");
            jessica.setRol("user");
            userRepository.save(jessica);

            User martin = new User();
            martin.setUsername("martin");
            martin.setPassword(passwordEncoder.encode("martin123"));
            martin.setEmail("martin@mail.com");
            martin.setRol("user");
            userRepository.save(martin);
        }
    }
}
