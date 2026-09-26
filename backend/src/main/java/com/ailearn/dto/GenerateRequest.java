package com.ailearn.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class GenerateRequest {

    @NotBlank(message = "Prompt cannot be empty")
    @Size(min = 5, max = 2000,
          message = "Prompt must be between 5 and 2000 characters")
    private String prompt;

    public GenerateRequest() {
    }

    public GenerateRequest(String prompt) {
        this.prompt = prompt;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }
}