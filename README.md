# React Markdown Editor

A modern, highly-configurable, and highly-secure React markdown editor component. Built with React and Tailwind CSS, it provides dual-pane live preview capabilities, syntax highlighting, and an extensive Props API for controlled or uncontrolled states.

![Markdown Editor Screenshot](https://neo-md.atharvdangedev.in/demo.png)

## Features

- **XSS Prevention** - Raw HTML rendering in the editor pane is secured via `isomorphic-dompurify`.
- **Syntax Highlighting** - Fully customizable color themes for the editor pane with support for headings, bold, italic, links, code blocks, lists, and more.
- **Controlled & Uncontrolled Support** - Plug it into external state naturally like a standard input element, or let it manage its own.
- **Deep Customizability** - Apply your own `className` structures mapping to the editor pane, preview pane, and toolbar.
- **Ref Forwarding** - Programmatically trigger focus or grab values using `useImperativeHandle` and `forwardRef`.
- **Custom Renderers** - Inject your own custom React components directly into the `react-markdown` DOM rendering pipeline.
- **Live Preview** - Real-time rendering of markdown content with scroll tracking sync.
- **Dark Mode Support** - Built-in Tailwind theming compatible with system preferences.

## Demo
[Live Demo](https://neo-md.atharvdangedev.in)

## Installation

```bash
npm install neo-md
# or
yarn add neo-md
# or
pnpm add neo-md
# or
bun add neo-md
```

You must also have `react` and `react-dom` installed, as they are peer dependencies.

## Usage

### Basic Implementation (Uncontrolled)

By default, the editor works out of the box with zero configuration necessary.

```tsx
import { MarkdownEditor } from "neo-md";

// Important: import the CSS!
import "neo-md/react-markdown-editor.css";

function App() {
  return (
    <div className="h-screen py-8">
      <MarkdownEditor />
    </div>
  );
}
```

### Advanced Implementation (Controlled)

Control the text value, track the current pane view mode, and alter the default toolbar state using the rich Props API.

```tsx
import { useState, useRef } from "react";
import { MarkdownEditor, MarkdownEditorRef } from "neo-md";
import "neo-md/react-markdown-editor.css";

function App() {
  const [markdown, setMarkdown] = useState("# Initial Text");
  const [view, setView] = useState<"edit" | "preview" | "split">("split");
  const editorRef = useRef<MarkdownEditorRef>(null);

  const focusEditor = () => editorRef.current?.focus();

  const customRenderers = {
    h1: ({ children }) => (
      <h1 className="text-4xl text-blue-500">{children}</h1>
    ),
  };

  return (
    <div className="h-screen py-8">
      <button onClick={focusEditor}>Focus Textarea</button>

      <MarkdownEditor
        ref={editorRef}
        value={markdown}
        onChange={setMarkdown}
        viewMode={view}
        onViewModeChange={setView}
        components={customRenderers}
        hideWordCount={true}
        enableCopy={false}
        className="my-custom-wrapper"
        placeholder="Type something amazing..."
      />
    </div>
  );
}
```

## API Reference

The `MarkdownEditor` component accepts the following props:

| Prop               | Type                             | Default              | Description                                        |
| ------------------ | -------------------------------- | -------------------- | -------------------------------------------------- |
| `value`            | `string`                         | `undefined`          | The controlled markdown text.                      |
| `defaultValue`     | `string`                         | `(default template)` | Initial text for uncontrolled mode.                |
| `onChange`         | `(value: string) => void`        | `undefined`          | Callback fired when text changes.                  |
| `viewMode`         | `"edit" \| "preview" \| "split"` | `undefined`          | The controlled view mode.                          |
| `defaultViewMode`  | `"edit" \| "preview" \| "split"` | `"split"`            | Initial view mode for uncontrolled mode.           |
| `onViewModeChange` | `(mode) => void`                 | `undefined`          | Callback fired when a toolbar tab is clicked.      |
| `className`        | `string`                         | `""`                 | Classes applied to the root container.             |
| `editorClassName`  | `string`                         | `""`                 | Classes applied to the editor pane wrapper.        |
| `previewClassName` | `string`                         | `""`                 | Classes applied to the preview pane wrapper.       |
| `hideToolbar`      | `boolean`                        | `false`              | Completely removes the top toolbar block.          |
| `hideWordCount`    | `boolean`                        | `false`              | Hides the character counter badge.                 |
| `enableDownload`   | `boolean`                        | `true`               | Toggles the exact "Download" button.               |
| `enableCopy`       | `boolean`                        | `true`               | Toggles the exact "Copy" button.                   |
| `placeholder`      | `string`                         | `"Start typing..."`  | Textbox placeholder text.                          |
| `readOnly`         | `boolean`                        | `false`              | Disables text input while retaining interactions.  |
| `maxLength`        | `number`                         | `undefined`          | Hard cap on textarea character length.             |
| `components`       | `Components`                     | `{}`                 | Complete `react-markdown` DOM rendering overrides. |
| `syntaxColors`     | `SyntaxHighlightColors`          | `defaultColors`      | Custom color theme for syntax highlighting.        |

## Exposed Methods (`MarkdownEditorRef`)

Via `forwardRef`, parents can trigger the following imperatives on the editor:

- `focus()`: Forces browser focus onto the underlying `<textarea>`.
- `getValue()`: Retrieves the current internal markdown string, particularly useful if you run uncontrolled mode and just want the value on submit.

## Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed information on how to get started, development workflow, and coding guidelines.

## License

This project is licensed under the [MIT License](LICENSE).
