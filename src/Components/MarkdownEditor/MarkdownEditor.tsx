import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useCallback,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Eye, Edit, Split, Copy, Download } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Card, CardContent } from "../ui/card";
import MarkdownToolbar from "./MarkdownToolbar";
import { useMarkdownActions } from "./useMarkdownActions";

export interface SyntaxHighlightColors {
  heading?: string;
  headingText?: string;
  bold?: string;
  boldText?: string;
  italic?: string;
  italicText?: string;
  strikethrough?: string;
  strikethroughText?: string;
  inlineCode?: string;
  inlineCodeText?: string;
  inlineCodeBg?: string;
  link?: string;
  linkText?: string;
  linkUrl?: string;
  image?: string;
  imageAlt?: string;
  imagePath?: string;
  listBullet?: string;
  listText?: string;
  orderedList?: string;
  blockquote?: string;
  blockquoteText?: string;
  codeBlock?: string;
  codeBlockText?: string;
  codeBlockBg?: string;
  horizontalRule?: string;
  tablePipe?: string;
  tableCellText?: string;
  tableSeparator?: string;
}

const defaultSyntaxColors: SyntaxHighlightColors = {
  heading: "#569cd6",
  headingText: "#c792ea",
  bold: "#ce9178",
  boldText: "#ffd700",
  italic: "#6a9955",
  italicText: "#b5cea8",
  strikethrough: "#f44747",
  strikethroughText: "#f44747",
  inlineCode: "#f92672",
  inlineCodeText: "#f8f8f2",
  inlineCodeBg: "rgba(255,255,255,0.1)",
  link: "#569cd6",
  linkText: "#4ec9b0",
  linkUrl: "#9cdcfe",
  image: "#d19a66",
  imageAlt: "#98c379",
  imagePath: "#e5c07b",
  listBullet: "#569cd6",
  listText: "#222",
  orderedList: "#c792ea",
  blockquote: "#6a9955",
  blockquoteText: "#6a9955",
  codeBlock: "#c792ea",
  codeBlockText: "#d4d4d4",
  codeBlockBg: "rgba(255,255,255,0.05)",
  horizontalRule: "#4a4a4a",
  tablePipe: "#569cd6",
  tableCellText: "#d4d4d4",
  tableSeparator: "#4a4a4a",
};

const syntaxHighlight = (text: string, colors: SyntaxHighlightColors = {}) => {
  const c = { ...defaultSyntaxColors, ...colors };
  let processed = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  processed = processed
    .replace(
      /^(#{1,6})\s+(.+)$/gm,
      `<span style="color:${c.heading};font-weight:bold">$1</span> <span style="color:${c.headingText};font-weight:600">$2</span>`,
    )
    .replace(
      /\*\*(.*?)\*\*/g,
      `<span style="color:${c.bold}">**</span><span style="color:${c.boldText};font-weight:bold">$1</span><span style="color:${c.bold}">**</span>`,
    )
    .replace(
      /\*(.*?)\*/g,
      `<span style="color:${c.italic}">*</span><span style="color:${c.italicText};font-style:italic">$1</span><span style="color:${c.italic}">*</span>`,
    )
    .replace(
      /~~(.*?)~~/g,
      `<span style="color:${c.strikethrough}">~~</span><span style="color:${c.strikethroughText};text-decoration:line-through">$1</span><span style="color:${c.strikethrough}">~~</span>`,
    )
    .replace(
      /`([^`]+)`/g,
      `<span style="color:${c.inlineCode}">\`</span><span style="color:${c.inlineCodeText};background:${c.inlineCodeBg};padding:0 3px;border-radius:3px;font-family:monospace">$1</span><span style="color:${c.inlineCode}">\`</span>`,
    )
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      `<span style="color:${c.image}">!</span><span style="color:${c.image}">[</span><span style="color:${c.imageAlt}">$1</span><span style="color:${c.image}">](</span><span style="color:${c.imagePath}">$2</span><span style="color:${c.image}">)</span>`,
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      `<span style="color:${c.link}">[</span><span style="color:${c.linkText};text-decoration:underline">$1</span><span style="color:${c.link}">](</span><span style="color:${c.linkUrl}">$2</span><span style="color:${c.link}">)</span>`,
    )
    .replace(
      /^(\s*)([-*+])\s+(.+)$/gm,
      `$1<span style="color:${c.listBullet};font-weight:bold">$2</span> <span style="color:${c.listText}">$3</span>`,
    )
    .replace(
      /^(\s*)(\d+\.)\s+(.+)$/gm,
      `$1<span style="color:${c.orderedList};font-weight:bold">$2</span> <span style="color:${c.listText}">$3</span>`,
    )
    .replace(
      /^&gt;\s+(.+)$/gm,
      `<span style="color:${c.blockquote};font-weight:bold">&gt;</span> <span style="color:${c.blockquoteText};font-style:italic">$1</span>`,
    )
    .replace(
      /```(\w+)?\n([\s\S]*?)\n```/g,
      `<span style="color:${c.codeBlock}">\`\`\`$1</span>\n<span style="color:${c.codeBlockText};background:${c.codeBlockBg};display:block;padding:6px 8px;border-radius:4px;font-family:monospace;font-size:0.875em">$2</span>\n<span style="color:${c.codeBlock}">\`\`\`</span>`,
    )
    .replace(
      /^---+$/gm,
      `<span style="color:${c.horizontalRule};font-weight:bold">$&</span>`,
    )
    .replace(
      /^(\|[\s-:]+)+\|$/gm,
      (match) => `<span style="color:${c.tableSeparator}">${match}</span>`,
    )
    .replace(/^(\|.+)+\|$/gm, (match) =>
      match.replace(
        /(\|)([^|]*)/g,
        `<span style="color:${c.tablePipe}">$1</span><span style="color:${c.tableCellText}">$2</span>`,
      ),
    );

  return DOMPurify.sanitize(processed);
};

