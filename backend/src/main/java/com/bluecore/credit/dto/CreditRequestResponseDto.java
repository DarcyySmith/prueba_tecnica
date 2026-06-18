package com.bluecore.credit.dto;

import com.bluecore.credit.enums.RequestStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class CreditRequestResponseDto {

    private Long id;
    private BigDecimal amount;
    private Integer termMonths;
    private String applicantId;
    private RequestStatus status;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
