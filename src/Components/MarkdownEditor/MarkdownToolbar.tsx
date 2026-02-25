import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  FileCode,
  Minus,
  Link,
  Image,
  Table,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface ToolbarAction {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  action: () => void;
}

interface MarkdownToolbarProps {
  actions: {
    insertBold: () => void;
    insertItalic: () => void;
    insertStrikethrough: () => void;
    insertInlineCode: () => void;
    insertHeading: (level: 1 | 2 | 3) => void;
    insertBlockquote: () => void;
    insertUnorderedList: () => void;
    insertOrderedList: () => void;
    insertCodeBlock: () => void;
    insertLink: () => void;
    insertImage: () => void;
    insertHorizontalRule: () => void;
    insertTable: () => void;
  };
}

function MarkdownToolbar({ actions }: MarkdownToolbarProps) {
  const textFormatting: ToolbarAction[] = [
    { icon: Bold, title: "Bold (Ctrl+B)", action: actions.insertBold },
    { icon: Italic, title: "Italic (Ctrl+I)", action: actions.insertItalic },
    {
      icon: Strikethrough,
      title: "Strikethrough",
      action: actions.insertStrikethrough,
    },
  ];

  const headings: ToolbarAction[] = [
    {
      icon: Heading1,
      title: "Heading 1",
      action: () => actions.insertHeading(1),
    },
    {
      icon: Heading2,
      title: "Heading 2",
      action: () => actions.insertHeading(2),
    },
    {
      icon: Heading3,
      title: "Heading 3",
      action: () => actions.insertHeading(3),
    },
  ];

  const lists: ToolbarAction[] = [
    {
      icon: List,
      title: "Unordered List",
      action: actions.insertUnorderedList,
    },
    {
      icon: ListOrdered,
      title: "Ordered List",
      action: actions.insertOrderedList,
    },
  ];

  const blocks: ToolbarAction[] = [
    { icon: Quote, title: "Blockquote", action: actions.insertBlockquote },
    { icon: Code, title: "Inline Code", action: actions.insertInlineCode },
    { icon: FileCode, title: "Code Block", action: actions.insertCodeBlock },
    {
      icon: Minus,
      title: "Horizontal Rule",
      action: actions.insertHorizontalRule,
    },
  ];

  const media: ToolbarAction[] = [
    { icon: Link, title: "Link", action: actions.insertLink },
    { icon: Image, title: "Image", action: actions.insertImage },
    { icon: Table, title: "Table", action: actions.insertTable },
  ];

  const groups = [textFormatting, headings, lists, blocks, media];

  return (
    <div className="flex items-center gap-0.5 px-3 py-1.5 border-b bg-muted/30 overflow-x-auto">
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex items-center gap-0.5">
          {groupIndex > 0 && (
            <Separator orientation="vertical" className="h-5 mx-1" />
          )}
          {group.map((item, i) => (
            <Button
              key={i}
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                item.action();
              }}
              title={item.title}
              className="h-7 w-7 p-0"
              type="button"
            >
              <item.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default MarkdownToolbar;
