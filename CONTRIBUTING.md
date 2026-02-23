# Contributing to React Markdown Editor

First off, thank you for considering contributing to the `react-markdown-editor` package! It's people like you that make the open-source community such a fantastic place to learn, inspire, and create.

This document outlines the process for contributing to the project, how to set up your local environment, and our coding standards.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Pull Request Process](#pull-request-process)
5. [Coding Guidelines](#coding-guidelines)

## Code of Conduct

By participating in this project, you are expected to uphold a welcoming, inclusive, and professional environment. Treat all collaborators with respect. Constructive criticism is encouraged, but harassment or discriminatory behavior will not be tolerated.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Bun](https://bun.sh/) (Our preferred package manager and script runner)
- Git

### Local Setup

1. **Fork the Repository:** Click the "Fork" button at the top right of this repository's GitHub page.
2. **Clone your Fork:**
   ```bash
   git clone https://github.com/atharvdange618/React-Markdown-Editor.git
   cd React-Markdown-Editor
   ```
3. **Install Dependencies:**
   ```bash
   bun install
   ```
4. **Start the Development Sandbox:**
   ```bash
   bun run dev
   ```
   This will spin up the local Vite server (usually on `http://localhost:5173`). The `src/App.tsx` file serves as a local sandbox to test your changes to the `MarkdownEditor` component live.

## Development Workflow

### Script Commands

- `bun run dev`: Starts the local development sandbox.
- `bun run build`: Compiles the TypeScript definitions and Vite bundles into the `dist/` folder. This ensures the NPM package builds correctly.
- `bun run lint`: Runs ESLint to check for code quality and formatting issues.

### Making Changes

1. Create a meaningfully named branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
2. Make your edits within the `src/Components/MarkdownEditor` directory.
3. Test your changes locally in the sandbox (`src/App.tsx`). Ensure both the visual rendering and Prop API behaviors are working as expected.
4. Verify your code passes all linting and type-checking:
   ```bash
   bun run tsc --noEmit && bun run lint
   ```

## Pull Request Process

When you are ready to submit your changes:

1. Ensure your code passes the build and lint steps (`bun run build`, `bun run lint`).
2. Commit your changes using clear, descriptive commit messages:
   ```bash
   git commit -m "feat: Add new toolbar button for strikethrough"
   ```
3. Push your branch to your forked repository:
   ```bash
   git push origin feature/your-feature-name
   ```
4. Open a Pull Request (PR) against the `main` branch of the original repository.
5. In your PR description, explain the **"Why"** and **"What"** of your changes. If your PR fixes an open issue, reference it (e.g., `Fixes #123`).
6. A maintainer will review your PR. Be prepared to respond to feedback or request changes!

## Coding Guidelines

We take pride in maintaining a clean, optimized, and secure codebase. Please adhere to the following principles when contributing:

- **React Best Practices:**
  - Hoist static variables and parsing rules completely outside of your React components to prevent unnecessary instantiations.
  - Utilize `useCallback` and `useMemo` strictly when passing down complex reference objects or callback scopes to child components.
  - Rely on ternary expressions (`condition ? true : null`) rather than the `&&` operator to minimize erratic zero-renders.
- **Security:**
  - This project leverages `isomorphic-dompurify`. Any new features implementing `dangerouslySetInnerHTML` must pipe HTML directly through the sanitizer first.
- **Styling:**
  - CSS is handled via Tailwind. Use standard, broadly compatible Tailwind utility classes.
- **Formatting:**
  - We use standard ESLint and TypeScript configurations. Please ensure your IDE formatting matches the repository configuration or run the linter heavily before commiting.

Thank you again for your time and expertise!
