package com.bluecore.credit.dto;

import com.bluecore.credit.enums.RequestStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateStatusDto {

    @NotNull(message = "El estado es requerido")
    private RequestStatus status;

    private String comment;
}
