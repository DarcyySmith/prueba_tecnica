package com.bluecore.credit.service;

import com.bluecore.credit.dto.CreateCreditRequestDto;
import com.bluecore.credit.dto.CreditRequestResponseDto;
import com.bluecore.credit.dto.UpdateStatusDto;
import com.bluecore.credit.enums.RequestStatus;
import com.bluecore.credit.exception.BusinessException;
import com.bluecore.credit.model.CreditRequest;
import com.bluecore.credit.repository.CreditRequestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CreditRequestServiceTest {

    @Mock
    private CreditRequestRepository repository;

    @InjectMocks
    private CreditRequestServiceImpl service;

    private CreditRequest pendingRequest;

    @BeforeEach
    void setUp() {
        pendingRequest = CreditRequest.builder()
                .id(1L)
                .amount(new BigDecimal("5000.00"))
                .termMonths(12)
                .applicantId("1234567890")
                .status(RequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void create_shouldReturnDtoWithPendingStatus() {
        CreateCreditRequestDto dto = new CreateCreditRequestDto();
        dto.setAmount(new BigDecimal("5000.00"));
        dto.setTermMonths(12);
        dto.setApplicantId("1234567890");

        when(repository.save(any(CreditRequest.class))).thenReturn(pendingRequest);

        CreditRequestResponseDto result = service.create(dto);

        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(RequestStatus.PENDING);
        assertThat(result.getAmount()).isEqualByComparingTo(new BigDecimal("5000.00"));
        assertThat(result.getApplicantId()).isEqualTo("1234567890");
    }

    @Test
    void updateStatus_shouldThrowBusinessException_whenRequestAlreadyProcessed() {
        CreditRequest approvedRequest = CreditRequest.builder()
                .id(1L)
                .amount(new BigDecimal("5000.00"))
                .termMonths(12)
                .applicantId("1234567890")
                .status(RequestStatus.APPROVED)
                .createdAt(LocalDateTime.now())
                .build();

        UpdateStatusDto dto = new UpdateStatusDto();
        dto.setStatus(RequestStatus.REJECTED);
        dto.setComment("Rechazado");

        when(repository.findById(1L)).thenReturn(Optional.of(approvedRequest));

        assertThatThrownBy(() -> service.updateStatus(1L, dto))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("ya fue procesada");
    }

    @Test
    void updateStatus_shouldThrowBusinessException_whenRejectingWithoutComment() {
        UpdateStatusDto dto = new UpdateStatusDto();
        dto.setStatus(RequestStatus.REJECTED);
        dto.setComment("");

        when(repository.findById(1L)).thenReturn(Optional.of(pendingRequest));

        assertThatThrownBy(() -> service.updateStatus(1L, dto))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("comentario es obligatorio");
    }

    @Test
    void updateStatus_shouldApproveRequest_whenValid() {
        UpdateStatusDto dto = new UpdateStatusDto();
        dto.setStatus(RequestStatus.APPROVED);
        dto.setComment("Aprobado correctamente");

        CreditRequest approvedRequest = CreditRequest.builder()
                .id(1L)
                .amount(new BigDecimal("5000.00"))
                .termMonths(12)
                .applicantId("1234567890")
                .status(RequestStatus.APPROVED)
                .comment("Aprobado correctamente")
                .createdAt(LocalDateTime.now())
                .build();

        when(repository.findById(1L)).thenReturn(Optional.of(pendingRequest));
        when(repository.save(any(CreditRequest.class))).thenReturn(approvedRequest);

        CreditRequestResponseDto result = service.updateStatus(1L, dto);

        assertThat(result.getStatus()).isEqualTo(RequestStatus.APPROVED);
    }

    @Test
    void findById_shouldThrowBusinessException_whenNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById(99L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("no encontrada");
    }
}
