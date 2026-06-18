package com.bluecore.credit.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateCreditRequestDto {

    @NotNull(message = "El monto es requerido")
    @DecimalMin(value = "500.00", message = "El monto mínimo es $500")
    @DecimalMax(value = "50000.00", message = "El monto máximo es $50,000")
    private BigDecimal amount;

    @NotNull(message = "El plazo es requerido")
    @Min(value = 6, message = "El plazo mínimo es 6 meses")
    @Max(value = 60, message = "El plazo máximo es 60 meses")
    private Integer termMonths;

    @NotBlank(message = "La cédula del solicitante es requerida")
    @Size(max = 20, message = "La cédula no puede superar los 20 caracteres")
    private String applicantId;
}
