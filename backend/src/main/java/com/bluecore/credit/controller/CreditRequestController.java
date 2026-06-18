package com.bluecore.credit.controller;

import com.bluecore.credit.dto.CreateCreditRequestDto;
import com.bluecore.credit.dto.CreditRequestResponseDto;
import com.bluecore.credit.dto.UpdateStatusDto;
import com.bluecore.credit.enums.RequestStatus;
import com.bluecore.credit.service.CreditRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/credit-requests")
@RequiredArgsConstructor
@Tag(name = "Credit Requests", description = "Gestión de solicitudes de crédito")
@SecurityRequirement(name = "bearerAuth")
public class CreditRequestController {

    private final CreditRequestService service;

    @PostMapping
    @Operation(summary = "Crear una nueva solicitud de crédito")
    public ResponseEntity<CreditRequestResponseDto> create(
            @Valid @RequestBody CreateCreditRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @GetMapping
    @Operation(summary = "Listar solicitudes con filtro opcional por estado")
    public ResponseEntity<Page<CreditRequestResponseDto>> findAll(
            @RequestParam(required = false) RequestStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(service.findAll(status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle de una solicitud por ID")
    public ResponseEntity<CreditRequestResponseDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Aprobar o rechazar una solicitud con comentario")
    public ResponseEntity<CreditRequestResponseDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusDto dto) {
        return ResponseEntity.ok(service.updateStatus(id, dto));
    }
}
