/**
 * Export utilities for markdown editor
 */

export type ExportFormat = "markdown" | "text";

/**
 * Download a file with the given content and filename
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export markdown as .md file
 */
export function exportAsMarkdown(
  text: string,
  filename: string = "document.md",
) {
  downloadFile(text, filename, "text/markdown");
}

/**
 * Strip markdown syntax to get plain text
 */
function stripMarkdown(markdown: string): string {
  let text = markdown;

  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/`[^`]+`/g, "");

  // Remove images
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");

  // Remove links but keep text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove headings
  text = text.replace(/^#{1,6}\s+/gm, "");

  // Remove bold, italic, strikethrough
  text = text.replace(/(\*\*|__)(.*?)\1/g, "$2");
  text = text.replace(/(\*|_)(.*?)\1/g, "$2");
  text = text.replace(/~~(.*?)~~/g, "$1");

  // Remove blockquotes
  text = text.replace(/^>\s+/gm, "");

  // Remove list markers
  text = text.replace(/^[\*\-\+]\s+/gm, "");
  text = text.replace(/^\d+\.\s+/gm, "");
  text = text.replace(/^- \[(x| )\]\s+/gm, "");

  // Remove horizontal rules
  text = text.replace(/^(\*\*\*+|---+|___+)$/gm, "");

  // Remove table formatting
  text = text.replace(/\|/g, " ");

  // Clean up extra whitespace
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.trim();

  return text;
}

/**
 * Export as plain text file (stripped of markdown syntax)
 */
export function exportAsPlainText(
  markdown: string,
  filename: string = "document.txt",
) {
  const plainText = stripMarkdown(markdown);
  downloadFile(plainText, filename, "text/plain");
}

/**
 * Convert markdown to styled HTML
 */
export function exportAsHTML(
  markdown: string,
  filename: string = "document.html",
) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Document</title>
  <style>
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.75;
      color: #374151;
      max-width: 65ch;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #1f2937;
        color: #d1d5db;
      }
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-weight: 700;
      margin-top: 2em;
      margin-bottom: 1em;
      line-height: 1.25;
    }
    
    h1 { font-size: 2.25em; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.3em; }
    h2 { font-size: 1.875em; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; }
    h3 { font-size: 1.5em; }
    h4 { font-size: 1.25em; }
    h5 { font-size: 1.125em; }
    h6 { font-size: 1em; }
    
    p { margin-bottom: 1.25em; }
    
    a {
      color: #3b82f6;
      text-decoration: underline;
    }
    
    a:hover {
      color: #2563eb;
    }
    
    strong { font-weight: 700; }
    em { font-style: italic; }
    
    code {
      background-color: #f3f4f6;
      padding: 0.2em 0.4em;
      border-radius: 0.25rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.875em;
    }
    
    @media (prefers-color-scheme: dark) {
      code {
        background-color: #374151;
      }
    }
    
    pre {
      background-color: #1e293b;
      color: #e2e8f0;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      margin: 1.5em 0;
    }
    
    pre code {
      background-color: transparent;
      padding: 0;
      color: inherit;
      font-size: 0.875em;
    }
    
    blockquote {
      border-left: 4px solid #3b82f6;
      padding-left: 1em;
      font-style: italic;
      margin: 1.5em 0;
      background-color: #eff6ff;
      padding: 1em;
      border-radius: 0.25rem;
    }
    
    @media (prefers-color-scheme: dark) {
      blockquote {
        background-color: #1e3a5f;
        border-left-color: #60a5fa;
      }
    }
    
    ul, ol {
      margin: 1em 0;
      padding-left: 1.5em;
    }
    
    li {
      margin: 0.5em 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5em 0;
    }
    
    th, td {
      border: 1px solid #e5e7eb;
      padding: 0.5em 1em;
      text-align: left;
    }
    
    @media (prefers-color-scheme: dark) {
      th, td {
        border-color: #4b5563;
      }
    }
    
    th {
      background-color: #f9fafb;
      font-weight: 600;
    }
    
    @media (prefers-color-scheme: dark) {
      th {
        background-color: #374151;
      }
    }
    
    hr {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 2em 0;
    }
    
    @media (prefers-color-scheme: dark) {
      hr {
        border-top-color: #4b5563;
      }
    }
    
    img {
      max-width: 100%;
      height: auto;
      border-radius: 0.5rem;
      margin: 1.5em 0;
    }
    
    @media print {
      body {
        max-width: 100%;
        margin: 0;
        padding: 1cm;
      }
      
      @page {
        size: A4;
        margin: 2cm;
      }
    }
  </style>
</head>
<body>
  <div id="markdown-content">${escapeHtml(markdown)}</div>
  
  <script type="module">
    const content = document.getElementById('markdown-content');
    const md = content.textContent;
    
    let html = md
      // Code blocks
      .replace(/\`\`\`(\w*)\n([\s\S]*?)\`\`\`/g, '<pre><code>$2</code></pre>')
      // Inline code
      .replace(/\`([^\`]+)\`/g, '<code>$1</code>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // Headings
      .replace(/^######\s+(.*)$/gm, '<h6>$1</h6>')
      .replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>')
      .replace(/^####\s+(.*)$/gm, '<h4>$1</h4>')
      .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
      .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
      .replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/__([^_]+)__/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      // Strikethrough
      .replace(/~~([^~]+)~~/g, '<del>$1</del>')
      // Blockquotes
      .replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>')
      // Horizontal rules
      .replace(/^(\*\*\*+|---+|___+)$/gm, '<hr />')
      // Unordered lists
      .replace(/^[\*\-\+]\s+(.*)$/gm, '<li>$1</li>')
      // Ordered lists
      .replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>')
      // Paragraphs
      .split('\n\n')
      .map(para => para.trim() ? (para.match(/^<(h[1-6]|blockquote|pre|hr|li|ul|ol)/i) ? para : \`<p>\${para}</p>\`) : '')
      .join('\n');
    
    html = html.replace(/(<li>.*?<\/li>\n?)+/gs, match => {
      return '<ul>' + match + '</ul>';
    });
    
    content.innerHTML = html;
  </script>
</body>
</html>`;

  downloadFile(html, filename, "text/html");
}

