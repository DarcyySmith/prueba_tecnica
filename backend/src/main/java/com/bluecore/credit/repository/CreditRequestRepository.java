package com.bluecore.credit.repository;

import com.bluecore.credit.enums.RequestStatus;
import com.bluecore.credit.model.CreditRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditRequestRepository extends JpaRepository<CreditRequest, Long> {

    Page<CreditRequest> findByStatus(RequestStatus status, Pageable pageable);
}
