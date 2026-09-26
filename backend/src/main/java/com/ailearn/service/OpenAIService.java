package com.ailearn.service;

import com.ailearn.dto.GenerateResponse;
import com.ailearn.dto.PracticeQuestion;
import com.ailearn.exception.OpenAIException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Service for interacting with OpenAI API
 */

@Service
public class OpenAIService {
    private static final Logger log =
 LoggerFactory.getLogger(OpenAIService.class);
    
    private static final String OPENAI_API_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
    private static final MediaType JSON_MEDIA_TYPE = MediaType.get("application/json; charset=utf-8");
    
    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String systemPrompt;
    
    @Autowired
    public OpenAIService(String openAIApiKey, ObjectMapper objectMapper) throws IOException {
        this.apiKey = openAIApiKey;
        this.objectMapper = objectMapper;
        
        // Initialize HTTP client with timeouts
        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(90, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
        
        // Load system prompt from file
        this.systemPrompt = loadSystemPrompt();
        
        log.info("OpenAI Service initialized successfully");
    }
    
    /**
     * Load system prompt from resources
     */
    private String loadSystemPrompt() throws IOException {
        try {
            ClassPathResource resource = new ClassPathResource("prompts/system-prompt.txt");
            byte[] bytes = resource.getInputStream().readAllBytes();
            String prompt = new String(bytes, StandardCharsets.UTF_8);
            log.debug("System prompt loaded from file");
            return prompt;
        } catch (IOException e) {
            log.warn("Could not load system prompt from file, using default", e);
            return getDefaultSystemPrompt();
        }
    }
    
    /**
     * Default system prompt if file is not found
     */
    private String getDefaultSystemPrompt() {
        return """
            You are an expert educational AI assistant specialized in creating comprehensive learning experiences.
            
            Your job is to transform a user's topic or request into a clear, visual, and interactive learning experience.
            
            Analyze the user's request and generate:
            
            1. A suitable title (concise and descriptive)
            2. A concise summary (2-3 sentences explaining the topic)
            3. A clear step-by-step explanation (array of 4-6 key points)
            4. A useful visual diagram when appropriate (using Mermaid syntax)
            5. Exactly 10 practice questions with 4 options each
            
            DIAGRAM GUIDELINES:
            - Use Mermaid.js syntax (flowchart, graph TD, sequenceDiagram, etc.)
            - Keep diagrams simple and clear
            - Only create diagrams when they meaningfully help explain the topic
            - If a diagram is not useful, set diagram_type to "none" and diagram to empty string
            - Common diagram types:
              * flowchart: Use "graph TD" for top-down flowcharts
              * hierarchy: Use "graph TD" with hierarchical structure
              * sequence: Use "sequenceDiagram" for process sequences
            
            PRACTICE QUESTIONS GUIDELINES:
            - Create EXACTLY 10 questions
            - Mix difficulty levels (3 easy, 4 medium, 3 hard)
            - Include conceptual and application-based questions
            - Each question must have exactly 4 options
            - Provide clear explanations for correct answers
            - Ensure the answer field exactly matches one of the options
            
            Return ONLY valid JSON matching this exact schema:
            {
              "title": "string",
              "summary": "string",
              "explanation": ["string", "string", ...],
              "diagram_type": "flowchart|hierarchy|sequence|none",
              "diagram": "mermaid syntax or empty string",
              "practice_questions": [
                {
                  "question": "string",
                  "options": ["option1", "option2", "option3", "option4"],
                  "answer": "correct option text (must match one of the options exactly)",
                  "explanation": "why this is correct"
                }
              ]
            }
            
            CRITICAL REQUIREMENTS:
            - Do NOT wrap the JSON in markdown code fences (no ```json or ```)
            - Do NOT include any text outside the JSON
            - Ensure practice_questions array has EXACTLY 10 items
            - Ensure each question has EXACTLY 4 options
            - Make sure the Mermaid syntax is valid and will render properly
            - The explanation array should have 4-6 clear, concise points
            """;
    }
    
    /**
     * Generate educational content using OpenAI API
     */
    public GenerateResponse generateEducationalContent(String userPrompt) {
        log.info("Generating educational content for prompt: {}", userPrompt);
        
        try {
            // Build request payload
            String requestBody = buildRequestPayload(userPrompt);
            log.debug("Request payload: {}", requestBody);
            
            // Create HTTP request
            Request request = new Request.Builder()
                    .url(OPENAI_API_URL)
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .addHeader("Content-Type", "application/json")
                    .post(RequestBody.create(requestBody, JSON_MEDIA_TYPE))
                    .build();
            
            // Execute request
            try (Response response = httpClient.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    String errorBody = response.body() != null ? response.body().string() : "Unknown error";
                    log.error("OpenAI API error: {} - {}", response.code(), errorBody);
                    
                    if (response.code() == 401) {
                        throw new OpenAIException("Invalid API key. Please check your OPENAI_API_KEY configuration.");
                    } else if (response.code() == 429) {
    if (errorBody.contains("credit_balance_exhausted")) {
        throw new OpenAIException(
            "OpenAI API credits are exhausted. Please add API credits or check your API billing settings."
        );
    }

    throw new OpenAIException(
        "OpenAI API rate limit reached. Please try again later."
    );
} else {
                        throw new OpenAIException("OpenAI API request failed with status: " + response.code());
                    }
                }
                
                String responseBody = response.body().string();
                log.debug("OpenAI API response received");
                
                // Parse and validate response
                GenerateResponse result = parseOpenAIResponse(responseBody);
                validateResponse(result);
                
                log.info("Successfully generated content for: {}", userPrompt);
                return result;
            }
        } catch (IOException e) {
            log.error("Error communicating with OpenAI API", e);
            throw new OpenAIException("Failed to communicate with OpenAI API: " + e.getMessage(), e);
        }
    }
    
