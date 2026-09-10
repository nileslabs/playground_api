import fs from 'fs';
import path from 'path';

export interface BlogPostMeta {
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  authorRole?: string;
  tags: string[];
  series?: string;
  order: number;
  coverImage: string;
  readingTime: string;
  canonicalUrl?: string;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
  headings: TableOfContentsItem[];
}

const BLOG_CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

/**
 * Calculates estimated reading time for given markdown content.
 */
export function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const cleanText = text.replace(/```[\s\S]*?```/g, '').replace(/<[^>]*>/g, '');
  const wordCount = cleanText.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Safely parses YAML-style frontmatter from a markdown string.
 */
function parseFrontmatter(rawContent: string): { data: Record<string, string>; content: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content: rawContent };
  }

  const yamlBlock = match[1];
  const markdownBody = match[2];
  const data: Record<string, string> = {};

  yamlBlock.split(/\r?\n/).forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let val = line.slice(colonIndex + 1).trim();
      // Remove enclosing quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      data[key] = val;
    }
  });

  return { data, content: markdownBody };
}

/**
 * Extracts H2 and H3 headings from markdown content for the Table of Contents.
 */
export function extractHeadings(markdown: string): TableOfContentsItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    let text = match[2].trim();
    // Strip markdown links and inline formatting
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    text = text.replace(/`([^`]+)`/g, '$1');
    text = text.replace(/[*_~]/g, '');

    // Generate anchor ID
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    if (id && text) {
      headings.push({ id, text, level });
    }
  }

  return headings;
}

/**
 * Retrieves all blog posts sorted by order (or date).
 */
export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_CONTENT_DIR)) {
    return [];
  }

  const fileNames = fs.readdirSync(BLOG_CONTENT_DIR).filter((f) => f.endsWith('.md'));

  const posts: BlogPostMeta[] = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(BLOG_CONTENT_DIR, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = parseFrontmatter(fileContents);

    const tags = data.tags
      ? data.tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean)
      : [];

    return {
      title: data.title || slug,
      slug: data.slug || slug,
      description: data.description || '',
      date: data.date || '2026-03-01',
      author: data.author || 'Nilesh Kumar',
      authorRole: data.authorRole || 'Creator of Playground API',
      tags,
      series: data.series || 'Stop Waiting for the Backend',
      order: parseInt(data.order || '1', 10),
      coverImage: data.coverImage || `/images/blog/${slug}.jpg`,
      readingTime: calculateReadingTime(content),
      canonicalUrl: data.canonical_url,
    };
  });

  return posts.sort((a, b) => a.order - b.order);
}

/**
 * Retrieves a single blog post by slug with full body and TOC.
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(BLOG_CONTENT_DIR, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = parseFrontmatter(fileContents);

  const tags = data.tags
    ? data.tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean)
    : [];

  const headings = extractHeadings(content);

  return {
    title: data.title || slug,
    slug: data.slug || slug,
    description: data.description || '',
    date: data.date || '2026-03-01',
    author: data.author || 'Nilesh Kumar',
    authorRole: data.authorRole || 'Creator of Playground API',
    tags,
    series: data.series || 'Stop Waiting for the Backend',
    order: parseInt(data.order || '1', 10),
    coverImage: data.coverImage || `/images/blog/${slug}.jpg`,
    readingTime: calculateReadingTime(content),
    canonicalUrl: data.canonical_url,
    content,
    headings,
  };
}

/**
 * Gets the previous and next posts relative to the current post's order.
 */
export function getAdjacentPosts(slug: string): { prev: BlogPostMeta | null; next: BlogPostMeta | null } {
  const posts = getAllPosts();
  const currentIndex = posts.findIndex((p) => p.slug === slug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return { prev, next };
}

/**
 * Returns all unique tags across all posts with occurrence counts.
 */
export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagCounts: Record<string, number> = {};

  posts.forEach((p) => {
    p.tags.forEach((t) => {
      const lower = t.toLowerCase();
      tagCounts[lower] = (tagCounts[lower] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
