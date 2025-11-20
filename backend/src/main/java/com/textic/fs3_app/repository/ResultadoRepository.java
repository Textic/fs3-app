package com.textic.fs3_app.repository;

import com.textic.fs3_app.model.Resultado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResultadoRepository extends JpaRepository<Resultado, Long> {
    List<Resultado> findByPacienteId(Long pacienteId);
    List<Resultado> findByLaboratorioId(Long laboratorioId);
}
