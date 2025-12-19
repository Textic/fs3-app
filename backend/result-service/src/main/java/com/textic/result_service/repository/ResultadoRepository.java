package com.textic.result_service.repository;

import com.textic.result_service.model.Resultado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResultadoRepository extends JpaRepository<Resultado, Long> {
	List<Resultado> findByPacienteId(Long pacienteId);

	List<Resultado> findByLaboratorioId(Long laboratorioId);
}
