package com.textic.fs3_app.controller;

import com.textic.fs3_app.model.User;
import com.textic.fs3_app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAllUsers() {
        logger.info("Solicitud para obtener todos los usuarios");
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        logger.info("Solicitud para obtener usuario por ID: {}", id);
        return userRepository.findById(id).orElse(null);
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        logger.info("Solicitud para crear usuario: {}", user.getUsername());
        String role = user.getRol();
        if (!"admin".equalsIgnoreCase(role) && !"user".equalsIgnoreCase(role)) {
            return new ResponseEntity<>("Rol invalido. Los roles permitidos son 'admin' y 'user'.", HttpStatus.BAD_REQUEST);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        logger.info("Solicitud para actualizar usuario: {}", id);
        String role = userDetails.getRol();
        if (role != null && !"admin".equalsIgnoreCase(role) && !"user".equalsIgnoreCase(role)) {
            return new ResponseEntity<>("Rol invalido. Los roles permitidos son 'admin' y 'user'.", HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.setUsername(userDetails.getUsername());
            user.setEmail(userDetails.getEmail());
            if (role != null) {
                user.setRol(userDetails.getRol());
            }
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }
            User updatedUser = userRepository.save(user);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        }
        return new ResponseEntity<>("Usuario no encontrado.", HttpStatus.NOT_FOUND);
    }
}
