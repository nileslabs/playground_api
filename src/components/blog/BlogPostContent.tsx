'use client';

import React from 'react';
import Link from 'next/link';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Icon } from '@iconify/react';

interface BlogPostContentProps {
  content: string;
}

/**
 * Parses markdown inline formatting: bold, italic, inline code, links.
 */
function renderInlineText(text: string): React.ReactNode[] {
  // Regex to split by inline patterns: `code`, **bold**, *italic*, [link](url)
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;

    // Inline code
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 text-xs sm:text-sm font-mono font-medium rounded-md bg-accent-light text-accent-primary border border-accent-primary/20"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-text-primary">
          {renderInlineText(part.slice(2, -2))}
        </strong>
      );
    }

    // Italic
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="italic text-text-secondary">
          {renderInlineText(part.slice(1, -1))}
        </em>
      );
    }

    // Markdown Link [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const href = linkMatch[2];
      const linkText = linkMatch[1];
      const isExternal = href.startsWith('http');

      return isExternal ? (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent-primary underline underline-offset-4 hover:text-accent-secondary transition-colors"
        >
          {linkText}
          <Icon icon="ph:arrow-up-right-bold" className="inline w-3 h-3 ml-0.5" />
        </a>
      ) : (
        <Link
          key={index}
          href={href}
          className="font-medium text-accent-primary underline underline-offset-4 hover:text-accent-secondary transition-colors"
        >
          {linkText}
        </Link>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

/**
 * Parses markdown table block into HTML table JSX.
 */
function renderTable(tableLines: string[], keyIndex: number): React.ReactNode {
  if (tableLines.length < 2) return null;

  const parseRow = (line: string) =>
    line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim());

  const headers = parseRow(tableLines[0]);
  const rows = tableLines.slice(2).map(parseRow);

  return (
    <div key={keyIndex} className="my-6 w-full overflow-x-auto rounded-xl border border-border-theme bg-bg-secondary/40 shadow-xs">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-bg-tertiary/70 border-b border-border-theme text-text-primary font-semibold">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-3 font-bold text-text-primary">
                {renderInlineText(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-theme/40 text-text-secondary">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-bg-tertiary/30 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-4 py-3">
                  {renderInlineText(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  // Strip top SEO meta paragraphs (like Suggested URL Slug, Dev.to Tags) if present
  let cleanContent = content;

  // Split lines into structured blocks
  const lines = cleanContent.split('\n');
  const elements: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      index++;
      continue;
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      elements.push(<hr key={index} className="my-8 border-t border-border-theme" />);
      index++;
      continue;
    }

    // Code Block ```lang ... ```
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim() || 'javascript';
      const codeLines: string[] = [];
      index++;

      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index]);
        index++;
      }
      index++; // skip closing ```

      const codeString = codeLines.join('\n');
      elements.push(
        <div key={index} className="my-6">
          <CodeBlock
            code={codeString}
            language={lang}
            title={lang === 'bash' || lang === 'sh' ? 'Terminal' : undefined}
            copyable={true}
            showLineNumbers={codeLines.length > 3}
          />
        </div>
      );
      continue;
    }

    // Table
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith('|') && lines[index].trim().endsWith('|')) {
        tableLines.push(lines[index]);
        index++;
      }
      elements.push(renderTable(tableLines, index));
      continue;
    }

    // Headings
    if (trimmed.startsWith('#')) {
      const hashMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (hashMatch) {
        const level = hashMatch[1].length;
        const headingText = hashMatch[2];
        const headingId = headingText
          .toLowerCase()
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/`([^`]+)`/g, '$1')
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');

        if (level === 1) {
          // Top title is rendered in page header, but render if repeated
          elements.push(
            <h1 key={index} id={headingId} className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-8 mb-4 tracking-tight scroll-mt-24">
              {renderInlineText(headingText)}
            </h1>
          );
        } else if (level === 2) {
          elements.push(
            <h2
              key={index}
              id={headingId}
              className="text-xl sm:text-2xl font-bold text-text-primary mt-10 mb-4 pb-2 border-b border-border-theme/60 tracking-tight scroll-mt-24 flex items-center gap-2 group"
            >
              <a href={`#${headingId}`} className="hover:text-accent-primary transition-colors flex items-center gap-2">
                {renderInlineText(headingText)}
              </a>
            </h2>
          );
        } else if (level === 3) {
          elements.push(
            <h3 key={index} id={headingId} className="text-lg sm:text-xl font-bold text-text-primary mt-6 mb-3 tracking-tight scroll-mt-24">
              {renderInlineText(headingText)}
            </h3>
          );
        } else {
          elements.push(
            <h4 key={index} id={headingId} className="text-base font-bold text-text-primary mt-4 mb-2 scroll-mt-24">
              {renderInlineText(headingText)}
            </h4>
          );
        }
        index++;
        continue;
      }
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith('>')) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ''));
        index++;
      }
      elements.push(
        <blockquote
          key={index}
          className="my-6 p-4 rounded-xl border-l-4 border-accent-primary bg-accent-light/40 text-text-secondary text-sm sm:text-base leading-relaxed"
        >
          {quoteLines.map((ql, qIdx) => (
            <p key={qIdx} className={qIdx > 0 ? 'mt-2' : ''}>
              {renderInlineText(ql)}
            </p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Unordered List
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const listItems: string[] = [];
      while (index < lines.length && (lines[index].trim().startsWith('- ') || lines[index].trim().startsWith('* '))) {
        listItems.push(lines[index].trim().replace(/^[-*]\s+/, ''));
        index++;
      }
      elements.push(
        <ul key={index} className="my-4 space-y-2 list-disc list-outside pl-6 text-sm sm:text-base text-text-secondary leading-relaxed">
          {listItems.map((li, lIdx) => (
            <li key={lIdx}>{renderInlineText(li)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered List
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        listItems.push(lines[index].trim().replace(/^\d+\.\s+/, ''));
        index++;
      }
      elements.push(
        <ol key={index} className="my-4 space-y-2 list-decimal list-outside pl-6 text-sm sm:text-base text-text-secondary leading-relaxed">
          {listItems.map((li, lIdx) => (
            <li key={lIdx}>{renderInlineText(li)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Regular Paragraph
    elements.push(
      <p key={index} className="my-4 text-sm sm:text-base text-text-secondary leading-relaxed">
        {renderInlineText(trimmed)}
      </p>
    );
    index++;
  }

  return <div className="blog-content w-full max-w-none">{elements}</div>;
}
