package com.textic.fs3_app.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Resultado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private User paciente;

    @ManyToOne
    @JoinColumn(name = "laboratorio_id")
    private Laboratorio laboratorio;

    private String analisis;
    
    @Temporal(TemporalType.DATE)
    private Date fecha;
}
