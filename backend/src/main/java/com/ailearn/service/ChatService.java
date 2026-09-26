package com.ailearn.service;

import com.ailearn.dto.ChatMessage;
import com.ailearn.dto.ChatRequest;
import com.ailearn.dto.ChatResponse;
import com.ailearn.exception.OpenAIException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

/**
 * Isolated OpenAI service for AI Buddy. The existing OpenAIService used by
 * /api/generate is intentionally not changed.
 */
@Service
public class ChatService {
    private static final Logger log = LoggerFactory.getLogger(ChatService.class);
    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private static final String MODEL = "gpt-5.6-luna";
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private static final String SYSTEM_PROMPT = """
            You are AI Buddy, a friendly general-purpose assistant inside an educational website.
            Answer the user's questions clearly and accurately. You can help with school subjects,
            coding, writing, explanations, brainstorming, and everyday factual questions.
            Keep answers easy to understand unless the user asks for more depth.
            Maintain the context of the conversation. If the user says things like 'explain this',
            'make it simpler', 'give an example', or 'what about that', use the previous messages
            to determine what they mean. Never claim to have real-time information unless it is
            actually available in the conversation or provided by a tool.
            """;

    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;

    public ChatService(String openAIApiKey, ObjectMapper objectMapper) {
        this.apiKey = openAIApiKey;
        this.objectMapper = objectMapper;
        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(90, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
    }

    public ChatResponse chat(ChatRequest request) {
        try {
            String payload = buildPayload(request);
            Request httpRequest = new Request.Builder()
                    .url(OPENAI_API_URL)
                    .post(RequestBody.create(payload, JSON))
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .addHeader("Content-Type", "application/json")
                    .build();

            try (Response response = httpClient.newCall(httpRequest).execute()) {
                String body = response.body() == null ? "" : response.body().string();
                if (!response.isSuccessful()) {
                    log.error("AI Buddy OpenAI request failed with status {}: {}", response.code(), body);
                    throw new OpenAIException("AI Buddy request failed (HTTP " + response.code() + "). Please try again.");
                }
                return parseResponse(body);
            }
        } catch (OpenAIException e) {
            throw e;
        } catch (Exception e) {
            log.error("AI Buddy request failed", e);
            throw new OpenAIException("AI Buddy could not get a response. Please try again.", e);
        }
    }

    private String buildPayload(ChatRequest request) throws IOException {
        var payload = objectMapper.createObjectNode();
        payload.put("model", MODEL);
        payload.put("max_completion_tokens", 2000);

        var messages = payload.putArray("messages");
        messages.addObject().put("role", "system").put("content", SYSTEM_PROMPT);

        for (ChatMessage message : request.getMessages()) {
            String role = message.getRole() == null ? "user" : message.getRole().toLowerCase(Locale.ROOT);
            if (!role.equals("user") && !role.equals("assistant")) {
                role = "user";
            }
            messages.addObject()
                    .put("role", role)
                    .put("content", message.getContent());
        }

        return objectMapper.writeValueAsString(payload);
    }

    private ChatResponse parseResponse(String responseBody) throws IOException {
        JsonNode root = objectMapper.readTree(responseBody);
        String content = root.path("choices").path(0).path("message").path("content").asText();
        if (content == null || content.isBlank()) {
            throw new OpenAIException("AI Buddy received an empty response.");
        }
        return new ChatResponse(content.trim());
    }
}
