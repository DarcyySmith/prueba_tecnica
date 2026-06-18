package com.bluecore.credit.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDto {

    private String token;
    private String username;
    private long expiresIn;
}