    /**
     * Build JSON request payload for OpenAI API
     */
    private String buildRequestPayload(String userPrompt) throws IOException {
        var payload = objectMapper.createObjectNode();
        
        // Use GPT-4 Turbo for best results
        payload.put("model", "gemini-3.8-flash");
        payload.put("reasoning_effort","low");
        payload.put("max_completion_tokens", 4000);
        
        // Build messages array
        var messages = payload.putArray("messages");
        
        // System message
        messages.addObject()
                .put("role", "system")
                .put("content", systemPrompt);
        
        // User message
        messages.addObject()
                .put("role", "user")
                .put("content", userPrompt);
        
        return objectMapper.writeValueAsString(payload);
    }
    
    /**
     * Parse OpenAI API response and extract educational content
     */
    private GenerateResponse parseOpenAIResponse(String responseBody) throws IOException {
        JsonNode root = objectMapper.readTree(responseBody);
        
        // Extract content from OpenAI response
        String content = root.path("choices")
                .path(0)
                .path("message")
                .path("content")
                .asText();
        
        if (content == null || content.isEmpty()) {
            throw new OpenAIException("Empty response from OpenAI API");
        }
        
        // Clean content (remove markdown code fences if present)
        content = cleanJsonContent(content);
        
        log.debug("Cleaned AI response: {}", content);
        
        // Parse JSON into GenerateResponse object
        try {
            return objectMapper.readValue(content, GenerateResponse.class);
        } catch (Exception e) {
            log.error("Failed to parse AI response as JSON: {}", content);
            throw new OpenAIException("Invalid JSON response from AI: " + e.getMessage(), e);
        }
    }
    
    /**
     * Clean JSON content by removing markdown code fences
     */
    private String cleanJsonContent(String content) {
        content = content.trim();
        
        // Remove ```json or ``` at the start
        if (content.startsWith("```json")) {
            content = content.substring(7);
        } else if (content.startsWith("```")) {
            content = content.substring(3);
        }
        
        // Remove ``` at the end
        if (content.endsWith("```")) {
            content = content.substring(0, content.length() - 3);
        }
        
        return content.trim();
    }
    
    /**
     * Validate the generated response
     */
    private void validateResponse(GenerateResponse response) {
        List<String> errors = new ArrayList<>();
        
        // Validate title
        if (response.getTitle() == null || response.getTitle().isEmpty()) {
            errors.add("Missing or empty title");
        }
        
        // Validate summary
        if (response.getSummary() == null || response.getSummary().isEmpty()) {
            errors.add("Missing or empty summary");
        }
        
        // Validate explanation
        if (response.getExplanation() == null || response.getExplanation().isEmpty()) {
            errors.add("Missing or empty explanation");
        }
        
        // Validate diagram type
        if (response.getDiagramType() == null) {
            errors.add("Missing diagram_type");
        } else {
            String diagramType = response.getDiagramType().toLowerCase();
            if (!diagramType.equals("none") && 
                (response.getDiagram() == null || response.getDiagram().isEmpty())) {
                errors.add("diagram_type is not 'none' but diagram content is missing");
            }
        }
        
        // Validate practice questions
        if (response.getPracticeQuestions() == null) {
            errors.add("Missing practice_questions");
        } else if (response.getPracticeQuestions().size() != 10) {
            errors.add("Expected exactly 10 practice questions, got " + 
                      response.getPracticeQuestions().size());
        } else {
            // Validate each question
            for (int i = 0; i < response.getPracticeQuestions().size(); i++) {
                PracticeQuestion q = response.getPracticeQuestions().get(i);
                
                if (q.getQuestion() == null || q.getQuestion().isEmpty()) {
                    errors.add("Question " + (i + 1) + ": Missing question text");
                }
                
                if (q.getOptions() == null || q.getOptions().size() != 4) {
                    errors.add("Question " + (i + 1) + ": Must have exactly 4 options, got " + 
                              (q.getOptions() != null ? q.getOptions().size() : 0));
                }
                
                if (q.getAnswer() == null || q.getAnswer().isEmpty()) {
                    errors.add("Question " + (i + 1) + ": Missing answer");
                }
                
                if (q.getOptions() != null && q.getAnswer() != null && 
                    !q.getOptions().contains(q.getAnswer())) {
                    errors.add("Question " + (i + 1) + ": Answer '" + q.getAnswer() + 
                              "' is not in the options list");
                }
                
                if (q.getExplanation() == null || q.getExplanation().isEmpty()) {
                    errors.add("Question " + (i + 1) + ": Missing explanation");
                }
            }
        }
        
        // If there are any errors, throw exception
        if (!errors.isEmpty()) {
            String errorMessage = "Invalid AI response:\n- " + String.join("\n- ", errors);
            log.error(errorMessage);
            throw new OpenAIException(errorMessage);
        }
        
        log.debug("Response validation passed");
    }
}