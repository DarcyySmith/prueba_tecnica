package com.bluecore.credit.service;

import com.bluecore.credit.dto.CreateCreditRequestDto;
import com.bluecore.credit.dto.CreditRequestResponseDto;
import com.bluecore.credit.dto.UpdateStatusDto;
import com.bluecore.credit.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CreditRequestService {

    CreditRequestResponseDto create(CreateCreditRequestDto dto);

    Page<CreditRequestResponseDto> findAll(RequestStatus status, Pageable pageable);

    CreditRequestResponseDto findById(Long id);

    CreditRequestResponseDto updateStatus(Long id, UpdateStatusDto dto);
}
