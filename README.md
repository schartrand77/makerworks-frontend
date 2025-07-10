# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Lint and tests

Run the linter with:

```bash
npm run lint
```

Run the unit tests with:

```bash
npm test
```

This command uses [Vitest](https://vitest.dev/) to execute all test files.

### Theme Toggle

The navigation bar includes a small sun/moon button that toggles between light
and dark mode. Your selected theme is saved to `localStorage` and applied on
future visits.

## Folder structure

- **src/api** – helper methods for network requests
- **src/components** – reusable React components
- **src/pages** – top level route pages
- **src/routes** – React Router configuration
- **src/store** – Zustand state stores
- **src/hooks** – custom React hooks
- **src/lib** – generic utilities
- **src/config** – app configuration values
- **src/context** – React context providers
- **src/assets** – static assets
- **public** – static files served directly by Vite

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## License

This project is licensed under the [MIT License](LICENSE).
