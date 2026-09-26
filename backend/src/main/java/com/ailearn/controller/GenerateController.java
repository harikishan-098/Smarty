package com.ailearn.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.ailearn.dto.GenerateRequest;
import com.ailearn.dto.GenerateResponse;
import com.ailearn.service.OpenAIService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for content generation endpoints
 */

@RestController
@RequestMapping("/api")

public class GenerateController {
    private static final Logger log =
        LoggerFactory.getLogger(GenerateController.class);
    
    private final OpenAIService openAIService;
    public GenerateController(OpenAIService openAIService) {
    this.openAIService = openAIService;
}
    
    /**
     * Generate educational content based on user prompt
     * 
     * @param request Contains the user's prompt
     * @return Generated educational content with diagrams and questions
     */
    @PostMapping("/generate")
    public ResponseEntity<GenerateResponse> generateContent(
            @Valid @RequestBody GenerateRequest request) {
        
        log.info("Received generate request: '{}'", request.getPrompt());
        long startTime = System.currentTimeMillis();
        
        try {
            GenerateResponse response = openAIService.generateEducationalContent(request.getPrompt());
            
            long duration = System.currentTimeMillis() - startTime;
            log.info("Successfully generated content in {}ms for: '{}'", duration, request.getPrompt());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error generating content for prompt: '{}'", request.getPrompt(), e);
            throw e; // Will be handled by GlobalExceptionHandler
        }
    }
    
    /**
     * Health check endpoint
     * 
     * @return Server status
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "AI Learning Backend is running");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("service", "AI Learn & Visualize API");
        response.put("version", "1.0.0");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get API information
     * 
     * @return API metadata
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "AI Learn & Visualize API");
        info.put("version", "1.0.0");
        info.put("description", "Backend service for AI-powered educational content generation");
        
        Map<String, String> endpoints = new HashMap<>();
        endpoints.put("POST /api/generate", "Generate educational content from a prompt");
        endpoints.put("GET /api/health", "Check server health");
        endpoints.put("GET /api/info", "Get API information");
        info.put("endpoints", endpoints);
        
        return ResponseEntity.ok(info);
    }
}