import { Report, ReportSection } from "../research/types";

/**
 * Converts a synthesized report object into a formatted Markdown string
 */
export function reportToMarkdown(report: Report): string {
  let markdown = `# ${report.title}\n\n`;

  // Helper to process sections recursively
  const processSection = (section: ReportSection, level: number) => {
    const prefix = "#".repeat(level + 1);
    markdown += `${prefix} ${section.title}\n\n`;
    
    // Add content with citation markers
    let content = section.content;
    if (section.citations.length > 0) {
      const markers = section.citations.map(c => `[${c}]`).join(" ");
      content += `\n\n*출처: ${markers}*`;
    }
    markdown += `${content}\n\n`;

    // Add conflicts if any
    if (section.conflicts && section.conflicts.length > 0) {
      markdown += `> **감지된 정보 충돌:**\n`;
      for (const conflict of section.conflicts) {
        markdown += `> - **${conflict.topic}**: ${conflict.description}\n`;
        for (const claim of conflict.competingClaims) {
          markdown += `>   - *주장:* \"${claim.claim}\" (출처: ${claim.sourceIds.join(", ")})\n`;
        }
      }
      markdown += `\n`;
    }

    for (const sub of section.subsections) {
      processSection(sub, level + 1);
    }
  };

  for (const section of report.sections) {
    processSection(section, 1);
  }

  // Bibliography
  markdown += `## 출처\n\n`;
  for (const ref of report.references) {
    const id = (ref as any).id || "unknown";
    markdown += `- **[${id}]** [${ref.title}](${ref.url})\n`;
  }

  return markdown;
}

/**
 * Sanitizes labels for Mermaid syntax to prevent breaking characters.
 * Escapes characters that have special meaning in Mermaid DSL.
 */
export function sanitizeMermaidLabel(label: string): string {
  // Remove brackets, parentheses, and quotes that often break Mermaid syntax
  return label.replace(/[\[\](){}"']/g, "").trim();
}

/**
 * Returns the standard ProbeAI Mermaid theme configuration.
 * Adheres to Principle III (Adaptive Visualization) for design consistency.
 */
export function getMermaidThemeConfig(): string {
  return `
    %%{init: {
      'theme': 'base',
      'themeVariables': {
        'primaryColor': '#3b82f6',
        'primaryTextColor': '#fff',
        'primaryBorderColor': '#2563eb',
        'lineColor': '#64748b',
        'secondaryColor': '#f1f5f9',
        'tertiaryColor': '#f8fafc'
      }
    }}%%
  `;
}
