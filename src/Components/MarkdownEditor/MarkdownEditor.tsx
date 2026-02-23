import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Eye, Edit, Split, Copy, Download } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Card, CardContent } from "../ui/card";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(`# Markdown Editor

Welcome to the **Markdown Editor**! This editor supports all standard markdown syntax.

## Features

- **Live Preview**: See your markdown rendered in real-time
- **Split View**: Edit and preview side by side
- **Full Syntax Support**: All markdown features work perfectly

### Text Formatting

You can make text *italic*, **bold**, or ***both***. You can also use ~~strikethrough~~.

### Lists

#### Unordered Lists
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

#### Ordered Lists
1. First ordered item
2. Second ordered item
   1. Nested ordered item
   2. Another nested item
3. Third ordered item

### Code

Inline \`code\` looks like this.

\`\`\`javascript
// Code blocks are supported too
function hello(name) {
  console.log(\`Hello, \${name}!\`);
}

hello('World');
\`\`\`

### Quotes

> This is a blockquote
>
> It can span multiple lines

### Links and Images

[Visit React](https://reactjs.org)

![React Logo](https://reactjs.org/logo-og.png)

---

### Horizontal Rules

Use three dashes (---) to create horizontal rules like the one above.

Happy writing! 🚀`);

  const [viewMode, setViewMode] = useState("split"); // 'edit', 'preview', 'split'
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  // Syntax highlighting patterns
  const syntaxHighlight = (text: string) => {
    return (
      text
        // Headers
        .replace(
          /^(#{1,6})\s+(.+)$/gm,
          '<span class="text-blue-600 font-bold">$1</span> <span class="text-purple-700 font-semibold">$2</span>',
        )
        // Bold text
        .replace(
          /\*\*(.*?)\*\*/g,
          '<span class="text-orange-600 font-bold">**</span><span class="text-orange-700 font-bold">$1</span><span class="text-orange-600 font-bold">**</span>',
        )
        // Italic text
        .replace(
          /\*(.*?)\*/g,
          '<span class="text-green-600">*</span><span class="text-green-700 italic">$1</span><span class="text-green-600">*</span>',
        )
        // Strikethrough
        .replace(
          /~~(.*?)~~/g,
          '<span class="text-red-600">~~</span><span class="text-red-700 line-through">$1</span><span class="text-red-600">~~</span>',
        )
        // Inline code
        .replace(
          /`([^`]+)`/g,
          '<span class="text-pink-600 bg-pink-50 px-1 rounded">`</span><span class="text-pink-800 bg-pink-100 px-1 font-mono">$1</span><span class="text-pink-600 bg-pink-50 px-1 rounded">`</span>',
        )
        // Links
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<span class="text-blue-600">[</span><span class="text-blue-800 underline">$1</span><span class="text-blue-600">](</span><span class="text-cyan-600">$2</span><span class="text-blue-600">)</span>',
        )
        // List items
        .replace(
          /^(\s*)([-*+])\s+(.+)$/gm,
          '$1<span class="text-indigo-600 font-bold">$2</span> <span class="text-gray-800">$3</span>',
        )
        // Ordered lists
        .replace(
          /^(\s*)(\d+\.)\s+(.+)$/gm,
          '$1<span class="text-purple-600 font-bold">$2</span> <span class="text-gray-800">$3</span>',
        )
        // Blockquotes
        .replace(
          /^>\s+(.+)$/gm,
          '<span class="text-emerald-600 font-bold">&gt;</span> <span class="text-emerald-700 italic">$1</span>',
        )
        // Code blocks
        .replace(
          /```(\w+)?\n([\s\S]*?)\n```/g,
          '<span class="text-violet-600 bg-violet-50 px-2 py-1 rounded">```$1</span>\n<span class="text-gray-800 bg-gray-100 block p-2 rounded font-mono text-sm">$2</span>\n<span class="text-violet-600 bg-violet-50 px-2 py-1 rounded">```</span>',
        )
        // Horizontal rules
        .replace(/^---+$/gm, '<span class="text-gray-400 font-bold">$&</span>')
        // Escape HTML
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
    );
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      console.log("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderToolbar = () => (
    <div className="flex items-center justify-between p-4 border-b bg-muted/50">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Markdown Editor</h2>
        <Badge variant="secondary" className="text-xs">
          {markdown.length} characters
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center border rounded-lg p-1">
          <Button
            variant={viewMode === "edit" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("edit")}
            className="h-8 px-3"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant={viewMode === "split" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("split")}
            className="h-8 px-3"
          >
            <Split className="w-4 h-4 mr-1" />
            Split
          </Button>
          <Button
            variant={viewMode === "preview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("preview")}
            className="h-8 px-3"
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="outline" size="sm" onClick={copyToClipboard}>
          <Copy className="w-4 h-4 mr-1" />
          Copy
        </Button>

        <Button variant="outline" size="sm" onClick={downloadMarkdown}>
          <Download className="w-4 h-4 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );

  const renderEditor = () => (
    <div className="h-full">
      <div className="p-4 border-b bg-muted/30">
        <h3 className="font-medium text-sm text-muted-foreground">
          Syntax-Highlighted Editor
        </h3>
      </div>
      <div
        ref={highlightRef}
        className="absolute inset-0 p-4 font-mono text-sm leading-relaxed pointer-events-none overflow-auto whitespace-pre-wrap wrap-break-word"
        style={{
          minHeight: "calc(100% - 60px)",
          color: "transparent",
          zIndex: 1,
        }}
        dangerouslySetInnerHTML={{
          __html: syntaxHighlight(markdown),
        }}
      />
      <textarea
        ref={textareaRef}
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Start typing your markdown here..."
        className="w-full h-full p-4 border-none outline-none resize-none bg-background font-mono text-sm leading-relaxed"
        style={{ minHeight: "calc(100% - 60px)" }}
      />
    </div>
  );

  const renderPreview = () => (
    <div className="h-full">
      <div className="p-4 border-b bg-muted/30">
        <h3 className="font-medium text-sm text-muted-foreground">Preview</h3>
      </div>
      <div
        className="p-4 h-full overflow-auto"
        style={{ minHeight: "calc(100% - 60px)" }}
      >
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mb-4 mt-6 first:mt-0 text-foreground border-b pb-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold mb-3 mt-5 text-foreground border-b pb-1">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold mb-2 mt-4 text-foreground">
                  {children}
                </h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg font-medium mb-2 mt-3 text-foreground">
                  {children}
                </h4>
              ),
              h5: ({ children }) => (
                <h5 className="text-base font-medium mb-2 mt-3 text-foreground">
                  {children}
                </h5>
              ),
              h6: ({ children }) => (
                <h6 className="text-sm font-medium mb-2 mt-3 text-muted-foreground">
                  {children}
                </h6>
              ),
              p: ({ children }) => (
                <p className="mb-4 text-foreground leading-relaxed">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 space-y-1 text-foreground">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 space-y-1 text-foreground">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-foreground leading-relaxed">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-muted-foreground/30 pl-4 py-2 mb-4 italic text-muted-foreground bg-muted/50 rounded-r">
                  {children}
                </blockquote>
              ),
              code: ({ children, className }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground">
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="block bg-muted p-4 rounded-lg text-sm font-mono text-foreground overflow-x-auto">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="bg-muted p-4 rounded-lg mb-4 overflow-x-auto">
                  {children}
                </pre>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border-collapse border border-border">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-border bg-muted px-4 py-2 text-left font-semibold text-foreground">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-border px-4 py-2 text-foreground">
                  {children}
                </td>
              ),
              hr: () => <hr className="my-6 border-t border-border" />,
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-primary hover:text-primary/80 underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-foreground">
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em className="italic text-foreground">{children}</em>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full h-screen max-h-screen flex flex-col">
      {renderToolbar()}

      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="flex h-full">
          {(viewMode === "edit" || viewMode === "split") && (
            <div
              className={`${
                viewMode === "split" ? "w-1/2" : "w-full"
              } border-r`}
            >
              {renderEditor()}
            </div>
          )}

          {(viewMode === "preview" || viewMode === "split") && (
            <div className={viewMode === "split" ? "w-1/2" : "w-full"}>
              {renderPreview()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarkdownEditor;
