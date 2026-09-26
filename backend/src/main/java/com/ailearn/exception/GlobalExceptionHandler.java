package com.ailearn.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for the application
 */

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log =
        LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    /**
     * Handle validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        
        Map<String, Object> errors = new HashMap<>();
        Map<String, String> fieldErrors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });
        
        errors.put("error", "Validation failed");
        errors.put("fields", fieldErrors);
        
        log.warn("Validation error: {}", fieldErrors);
        return ResponseEntity.badRequest().body(errors);
    }
    
    /**
     * Handle OpenAI API errors
     */
    @ExceptionHandler(OpenAIException.class)
    public ResponseEntity<Map<String, String>> handleOpenAIException(OpenAIException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "OpenAI API Error");
        error.put("message", ex.getMessage());
        
        log.error("OpenAI API error", ex);
        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(error);
    }
    
    /**
     * Handle configuration errors
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalStateException(
            IllegalStateException ex) {
        
        Map<String, String> error = new HashMap<>();
        error.put("error", "Configuration Error");
        error.put("message", ex.getMessage());
        
        log.error("Configuration error", ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }
    
    /**
     * Handle all other exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Something went wrong while generating your lesson. Please try again.");
        error.put("details", ex.getMessage());
        
        log.error("Unexpected error", ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }
}