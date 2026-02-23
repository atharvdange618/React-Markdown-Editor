import { useRef, useState } from "react";
import MarkdownEditor, {
  type MarkdownEditorRef,
} from "./Components/MarkdownEditor/MarkdownEditor";

function App() {
  const [value, setValue] = useState(`# Customizable Editor Sandbox 🛠️

This is a test to verify our new controlled props.
  
![XSS Test](x" onerror=alert(1) ")

Notice how trying to inject XSS above doesn't trigger anything because of DOMPurify!

## What you can do:
1. **Focus Button:** Click the "Focus Editor" button above to programmatically focus the textarea (using \`forwardRef\`).
2. **Alert Value Button:** Click "Alert Value" to grab the current state via \`getValue()\`.
3. **Controlled State:** Typing here updates the parent \`App.tsx\` state!
`);

  const editorRef = useRef<MarkdownEditorRef>(null);

  return (
    <div className="p-8 max-w-[1400px] mx-auto min-h-screen bg-neutral-50 dark:bg-neutral-900 border">
      <div className="mb-4 flex gap-4">
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded shadow"
          onClick={() => editorRef.current?.focus()}
        >
          Programmatically Focus Editor
        </button>
        <button
          className="bg-secondary text-secondary-foreground px-4 py-2 rounded shadow"
          onClick={() => alert(editorRef.current?.getValue())}
        >
          Alert Internal Value
        </button>
      </div>

      <div className="h-[80vh] border rounded-lg overflow-hidden shadow-2xl">
        <MarkdownEditor
          ref={editorRef}
          value={value}
          onChange={setValue}
          className="bg-white dark:bg-black"
          placeholder="Controlled input area..."
        />
      </div>
    </div>
  );
}

export default App;
