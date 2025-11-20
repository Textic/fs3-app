package com.textic.fs3_app.service;

import com.textic.fs3_app.model.Resultado;
import com.textic.fs3_app.repository.ResultadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ResultadoService {
    @Autowired
    private ResultadoRepository resultadoRepository;

    public List<Resultado> findAll() {
        return resultadoRepository.findAll();
    }

    public Optional<Resultado> findById(Long id) {
        return resultadoRepository.findById(id);
    }

    public Resultado save(Resultado resultado) {
        return resultadoRepository.save(resultado);
    }

    public void deleteById(Long id) {
        resultadoRepository.deleteById(id);
    }
    
    public List<Resultado> findByPacienteId(Long pacienteId) {
        return resultadoRepository.findByPacienteId(pacienteId);
    }
}
