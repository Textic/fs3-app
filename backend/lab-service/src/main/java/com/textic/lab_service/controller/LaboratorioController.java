package com.textic.lab_service.controller;

import com.textic.lab_service.dto.LaboratorioDTO;
import com.textic.lab_service.model.Laboratorio;
import com.textic.lab_service.repository.LaboratorioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/laboratorios")
public class LaboratorioController {

	private static final Logger logger = LoggerFactory.getLogger(LaboratorioController.class);

	@Autowired
	private LaboratorioRepository laboratorioRepository;

	private LaboratorioDTO convertToDTO(Laboratorio laboratorio) {
		return new LaboratorioDTO(laboratorio.getId(), laboratorio.getNombre(), laboratorio.getDireccion(),
				laboratorio.getTelefono());
	}

	private Laboratorio convertToEntity(LaboratorioDTO dto) {
		Laboratorio laboratorio = new Laboratorio();
		laboratorio.setId(dto.getId());
		laboratorio.setNombre(dto.getNombre());
		laboratorio.setDireccion(dto.getDireccion());
		laboratorio.setTelefono(dto.getTelefono());
		return laboratorio;
	}

	@GetMapping
	public List<LaboratorioDTO> getAllLaboratorios() {
		logger.info("Solicitud para obtener todos los laboratorios");
		return laboratorioRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@PostMapping
	public LaboratorioDTO createLaboratorio(@RequestBody LaboratorioDTO laboratorioDTO) {
		logger.info("Solicitud para crear laboratorio: {}", laboratorioDTO.getNombre());
		Laboratorio laboratorio = convertToEntity(laboratorioDTO);
		Laboratorio savedLaboratorio = laboratorioRepository.save(laboratorio);
		return convertToDTO(savedLaboratorio);
	}

	@GetMapping("/{id}")
	public ResponseEntity<LaboratorioDTO> getLaboratorioById(@PathVariable(value = "id") Long laboratorioId) {
		logger.info("Solicitud para obtener laboratorio por ID: {}", laboratorioId);
		Optional<Laboratorio> laboratorio = laboratorioRepository.findById(laboratorioId);
		if (laboratorio.isPresent()) {
			return ResponseEntity.ok().body(convertToDTO(laboratorio.get()));
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<LaboratorioDTO> updateLaboratorio(@PathVariable(value = "id") Long laboratorioId,
			@RequestBody LaboratorioDTO laboratorioDetails) {
		logger.info("Solicitud para actualizar laboratorio: {}", laboratorioId);
		Optional<Laboratorio> laboratorio = laboratorioRepository.findById(laboratorioId);
		if (laboratorio.isPresent()) {
			Laboratorio labToUpdate = laboratorio.get();
			labToUpdate.setNombre(laboratorioDetails.getNombre());
			labToUpdate.setDireccion(laboratorioDetails.getDireccion());
			labToUpdate.setTelefono(laboratorioDetails.getTelefono());
			final Laboratorio updatedLaboratorio = laboratorioRepository.save(labToUpdate);
			return ResponseEntity.ok(convertToDTO(updatedLaboratorio));
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
