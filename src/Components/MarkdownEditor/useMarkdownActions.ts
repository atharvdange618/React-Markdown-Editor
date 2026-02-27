import { useCallback, useMemo, type RefObject } from "react";

type UpdateFn = (value: string) => void;

function insertText(
  textarea: HTMLTextAreaElement,
  update: UpdateFn,
  before: string,
  after: string,
  placeholder: string,
  targetLine?: number,
) {
  let { selectionStart, selectionEnd } = textarea;
  const value = textarea.value;

  if (targetLine !== undefined) {
    const lines = value.split("\n");
    if (targetLine > 0 && targetLine <= lines.length) {
      let pos = 0;
      for (let i = 0; i < targetLine - 1; i++) {
        pos += lines[i].length + 1;
      }
      selectionStart = pos;
      selectionEnd = pos + lines[targetLine - 1].length;
    }
  }

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
  targetLine?: number,
) {
  let { selectionStart } = textarea;
  const value = textarea.value;

  if (targetLine !== undefined) {
    const lines = value.split("\n");
    if (targetLine > 0 && targetLine <= lines.length) {
      let pos = 0;
      for (let i = 0; i < targetLine - 1; i++) {
        pos += lines[i].length + 1;
      }
      selectionStart = pos;
    }
  }

  const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;

  let currentLineText = value.substring(lineStart);
  let removeLength = 0;
  const newlineIdx = currentLineText.indexOf("\n");
  if (newlineIdx !== -1) {
    currentLineText = currentLineText.substring(0, newlineIdx);
  }

  const headingMatch = currentLineText.match(/^(#{1,6})\s/);
  if (prefix.startsWith("#") && headingMatch) {
    removeLength = headingMatch[0].length;
  }

  const newValue =
    value.substring(0, lineStart) +
    prefix +
    value.substring(lineStart + removeLength);

  update(newValue);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(
      selectionStart + prefix.length - removeLength,
      selectionStart + prefix.length - removeLength,
    );
  });
}

function insertBlock(
  textarea: HTMLTextAreaElement,
  update: UpdateFn,
  block: string,
  cursorOffset: number,
  targetLine?: number,
) {
  let { selectionStart, selectionEnd } = textarea;
  const value = textarea.value;

  if (targetLine !== undefined) {
    const lines = value.split("\n");
    if (targetLine > 0 && targetLine <= lines.length) {
      let pos = 0;
      for (let i = 0; i < targetLine - 1; i++) {
        pos += lines[i].length + 1;
      }
      selectionStart = pos;
      selectionEnd = pos + lines[targetLine - 1].length;
    }
  }

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

  const insertBold = useCallback(
    (targetLine?: number) => {
      const ta = getTextarea();
      if (!ta) return;
      insertText(ta, update, "**", "**", "bold text", targetLine);
    },
    [getTextarea, update],
  );

  const insertItalic = useCallback(
    (targetLine?: number) => {
      const ta = getTextarea();
      if (!ta) return;
      insertText(ta, update, "*", "*", "italic text", targetLine);
    },
    [getTextarea, update],
  );

  const insertStrikethrough = useCallback(
    (targetLine?: number) => {
      const ta = getTextarea();
      if (!ta) return;
      insertText(ta, update, "~~", "~~", "strikethrough text", targetLine);
    },
    [getTextarea, update],
  );

  const insertInlineCode = useCallback(
    (targetLine?: number) => {
      const ta = getTextarea();
      if (!ta) return;
      insertText(ta, update, "`", "`", "code", targetLine);
    },
    [getTextarea, update],
  );

  const insertHeading = useCallback(
    (level: 1 | 2 | 3 | 4 | 5 | 6, targetLine?: number) => {
      const ta = getTextarea();
      if (!ta) return;
      const prefix = "#".repeat(level) + " ";
      insertAtLineStart(ta, update, prefix, targetLine);
    },
    [getTextarea, update],
  );

  const insertBlockquote = useCallback(
    (targetLine?: number) => {
      const ta = getTextarea();
      if (!ta) return;
      insertAtLineStart(ta, update, "> ", targetLine);
    },
    [getTextarea, update],
  );

  const insertUnorderedList = useCallback(
    (targetLine?: number) => {
      const ta = getTextarea();
      if (!ta) return;
      insertAtLineStart(ta, update, "- ", targetLine);
    },
    [getTextarea, update],
  );

  const insertOrderedList = useCallback(
    (targetLine?: number) => {
      const ta = getTextarea();
      if (!ta) return;
      insertAtLineStart(ta, update, "1. ", targetLine);
    },
    [getTextarea, update],
  );

  const insertTaskList = useCallback(
    (targetLine?: number) => {
      const ta = getTextarea();
      if (!ta) return;
      insertAtLineStart(ta, update, "- [ ] ", targetLine);
    },
    [getTextarea, update],
  );

  const insertCodeBlock = useCallback(
    (targetLine?: number) => {
      const ta = getTextarea();
      if (!ta) return;
      const block = "```\ncode here\n```\n";
      insertBlock(ta, update, block, 4, targetLine);
    },
    [getTextarea, update],
  );

  const insertLink = useCallback(
    (targetLine?: number) => {
      const ta = getTextarea();
      if (!ta) return;
      let { selectionStart, selectionEnd } = ta;
      const value = ta.value;

      if (targetLine !== undefined) {
        const lines = value.split("\n");
        if (targetLine > 0 && targetLine <= lines.length) {
          let pos = 0;
          for (let i = 0; i < targetLine - 1; i++) {
            pos += lines[i].length + 1;
          }
          selectionStart = pos;
          selectionEnd = pos + lines[targetLine - 1].length;
        }
      }

      const selected = value.substring(selectionStart, selectionEnd);
      if (selected) {
        insertText(ta, update, "[", "](url)", "", targetLine);
      } else {
        insertText(ta, update, "[", "](url)", "link text", targetLine);
      }
    },
    [getTextarea, update],
  );

  const insertImage = useCallback(
    (targetLine?: number) => {
      const ta = getTextarea();
      if (!ta) return;
      insertText(ta, update, "![", "](image-url)", "alt text", targetLine);
    },
    [getTextarea, update],
  );

  const insertHorizontalRule = useCallback(
    (targetLine?: number) => {
      const ta = getTextarea();
      if (!ta) return;
      insertBlock(ta, update, "\n---\n\n", 5, targetLine);
    },
    [getTextarea, update],
  );

  const insertTable = useCallback(
    (targetLine?: number) => {
      const ta = getTextarea();
      if (!ta) return;
      const table =
        "| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |\n";
      insertBlock(ta, update, table, 2, targetLine);
    },
    [getTextarea, update],
  );

  return useMemo(
    () => ({
      insertBold,
      insertItalic,
      insertStrikethrough,
      insertInlineCode,
      insertHeading,
      insertBlockquote,
      insertUnorderedList,
      insertOrderedList,
      insertTaskList,
      insertCodeBlock,
      insertLink,
      insertImage,
      insertHorizontalRule,
      insertTable,
    }),
    [
      insertBold,
      insertItalic,
      insertStrikethrough,
      insertInlineCode,
      insertHeading,
      insertBlockquote,
      insertUnorderedList,
      insertOrderedList,
      insertTaskList,
      insertCodeBlock,
      insertLink,
      insertImage,
      insertHorizontalRule,
      insertTable,
    ],
  );
}
