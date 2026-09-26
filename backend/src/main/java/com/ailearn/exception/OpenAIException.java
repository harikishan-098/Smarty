package com.ailearn.exception;

/**
 * Custom exception for OpenAI API errors
 */
public class OpenAIException extends RuntimeException {
    
    public OpenAIException(String message) {
        super(message);
    }
    
    public OpenAIException(String message, Throwable cause) {
        super(message, cause);
    }
}