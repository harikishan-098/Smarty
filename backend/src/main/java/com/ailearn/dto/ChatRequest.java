package com.ailearn.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

/** Request body for the isolated AI Buddy chat endpoint. */
public class ChatRequest {
    @NotEmpty
    @Size(max = 30)
    @Valid
    private List<ChatMessage> messages;

    public ChatRequest() {}

    public List<ChatMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }
}