const defaultMarkdownComponents: Components = {
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
    <p className="mb-4 text-foreground leading-relaxed">{children}</p>
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
    <strong className="font-bold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-foreground">{children}</em>,
};

export interface MarkdownEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  viewMode?: "edit" | "preview" | "split";
  defaultViewMode?: "edit" | "preview" | "split";
  onViewModeChange?: (mode: "edit" | "preview" | "split") => void;
  className?: string;
  editorClassName?: string;
  previewClassName?: string;
  showToolbar?: boolean;
  showWordCount?: boolean;
  showMarkdownToolbar?: boolean;
  enableDownload?: boolean;
  enableCopy?: boolean;
  enableScrollSync?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  maxLength?: number;
  components?: Components;
  syntaxColors?: SyntaxHighlightColors;
}

export interface MarkdownEditorRef {
  focus: () => void;
  getValue: () => string;
}

const MarkdownEditor = forwardRef<MarkdownEditorRef, MarkdownEditorProps>(
  (
    {
      value,
      defaultValue = `# Markdown Editor\n\nWelcome to the **Markdown Editor**!`,
      onChange,
      viewMode: controlledViewMode,
      defaultViewMode = "split",
      onViewModeChange,
      className,
      editorClassName,
      previewClassName,
      showToolbar = true,
      showWordCount = true,
      showMarkdownToolbar = true,
      enableDownload = true,
      enableCopy = true,
      enableScrollSync = true,
      placeholder = "Start typing your markdown here...",
      readOnly = false,
      maxLength,
      components,
      syntaxColors,
    },
    ref,
  ) => {
    const [internalMarkdown, setInternalMarkdown] = useState(defaultValue);
    const [internalViewMode, setInternalViewMode] = useState<
      "edit" | "preview" | "split"
    >(defaultViewMode);

    const isControlled = value !== undefined;
    const markdown = isControlled ? value : internalMarkdown;

    const isViewModeControlled = controlledViewMode !== undefined;
    const viewMode = isViewModeControlled
      ? controlledViewMode
      : internalViewMode;

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const highlightRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const isScrollSyncing = useRef(false);

    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus();
      },
      getValue: () => markdown,
    }));

    const updateMarkdown = useCallback(
      (newValue: string) => {
        if (!isControlled) {
          setInternalMarkdown(newValue);
        }
        onChange?.(newValue);
      },
      [isControlled, onChange],
    );

    const handleTextChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateMarkdown(e.target.value);
      },
      [updateMarkdown],
    );

    const markdownActions = useMarkdownActions(textareaRef, updateMarkdown);

    const handleViewModeChange = useCallback(
      (mode: "edit" | "preview" | "split") => {
        if (!isViewModeControlled) {
          setInternalViewMode(mode);
        }
        onViewModeChange?.(mode);
      },
      [isViewModeControlled, onViewModeChange],
    );

    const handleEditorScroll = useCallback(
      (e: React.UIEvent<HTMLTextAreaElement>) => {
        const source = e.currentTarget;

        if (highlightRef.current) {
          highlightRef.current.scrollTop = source.scrollTop;
          highlightRef.current.scrollLeft = source.scrollLeft;
        }

        if (!enableScrollSync || isScrollSyncing.current) return;
        isScrollSyncing.current = true;

        const target = previewRef.current;
        if (target) {
          const scrollableHeight = source.scrollHeight - source.clientHeight;
          const scrollPercent =
            scrollableHeight > 0 ? source.scrollTop / scrollableHeight : 0;
          target.scrollTop =
            scrollPercent * (target.scrollHeight - target.clientHeight);
        }

        requestAnimationFrame(() => {
          isScrollSyncing.current = false;
        });
      },
      [enableScrollSync],
    );

    const handlePreviewScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        if (!enableScrollSync || isScrollSyncing.current) return;
        isScrollSyncing.current = true;

        const source = e.currentTarget;
        const target = textareaRef.current;

        if (target) {
          const scrollableHeight = source.scrollHeight - source.clientHeight;
          const scrollPercent =
            scrollableHeight > 0 ? source.scrollTop / scrollableHeight : 0;
          target.scrollTop =
            scrollPercent * (target.scrollHeight - target.clientHeight);

          if (highlightRef.current) {
            highlightRef.current.scrollTop = target.scrollTop;
          }
        }

        requestAnimationFrame(() => {
          isScrollSyncing.current = false;
        });
      },
      [enableScrollSync],
    );

    const copyToClipboard = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(markdown);
        console.log("Copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }, [markdown]);

    const downloadMarkdown = useCallback(() => {
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, [markdown]);

    const memoizedComponents = useMemo(
      () => ({
        ...defaultMarkdownComponents,
        ...components,
      }),
      [components],
    );

    return (
      <Card
        className={`w-full h-screen max-h-screen flex flex-col gap-0 py-0 ${className || ""}`}
      >
        {showToolbar ? (
          <div className="flex items-center justify-between p-4 border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Markdown Editor</h2>
              {showWordCount ? (
                <Badge variant="secondary" className="text-xs">
                  {markdown.length} characters
                </Badge>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={viewMode === "edit" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleViewModeChange("edit")}
                  className="h-8 px-3"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant={viewMode === "split" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleViewModeChange("split")}
                  className="h-8 px-3"
                >
                  <Split className="w-4 h-4 mr-1" />
                  Split
                </Button>
                <Button
                  variant={viewMode === "preview" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleViewModeChange("preview")}
                  className="h-8 px-3"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {enableCopy ? (
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              ) : null}

              {enableDownload ? (
                <Button variant="outline" size="sm" onClick={downloadMarkdown}>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}

        <CardContent className="flex-1 p-0 min-h-0 overflow-hidden">
          <div className="flex h-full min-h-0">
            {viewMode === "edit" || viewMode === "split" ? (
              <div
                className={`${
                  viewMode === "split" ? "w-1/2" : "w-full"
                } border-r h-full min-h-0 flex flex-col ${editorClassName || ""}`}
              >
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Syntax-Highlighted Editor
                  </h3>
                </div>
                {showMarkdownToolbar && !readOnly && (
                  <MarkdownToolbar actions={markdownActions} />
                )}
                <div className="relative flex-1 w-full bg-transparent overflow-hidden">
                  <div
                    ref={highlightRef}
                    className="absolute inset-0 p-4 font-mono text-sm leading-relaxed pointer-events-none overflow-auto whitespace-pre-wrap wrap-break-word"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: syntaxHighlight(markdown, syntaxColors),
                    }}
                  />
                  <textarea
                    ref={textareaRef}
                    value={markdown}
                    onChange={handleTextChange}
                    onScroll={handleEditorScroll}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    maxLength={maxLength}
                    spellCheck={false}
                    className="absolute inset-0 w-full h-full p-4 border-none outline-none resize-none bg-transparent font-mono text-sm leading-relaxed z-10 wrap-break-word"
                    style={{
                      color: "transparent",
                      caretColor: "var(--foreground, #d4d4d4)",
                    }}
                  />
                </div>
              </div>
            ) : null}

            {viewMode === "preview" || viewMode === "split" ? (
              <div
                className={`${viewMode === "split" ? "w-1/2" : "w-full"} h-full min-h-0 flex flex-col ${previewClassName || ""}`}
              >
                <div className="p-4 border-b bg-muted/30">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Preview
                  </h3>
                </div>
                <div
                  ref={previewRef}
                  onScroll={handlePreviewScroll}
                  className="p-4 flex-1 overflow-auto min-h-0"
                >
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <ReactMarkdown
                      components={memoizedComponents}
                      remarkPlugins={[remarkGfm]}
                    >
                      {markdown}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    );
  },
);

MarkdownEditor.displayName = "MarkdownEditor";

export default MarkdownEditor;
