# React Markdown Editor

A modern, feature-rich markdown editor built with React and Tailwind CSS. It provides live preview capabilities, syntax highlighting, and supports multiple view modes.

![Markdown Editor Screenshot](image.png)

## Features

- **Syntax Highlighting** - Color-coded markdown syntax in the editor for improved readability.
- **Live Preview** - Real-time rendering of markdown content.
- **Multiple View Modes** - Switch seamlessly between Edit-only, Preview-only, or Split view.
- **Responsive Design** - Optimized for desktop, tablet, and mobile interfaces.
- **Export Options** - Copy content to clipboard or download as a `.md` file.
- **Character Counter** - Real-time document length and typography tracking.
- **Dark Mode Support** - Built-in themeing compatible with system preferences.
- **Rich Markdown Support** - Comprehensive support for headers, lists, code blocks, tables, and standard markdown elements.
- **Performance** - Fast and lightweight, built with minimal external dependencies.

## Demo

[Live Demo](https://your-demo-link.vercel.app)

## Tech Stack

- **React 18+** - Core UI library
- **TypeScript** - Static typing
- **react-markdown** - Markdown parsing and rendering
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Accessible UI components
- **Lucide React** - Iconography

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/atharvdange618/React-Markdown-Editor.git
   cd React-Markdown-Editor
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal) to view the application.

## Usage

### Basic Implementation

```tsx
import MarkdownEditor from "./components/MarkdownEditor";

function App() {
  return (
    <div className="App">
      <MarkdownEditor />
    </div>
  );
}
```

### View Modes

- **Edit Mode**: Focus strictly on writing with syntax highlighting active.
- **Preview Mode**: View the rendered HTML output.
- **Split Mode**: Edit and preview the document side-by-side.

## Customization

The editor uses Tailwind CSS and shadcn/ui components, allowing for straightforward customization.

### Theme Colors

To modify the syntax highlighting colors, update the `syntaxHighlight` configuration:

```tsx
// Headers
.replace(
  /^(#{1,6})\s+(.+)$/gm,
  '<span class="text-blue-600 font-bold">$1</span> <span class="text-purple-700 font-semibold">$2</span>'
)
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── separator.tsx
│   └── MarkdownEditor.tsx
├── lib/
│   └── utils.ts
├── App.tsx
└── main.tsx
```

## Contributing

Contributions are welcome. Please feel free to submit a Pull Request. For major changes or architectural shifts, please open an issue first to discuss your proposed updates.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/Enhancement`)
3. Commit your changes (`git commit -m 'Add some Enhancement'`)
4. Push to the branch (`git push origin feature/Enhancement`)
5. Open a Pull Request

## Known Issues

- Certain advanced or custom markdown extensions may not be fully supported by the inline syntax highlighting.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [react-markdown](https://github.com/remarkjs/react-markdown) for robust markdown parsing.
- [shadcn/ui](https://ui.shadcn.com/) for foundational UI components.
- [Tailwind CSS](https://tailwindcss.com/) for the styling engine.
- [Lucide](https://lucide.dev/) for the icon system.

## Support

For issues, questions, or general support:

- Open an issue on GitHub
- Reach out on [Twitter](https://x.com/atharvdangedev)
