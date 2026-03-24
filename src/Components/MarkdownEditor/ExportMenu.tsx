import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Download,
  Check,
  ChevronDown,
  FileText,
  FileType,
} from "lucide-react";
import {
  exportAsMarkdown,
  exportAsPlainText,
  type ExportFormat,
} from "../../lib/exportUtils";

interface ExportMenuProps {
  markdown: string;
  enabledFormats?: ExportFormat[] | boolean;
  className?: string;
}

const formatConfig: Record<
  ExportFormat,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    extension: string;
  }
> = {
  markdown: {
    label: "Markdown",
    icon: FileText,
    extension: ".md",
  },
  text: {
    label: "Plain Text",
    icon: FileType,
    extension: ".txt",
  },
};

const ExportMenu: React.FC<ExportMenuProps> = ({
  markdown,
  enabledFormats = true,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExported, setIsExported] = useState(false);
  const [exportedFormat, setExportedFormat] = useState<ExportFormat | null>(
    null,
  );

  const formats: ExportFormat[] =
    enabledFormats === true
      ? ["markdown", "text"]
      : enabledFormats === false
        ? []
        : enabledFormats;

  if (formats.length === 0) {
    return null;
  }

  const handleExport = (format: ExportFormat) => {
    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `document-${timestamp}`;

    switch (format) {
      case "markdown":
        exportAsMarkdown(markdown, `${filename}.md`);
        break;
      case "text":
        exportAsPlainText(markdown, `${filename}.txt`);
        break;
    }

    setIsExported(true);
    setExportedFormat(format);
    setIsOpen(false);

    setTimeout(() => {
      setIsExported(false);
      setExportedFormat(null);
    }, 2000);
  };

  if (formats.length === 1) {
    const format = formats[0];
    const config = formatConfig[format];
    const Icon = config.icon;

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport(format)}
        className={
          isExported
            ? `text-green-600 dark:text-green-500 border-green-600 dark:border-green-500 ${className}`
            : className
        }
      >
        {isExported ? (
          <>
            <Check className="w-4 h-4 mr-1" />
            Exported!
          </>
        ) : (
          <>
            <Icon className="w-4 h-4 mr-1" />
            Export
          </>
        )}
      </Button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={
          isExported
            ? "text-green-600 dark:text-green-500 border-green-600 dark:border-green-500"
            : ""
        }
      >
        {isExported && exportedFormat ? (
          <>
            <Check className="w-4 h-4 mr-1" />
            Exported as {formatConfig[exportedFormat].label}!
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-1" />
            Export
            <ChevronDown className="w-3 h-3 ml-1" />
          </>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-full mt-1 z-50 min-w-[180px] bg-popover text-popover-foreground rounded-md border shadow-lg p-1 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b mb-1">
              Export as
            </div>
            {formats.map((format) => {
              const config = formatConfig[format];
              const Icon = config.icon;

              return (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{config.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {config.extension}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ExportMenu;
