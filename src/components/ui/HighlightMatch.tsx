import React from 'react';

interface HighlightMatchProps {
  text: string;
  query: string;
  className?: string;
  highlightClassName?: string;
}

/**
 * Escapes regex special characters
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Renders text with matched query tokens highlighted using stylized <mark> elements.
 */
export function HighlightMatch({
  text,
  query,
  className = '',
  highlightClassName = 'bg-accent-light text-accent-primary font-bold px-0.5 rounded border border-accent-primary/30',
}: HighlightMatchProps) {
  if (!query || !query.trim() || !text) {
    return <span className={className}>{text}</span>;
  }

  const tokens = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 0)
    .map(escapeRegExp);

  if (tokens.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Regex pattern matching any of the query tokens
  const regex = new RegExp(`(${tokens.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (!part) return null;
        const isMatch = tokens.some((token) => new RegExp(`^${token}$`, 'i').test(part));

        if (isMatch) {
          return (
            <mark key={index} className={highlightClassName}>
              {part}
            </mark>
          );
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
