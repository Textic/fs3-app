package com.textic.result_service.controller;

import com.textic.result_service.model.Resultado;
import com.textic.result_service.service.ResultadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resultados")
public class ResultadoController {
	@Autowired
	private ResultadoService resultadoService;

	@GetMapping
	public List<Resultado> getAllResultados() {
		return resultadoService.findAll();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Resultado> getResultadoById(@PathVariable Long id) {
		return resultadoService.findById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<Resultado> createResultado(@RequestBody Resultado resultado) {
		return new ResponseEntity<>(resultadoService.save(resultado), HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Resultado> updateResultado(@PathVariable Long id, @RequestBody Resultado resultado) {
		return resultadoService.findById(id)
				.map(existing -> {
					resultado.setId(id);
					return ResponseEntity.ok(resultadoService.save(resultado));
				})
				.orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteResultado(@PathVariable Long id) {
		return resultadoService.findById(id)
				.map(resultado -> {
					resultadoService.deleteById(id);
					return ResponseEntity.ok().build();
				})
				.orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("/paciente/{pacienteId}")
	public List<Resultado> getResultadosByPaciente(@PathVariable Long pacienteId) {
		return resultadoService.findByPacienteId(pacienteId);
	}
}
