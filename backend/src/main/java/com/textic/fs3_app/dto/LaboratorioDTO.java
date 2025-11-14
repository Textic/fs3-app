package com.textic.fs3_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LaboratorioDTO {
    private Long id;
    private String nombre;
    private String direccion;
    private String telefono;
}
