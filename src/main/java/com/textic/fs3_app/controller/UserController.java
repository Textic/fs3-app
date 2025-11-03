package com.textic.fs3_app.controller;

import com.textic.fs3_app.dto.UserDTO;
import com.textic.fs3_app.model.User;
import com.textic.fs3_app.repository.LaboratorioRepository;
import com.textic.fs3_app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private LaboratorioRepository laboratorioRepository;

    private UserDTO convertToDTO(User user) {
        return new UserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getRol(), user.getLaboratorio() != null ? user.getLaboratorio().getId() : null);
    }

    @GetMapping
    public List<UserDTO> getAllUsers() {
        logger.info("Solicitud para obtener todos los usuarios");
        return userRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        logger.info("Solicitud para obtener usuario por ID: {}", id);
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(convertToDTO(user)))
                .orElse(ResponseEntity.notFound().build());
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
        return new ResponseEntity<>(convertToDTO(savedUser), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        logger.info("Solicitud para actualizar usuario: {}", id);
        String role = userDetails.getRol();
        if (role != null && !"admin".equalsIgnoreCase(role) && !"user".equalsIgnoreCase(role)) {
            return new ResponseEntity<>("Rol invalido. Los roles permitidos son 'admin' y 'user'.", HttpStatus.BAD_REQUEST);
        }

        return userRepository.findById(id).<ResponseEntity<?>>map(user -> {
            user.setUsername(userDetails.getUsername());
            user.setEmail(userDetails.getEmail());
            if (role != null) {
                user.setRol(userDetails.getRol());
            }
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }
            User updatedUser = userRepository.save(user);
            return new ResponseEntity<>(convertToDTO(updatedUser), HttpStatus.OK);
        }).orElse(new ResponseEntity<>("Usuario no encontrado.", HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        logger.info("Solicitud para eliminar usuario: {}", id);
        return userRepository.findById(id).<ResponseEntity<?>>map(user -> {
            userRepository.delete(user);
            logger.info("Usuario eliminado con ID: {}", id);
            return new ResponseEntity<>("Usuario eliminado exitosamente.", HttpStatus.OK);
        }).orElse(new ResponseEntity<>("Usuario no encontrado.", HttpStatus.NOT_FOUND));
    }

    @PutMapping("/assign/{userId}/lab/{labId}")
    public ResponseEntity<?> assignLaboratorioToUser(@PathVariable Long userId, @PathVariable Long labId) {
        logger.info("Solicitud para asignar laboratorio {} al usuario {}", labId, userId);

        return userRepository.findById(userId).<ResponseEntity<?>>map(user -> 
            laboratorioRepository.findById(labId).<ResponseEntity<?>>map(lab -> {
                user.setLaboratorio(lab);
                User updatedUser = userRepository.save(user);
                logger.info("Laboratorio {} asignado exitosamente al usuario {}", labId, userId);
                return new ResponseEntity<>(convertToDTO(updatedUser), HttpStatus.OK);
            }).orElse(new ResponseEntity<>("Laboratorio no encontrado.", HttpStatus.NOT_FOUND))
        ).orElse(new ResponseEntity<>("Usuario no encontrado.", HttpStatus.NOT_FOUND));
    }
}
