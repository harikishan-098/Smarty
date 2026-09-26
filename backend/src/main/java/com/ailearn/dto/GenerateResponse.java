package com.ailearn.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for generated educational content
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenerateResponse {
    
    /**
     * Title of the educational topic
     */
    private String title;
    public String getTitle() {
    return title;
}

public void setTitle(String title) {
    this.title = title;
}
    
    /**
     * Brief summary of the topic
     */
    private String summary;
    public String getSummary() {
    return summary;
}

public void setSummary(String summary) {
    this.summary = summary;
}
    
    /**
     * Detailed explanation as list of key points
     */
    private List<String> explanation;
    public List<String> getExplanation() {
    return explanation;
}

public void setExplanation(List<String> explanation) {
    this.explanation = explanation;
}
    
    /**
     * Type of diagram: flowchart, hierarchy, sequence, or none
     */
    @JsonProperty("diagram_type")
    private String diagramType;
    public String getDiagramType() {
    return diagramType;
}

public void setDiagramType(String diagramType) {
    this.diagramType = diagramType;
}
    
    /**
     * Mermaid.js diagram syntax
     */
    private String diagram;
    public String getDiagram() {
    return diagram;
}

public void setDiagram(String diagram) {
    this.diagram = diagram;
}
    
    /**
     * Exactly 10 practice questions
     */
    @JsonProperty("practice_questions")
    private List<PracticeQuestion> practiceQuestions;
    public List<PracticeQuestion> getPracticeQuestions() {
    return practiceQuestions;
}

public void setPracticeQuestions(List<PracticeQuestion> practiceQuestions) {
    this.practiceQuestions = practiceQuestions;
}
}