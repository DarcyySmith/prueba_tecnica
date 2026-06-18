package com.bluecore.credit.controller;

import com.bluecore.credit.dto.CreateCreditRequestDto;
import com.bluecore.credit.dto.CreditRequestResponseDto;
import com.bluecore.credit.dto.UpdateStatusDto;
import com.bluecore.credit.enums.RequestStatus;
import com.bluecore.credit.service.CreditRequestService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CreditRequestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CreditRequestService service;

    private CreditRequestResponseDto buildResponse() {
        return CreditRequestResponseDto.builder()
                .id(1L)
                .amount(new BigDecimal("5000.00"))
                .termMonths(12)
                .applicantId("1234567890")
                .status(RequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @WithMockUser
    void create_shouldReturn201_whenValidRequest() throws Exception {
        CreateCreditRequestDto dto = new CreateCreditRequestDto();
        dto.setAmount(new BigDecimal("5000.00"));
        dto.setTermMonths(12);
        dto.setApplicantId("1234567890");

        when(service.create(any())).thenReturn(buildResponse());

        mockMvc.perform(post("/api/v1/credit-requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.applicantId").value("1234567890"));
    }

    @Test
    @WithMockUser
    void create_shouldReturn400_whenAmountIsMissing() throws Exception {
        CreateCreditRequestDto dto = new CreateCreditRequestDto();
        dto.setTermMonths(12);
        dto.setApplicantId("1234567890");

        mockMvc.perform(post("/api/v1/credit-requests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @WithMockUser
    void findAll_shouldReturn200_withPagedResults() throws Exception {
        when(service.findAll(any(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(buildResponse())));

        mockMvc.perform(get("/api/v1/credit-requests"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].id").value(1));
    }

    @Test
    @WithMockUser
    void updateStatus_shouldReturn200_whenValid() throws Exception {
        UpdateStatusDto dto = new UpdateStatusDto();
        dto.setStatus(RequestStatus.APPROVED);
        dto.setComment("Todo en orden");

        CreditRequestResponseDto response = CreditRequestResponseDto.builder()
                .id(1L)
                .amount(new BigDecimal("5000.00"))
                .termMonths(12)
                .applicantId("1234567890")
                .status(RequestStatus.APPROVED)
                .comment("Todo en orden")
                .createdAt(LocalDateTime.now())
                .build();

        when(service.updateStatus(eq(1L), any())).thenReturn(response);

        mockMvc.perform(patch("/api/v1/credit-requests/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APPROVED"));
    }
}
