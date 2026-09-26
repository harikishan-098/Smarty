import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  securityLevel: "loose",
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: "basis"
  },
  sequence: {
    useMaxWidth: true,
    wrap: true
  },
  themeVariables: {
    primaryColor: "#eef2ff",
    primaryTextColor: "#1e1b4b",
    primaryBorderColor: "#6366f1",
    lineColor: "#6366f1",
    secondaryColor: "#f0fdf4",
    tertiaryColor: "#fff7ed",
    fontFamily: "Arial, sans-serif"
  }
});

function cleanMermaidCode(chart) {
  if (!chart) return "";

  let code = chart
    .replace(/```mermaid/gi, "")
    .replace(/```/g, "")
    .trim();

  // Fix AI-generated one-line diagrams
  code = code.replace(
    /^(graph\s+(TD|LR)|flowchart\s+(TD|LR)|sequenceDiagram)\s+/i,
    (match) => match.trim() + "\n"
  );

  // Put common Mermaid statements on separate lines
  code = code.replace(
    /\]\s+(?=[A-Za-z0-9_]+\[)/g,
    "]\n"
  );

  // Separate sequence-diagram participants
  code = code.replace(
    /\s+(?=participant\s+)/g,
    "\n"
  );

  // Separate sequence-diagram messages
  code = code.replace(
    /\s+(?=[A-Za-z0-9_]+->>)/g,
    "\n"
  );

  // Separate flowchart nodes when AI puts them on one line
  code = code.replace(
    /\s+(?=[A-Za-z0-9_]+\s*-->|[A-Za-z0-9_]+\s*---|[A-Za-z0-9_]+\s*==>)/g,
    "\n"
  );

  return code.trim();
}

function DiagramRenderer({ diagram, diagramType }) {
  const elementRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!diagram || diagramType === "none") return;

    const renderDiagram = async () => {
      try {
        setError(false);

        const cleanedDiagram = cleanMermaidCode(diagram);

        console.log("Original Mermaid:", diagram);
        console.log("Cleaned Mermaid:", cleanedDiagram);

        const id =
          "mermaid-" +
          Date.now() +
          "-" +
          Math.random().toString(36).substring(2, 8);

        const { svg } = await mermaid.render(id, cleanedDiagram);

        if (elementRef.current) {
          elementRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError(true);

        if (elementRef.current) {
          elementRef.current.innerHTML = "";
        }
      }
    };

    renderDiagram();
  }, [diagram, diagramType]);

  if (!diagram || diagramType === "none") {
    return null;
  }

  return (
    <div className="diagram-section">
      <h3>🎨 Visual Diagram</h3>

      <div className="diagram-container">
        {error ? (
          <div className="diagram-error">
            <p>
              Unable to render diagram. The concept is explained in detail
              below.
            </p>
          </div>
        ) : (
          <div ref={elementRef} className="mermaid"></div>
        )}
      </div>
    </div>
  );
}

export default DiagramRenderer; 