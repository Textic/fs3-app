package com.textic.fs3_app.controller;

import com.textic.fs3_app.model.Laboratorio;
import com.textic.fs3_app.repository.LaboratorioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/laboratorios")
public class LaboratorioController {

    private static final Logger logger = LoggerFactory.getLogger(LaboratorioController.class);

    @Autowired
    private LaboratorioRepository laboratorioRepository;

    @GetMapping
    public List<Laboratorio> getAllLaboratorios() {
        logger.info("Solicitud para obtener todos los laboratorios");
        return laboratorioRepository.findAll();
    }

    @PostMapping
    public Laboratorio createLaboratorio(@RequestBody Laboratorio laboratorio) {
        logger.info("Solicitud para crear laboratorio: {}", laboratorio.getNombre());
        return laboratorioRepository.save(laboratorio);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Laboratorio> getLaboratorioById(@PathVariable(value = "id") Long laboratorioId) {
        logger.info("Solicitud para obtener laboratorio por ID: {}", laboratorioId);
        Optional<Laboratorio> laboratorio = laboratorioRepository.findById(laboratorioId);
        if (laboratorio.isPresent()) {
            return ResponseEntity.ok().body(laboratorio.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Laboratorio> updateLaboratorio(@PathVariable(value = "id") Long laboratorioId, @RequestBody Laboratorio laboratorioDetails) {
        logger.info("Solicitud para actualizar laboratorio: {}", laboratorioId);
        Optional<Laboratorio> laboratorio = laboratorioRepository.findById(laboratorioId);
        if (laboratorio.isPresent()) {
            Laboratorio labToUpdate = laboratorio.get();
            labToUpdate.setNombre(laboratorioDetails.getNombre());
            labToUpdate.setDireccion(laboratorioDetails.getDireccion());
            labToUpdate.setTelefono(laboratorioDetails.getTelefono());
            final Laboratorio updatedLaboratorio = laboratorioRepository.save(labToUpdate);
            return ResponseEntity.ok(updatedLaboratorio);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLaboratorio(@PathVariable(value = "id") Long laboratorioId) {
        logger.info("Solicitud para eliminar laboratorio: {}", laboratorioId);
        Optional<Laboratorio> laboratorio = laboratorioRepository.findById(laboratorioId);
        if (laboratorio.isPresent()) {
            laboratorioRepository.delete(laboratorio.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}