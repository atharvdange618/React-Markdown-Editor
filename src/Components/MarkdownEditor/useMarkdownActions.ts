import { useCallback, type RefObject } from "react";

type UpdateFn = (value: string) => void;

function insertText(
  textarea: HTMLTextAreaElement,
  update: UpdateFn,
  before: string,
  after: string,
  placeholder: string,
) {
  const { selectionStart, selectionEnd, value } = textarea;
  const selected = value.substring(selectionStart, selectionEnd);
  const content = selected || placeholder;

  const newValue =
    value.substring(0, selectionStart) +
    before +
    content +
    after +
    value.substring(selectionEnd);

  update(newValue);

  requestAnimationFrame(() => {
    textarea.focus();
    const cursorStart = selectionStart + before.length;
    const cursorEnd = cursorStart + content.length;
    textarea.setSelectionRange(cursorStart, cursorEnd);
  });
}

function insertAtLineStart(
  textarea: HTMLTextAreaElement,
  update: UpdateFn,
  prefix: string,
) {
  const { selectionStart, value } = textarea;
  const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;

  const newValue =
    value.substring(0, lineStart) + prefix + value.substring(lineStart);

  update(newValue);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(
      selectionStart + prefix.length,
      selectionStart + prefix.length,
    );
  });
}

function insertBlock(
  textarea: HTMLTextAreaElement,
  update: UpdateFn,
  block: string,
  cursorOffset: number,
) {
  const { selectionStart, selectionEnd, value } = textarea;

  const needsNewlineBefore =
    selectionStart > 0 && value[selectionStart - 1] !== "\n";
  const pre = needsNewlineBefore ? "\n" : "";

  const newValue =
    value.substring(0, selectionStart) +
    pre +
    block +
    value.substring(selectionEnd);

  update(newValue);

  requestAnimationFrame(() => {
    textarea.focus();
    const pos = selectionStart + pre.length + cursorOffset;
    textarea.setSelectionRange(pos, pos);
  });
}

export function useMarkdownActions(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  update: UpdateFn,
) {
  const getTextarea = useCallback(() => {
    return textareaRef.current;
  }, [textareaRef]);

  const insertBold = useCallback(() => {
    const ta = getTextarea();
    if (!ta) return;
    insertText(ta, update, "**", "**", "bold text");
  }, [getTextarea, update]);

  const insertItalic = useCallback(() => {
    const ta = getTextarea();
    if (!ta) return;
    insertText(ta, update, "*", "*", "italic text");
  }, [getTextarea, update]);

  const insertStrikethrough = useCallback(() => {
    const ta = getTextarea();
    if (!ta) return;
    insertText(ta, update, "~~", "~~", "strikethrough text");
  }, [getTextarea, update]);

  const insertInlineCode = useCallback(() => {
    const ta = getTextarea();
    if (!ta) return;
    insertText(ta, update, "`", "`", "code");
  }, [getTextarea, update]);

  const insertHeading = useCallback(
    (level: 1 | 2 | 3) => {
      const ta = getTextarea();
      if (!ta) return;
      const prefix = "#".repeat(level) + " ";
      insertAtLineStart(ta, update, prefix);
    },
    [getTextarea, update],
  );

  const insertBlockquote = useCallback(() => {
    const ta = getTextarea();
    if (!ta) return;
    insertAtLineStart(ta, update, "> ");
  }, [getTextarea, update]);

  const insertUnorderedList = useCallback(() => {
    const ta = getTextarea();
    if (!ta) return;
    insertAtLineStart(ta, update, "- ");
  }, [getTextarea, update]);

  const insertOrderedList = useCallback(() => {
    const ta = getTextarea();
    if (!ta) return;
    insertAtLineStart(ta, update, "1. ");
  }, [getTextarea, update]);

  const insertCodeBlock = useCallback(() => {
    const ta = getTextarea();
    if (!ta) return;
    const block = "```\ncode here\n```\n";
    insertBlock(ta, update, block, 4);
  }, [getTextarea, update]);

  const insertLink = useCallback(() => {
    const ta = getTextarea();
    if (!ta) return;
    const { selectionStart, selectionEnd, value } = ta;
    const selected = value.substring(selectionStart, selectionEnd);
    if (selected) {
      insertText(ta, update, "[", "](url)", "");
    } else {
      insertText(ta, update, "[", "](url)", "link text");
    }
  }, [getTextarea, update]);

  const insertImage = useCallback(() => {
    const ta = getTextarea();
    if (!ta) return;
    insertText(ta, update, "![", "](image-url)", "alt text");
  }, [getTextarea, update]);

  const insertHorizontalRule = useCallback(() => {
    const ta = getTextarea();
    if (!ta) return;
    insertBlock(ta, update, "\n---\n\n", 5);
  }, [getTextarea, update]);

  const insertTable = useCallback(() => {
    const ta = getTextarea();
    if (!ta) return;
    const table =
      "| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |\n";
    insertBlock(ta, update, table, 2);
  }, [getTextarea, update]);

  return {
    insertBold,
    insertItalic,
    insertStrikethrough,
    insertInlineCode,
    insertHeading,
    insertBlockquote,
    insertUnorderedList,
    insertOrderedList,
    insertCodeBlock,
    insertLink,
    insertImage,
    insertHorizontalRule,
    insertTable,
  };
}
