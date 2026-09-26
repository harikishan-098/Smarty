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
    fontFamily: "Inter, Arial, sans-serif"
  }
});

export default function MermaidDiagram({ chart }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!chart || !containerRef.current) return;

    let cancelled = false;

    const renderDiagram = async () => {
      try {
        setError(false);

        let cleanChart = chart
          .replace(/^```mermaid\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        // Convert common AI-generated one-line Mermaid diagrams
        cleanChart = cleanChart
          .replace(/\s+(participant\s+)/g, "\n$1")
          .replace(/\s+(sequenceDiagram)/g, "\n$1")
          .replace(/\s+(flowchart\s+(TD|LR))/g, "\n$1")
          .replace(/\s+(graph\s+(TD|LR))/g, "\n$1")
          .replace(/\s+(subgraph\s+)/g, "\n$1")
          .replace(/\s+(end\b)/g, "\nend")
          .replace(/\s+(C-->|C->>|-->|--x|==>)/g, "\n$1");

        const id = `mermaid-${Date.now()}`;

        const { svg } = await mermaid.render(id, cleanChart);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Mermaid rendering error:", err);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        setError(true);
      }
    };

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="diagram-error">
        Unable to render diagram. The concept is explained in detail below.
      </div>
    );
  }

  return (
    <div className="diagram-container">
      <div ref={containerRef} />
    </div>
  );
} 