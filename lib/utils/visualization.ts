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
      content += `\n\n*Sources: ${markers}*`;
    }
    markdown += `${content}\n\n`;

    // Add conflicts if any
    if (section.conflicts && section.conflicts.length > 0) {
      markdown += `> **Conflicts Detected:**\n`;
      for (const conflict of section.conflicts) {
        markdown += `> - **${conflict.topic}**: ${conflict.description}\n`;
        for (const claim of conflict.competingClaims) {
          markdown += `>   - *Claim:* \"${claim.claim}\" (Sources: ${claim.sourceIds.join(", ")})\n`;
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
  markdown += `## References\n\n`;
  for (const ref of report.references) {
    const id = (ref as any).id || "unknown";
    markdown += `- **[${id}]** [${ref.title}](${ref.url})\n`;
  }

  return markdown;
}
