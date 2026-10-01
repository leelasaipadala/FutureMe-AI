import React from "react";

// Renders a subset of markdown: bold, bullets, line breaks
export function MarkdownMessage({ text, isDark }: { text: string; isDark?: boolean }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;

        // Bullet line
        const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-") || line.trim().startsWith("*");

        const cleanLine = isBullet ? line.trim().replace(/^[•\-\*]\s*/, "") : line;

        const rendered = renderInline(cleanLine, isDark);

        if (isBullet) {
          return (
            <div key={i} className="flex items-start gap-2 pl-1">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? "bg-primary-foreground/70" : "bg-primary"}`} />
              <span>{rendered}</span>
            </div>
          );
        }

        return <p key={i}>{rendered}</p>;
      })}
    </div>
  );
}

// Render bold (**text**) inline
function renderInline(text: string, isDark?: boolean): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className={isDark ? "font-bold text-primary-foreground" : "font-semibold text-foreground"}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}
