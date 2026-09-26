package com.ailearn.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for Gemini API
 */
@Configuration
public class OpenAIConfig {

    @Bean
    public String openAIApiKey() {

        // Try to load from .env file first
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        String apiKey = dotenv.get("OPENAI_API_KEY");

        // Fall back to system environment variable
        if (apiKey == null || apiKey.isEmpty()) {
            apiKey = System.getenv("OPENAI_API_KEY");
        }

        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException(
                    "OPENAI_API_KEY is not configured. " +
                    "Please set it in .env or environment variables."
            );
        }

        return apiKey;
    }
}