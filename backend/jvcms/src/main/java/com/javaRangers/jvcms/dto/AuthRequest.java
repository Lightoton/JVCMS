package com.javaRangers.jvcms.dto;

public record AuthRequest(
        String email,
        String password
) {}