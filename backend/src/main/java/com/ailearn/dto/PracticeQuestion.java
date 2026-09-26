package com.ailearn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Data Transfer Object for Practice Questions
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PracticeQuestion {
    public String getQuestion() {
    return question;
}

public void setQuestion(String question) {
    this.question = question;
}
    
    /**
     * The question text
     */
    private String question;
    
    /**
     * List of 4 answer options
     */
    private List<String> options;
    public List<String> getOptions() {
    return options;
}

public void setOptions(List<String> options) {
    this.options = options;
}
    
    /**
     * The correct answer (must match one of the options)
     */
    private String answer;
    public String getAnswer() {
    return answer;
}

public void setAnswer(String answer) {
    this.answer = answer;
}
    
    /**
     * Explanation of why this is the correct answer
     */
    private String explanation;

    public String getExplanation() {
      return explanation;
    }

    public void setExplanation(String explanation) {
      this.explanation = explanation;
    }
    
    /**
     * Validates that the question has exactly 4 options
     */
    public boolean isValid() {
        return question != null && !question.isEmpty() &&
               options != null && options.size() == 4 &&
               answer != null && !answer.isEmpty() &&
               options.contains(answer);
    }
}