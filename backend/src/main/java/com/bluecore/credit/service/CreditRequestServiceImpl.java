package com.bluecore.credit.service;

import com.bluecore.credit.dto.CreateCreditRequestDto;
import com.bluecore.credit.dto.CreditRequestResponseDto;
import com.bluecore.credit.dto.UpdateStatusDto;
import com.bluecore.credit.enums.RequestStatus;
import com.bluecore.credit.exception.BusinessException;
import com.bluecore.credit.model.CreditRequest;
import com.bluecore.credit.repository.CreditRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreditRequestServiceImpl implements CreditRequestService {

    private final CreditRequestRepository repository;

    @Override
    @Transactional
    public CreditRequestResponseDto create(CreateCreditRequestDto dto) {
        CreditRequest request = CreditRequest.builder()
                .amount(dto.getAmount())
                .termMonths(dto.getTermMonths())
                .applicantId(dto.getApplicantId())
                .build();

        return toDto(repository.save(request));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CreditRequestResponseDto> findAll(RequestStatus status, Pageable pageable) {
        if (status != null) {
            return repository.findByStatus(status, pageable).map(this::toDto);
        }
        return repository.findAll(pageable).map(this::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public CreditRequestResponseDto findById(Long id) {
        return toDto(getOrThrow(id));
    }

    @Override
    @Transactional
    public CreditRequestResponseDto updateStatus(Long id, UpdateStatusDto dto) {
        CreditRequest request = getOrThrow(id);

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BusinessException(
                    "La solicitud ya fue procesada y no puede modificarse",
                    HttpStatus.CONFLICT
            );
        }

        if (dto.getStatus() == RequestStatus.REJECTED &&
                (dto.getComment() == null || dto.getComment().isBlank())) {
            throw new BusinessException(
                    "El comentario es obligatorio al rechazar una solicitud",
                    HttpStatus.UNPROCESSABLE_ENTITY
            );
        }

        if (dto.getStatus() == RequestStatus.PENDING) {
            throw new BusinessException(
                    "No se puede establecer el estado PENDING manualmente",
                    HttpStatus.BAD_REQUEST
            );
        }

        request.setStatus(dto.getStatus());
        request.setComment(dto.getComment());

        return toDto(repository.save(request));
    }

    private CreditRequest getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        "Solicitud de crédito no encontrada con id: " + id,
                        HttpStatus.NOT_FOUND
                ));
    }

    private CreditRequestResponseDto toDto(CreditRequest request) {
        return CreditRequestResponseDto.builder()
                .id(request.getId())
                .amount(request.getAmount())
                .termMonths(request.getTermMonths())
                .applicantId(request.getApplicantId())
                .status(request.getStatus())
                .comment(request.getComment())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }
}
