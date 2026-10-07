package com.javaRangers.jvcms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @Email(message = "Invalid email format")
        @Size(max = 255, message = "Email is too long")
        String newEmail, 
        
        @Size(min = 5, max = 50, message = "Password must be between 5 and 50 characters")
        String newPassword
) {
}