/**
 * Export as PDF using browser print dialog
 */
export function exportAsPDF(markdown: string) {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Please allow popups to export as PDF");
    return;
  }

  let html = markdown
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Headings
    .replace(/^######\s+(.*)$/gm, "<h6>$1</h6>")
    .replace(/^#####\s+(.*)$/gm, "<h5>$1</h5>")
    .replace(/^####\s+(.*)$/gm, "<h4>$1</h4>")
    .replace(/^###\s+(.*)$/gm, "<h3>$1</h3>")
    .replace(/^##\s+(.*)$/gm, "<h2>$1</h2>")
    .replace(/^#\s+(.*)$/gm, "<h1>$1</h1>")
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    // Strikethrough
    .replace(/~~([^~]+)~~/g, "<del>$1</del>")
    // Blockquotes
    .replace(/^>\s+(.*)$/gm, "<blockquote>$1</blockquote>")
    // Horizontal rules
    .replace(/^(\*\*\*+|---+|___+)$/gm, "<hr />")
    // Unordered lists
    .replace(/^[*\-+]\s+(.*)$/gm, "<li>$1</li>")
    // Ordered lists
    .replace(/^\d+\.\s+(.*)$/gm, "<li>$1</li>");

  html = html
    .split("\n\n")
    .map((para) => {
      para = para.trim();
      if (!para) return "";
      if (para.match(/^<(h[1-6]|blockquote|pre|hr|li|ul|ol)/i)) {
        return para;
      }
      return `<p>${para}</p>`;
    })
    .join("\n");

  html = html.replace(
    /(<li>.*?<\/li>\n?)+/gs,
    (match) => "<ul>" + match + "</ul>",
  );

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Markdown Document</title>
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    
    @media print {
      body {
        margin: 0;
        padding: 0;
      }
    }
    
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.75;
      color: #000;
      max-width: 100%;
      margin: 0 auto;
      padding: 2cm;
      background: white;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-weight: 700;
      margin-top: 1.5em;
      margin-bottom: 0.75em;
      line-height: 1.25;
      page-break-after: avoid;
      color: #111;
    }
    
    h1 { font-size: 2em; border-bottom: 2px solid #ccc; padding-bottom: 0.3em; margin-top: 0; }
    h2 { font-size: 1.75em; border-bottom: 1px solid #ccc; padding-bottom: 0.3em; }
    h3 { font-size: 1.5em; }
    h4 { font-size: 1.25em; }
    h5 { font-size: 1.125em; }
    h6 { font-size: 1em; }
    
    p { 
      margin-bottom: 1em; 
      page-break-inside: avoid;
      color: #333;
    }
    
    a { 
      color: #0066cc; 
      text-decoration: underline; 
    }
    
    @media print {
      a {
        text-decoration: none;
        color: #000;
      }
      a:after {
        content: " (" attr(href) ")";
        font-size: 0.8em;
        color: #666;
      }
    }
    
    strong { font-weight: 700; }
    em { font-style: italic; }
    del { text-decoration: line-through; }
    
    code {
      background-color: #f5f5f5;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: "Consolas", "Monaco", "Courier New", monospace;
      font-size: 0.9em;
      color: #e01e5a;
    }
    
    @media print {
      code {
        background-color: #f0f0f0;
      }
    }
    
    pre {
      background-color: #f8f8f8;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 1em;
      overflow-x: auto;
      page-break-inside: avoid;
      margin: 1em 0;
    }
    
    pre code {
      background-color: transparent;
      padding: 0;
      font-size: 0.85em;
      color: #000;
    }
    
    blockquote {
      border-left: 4px solid #0066cc;
      padding-left: 1em;
      margin: 1em 0;
      font-style: italic;
      background-color: #f9f9f9;
      padding: 0.75em 1em;
      page-break-inside: avoid;
      color: #555;
    }
    
    @media print {
      blockquote {
        background-color: #fafafa;
      }
    }
    
    ul, ol {
      margin: 1em 0;
      padding-left: 2em;
    }
    
    li { 
      margin: 0.5em 0;
      line-height: 1.5;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
      page-break-inside: avoid;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 0.5em;
      text-align: left;
    }
    
    th {
      background-color: #f0f0f0;
      font-weight: 600;
    }
    
    hr {
      border: none;
      border-top: 2px solid #ccc;
      margin: 2em 0;
    }
    
    img {
      max-width: 100%;
      height: auto;
      page-break-inside: avoid;
      display: block;
      margin: 1em 0;
    }
    
    @media screen {
      body {
        max-width: 21cm;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
    }
  </style>
</head>
<body>
  ${html}
  <script>
    // Automatically trigger print dialog when page loads
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 250);
    };
    
    // Close window after printing or canceling
    window.onafterprint = function() {
      setTimeout(function() {
        window.close();
      }, 100);
    };
  </script>
</body>
</html>`;

  printWindow.document.write(fullHtml);
  printWindow.document.close();
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
