# MakerWorks Frontend

This repository contains the MakerWorks React application built with Vite. A small
FastAPI service is included under the `backend` folder for local development and tests.

The project uses the official
[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)
plugin for fast refresh during development.

## Getting Started

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Start the FastAPI backend

The backend service is used for authentication tests and local development.
You will also need a running Redis instance for session storage.
Run the backend and Redis with:

```bash
redis-server &
python backend/main.py
```

### Build for production

```bash
npm run build
```

### Linting and tests

Run the linter with:

```bash
npm run lint
```

Vitest unit tests live under `src/api/__tests__` and can be run with:

```bash
npm run test
```

Cypress end-to-end tests are also included. Open the Cypress GUI with:

```bash
npm run cy:open
```

Run Cypress headlessly with:

```bash
npm run cy:run
```

### Theme Toggle

The navigation bar includes a small sun/moon button that toggles between light
and dark mode. Your selected theme is saved to `localStorage` and applied on
future visits.

## Environment variables

Copy `.env.example` to `.env` and customise as needed. Important values include:

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_yourkeyhere
```

`VITE_API_BASE_URL` determines where API calls are sent and
`VITE_STRIPE_PUBLISHABLE_KEY` is required to run the checkout example. Optional
settings like `VITE_APP_NAME` and `VITE_ENV` can be used to further configure the
frontend.

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

## Lint configuration

ESLint ships with sensible defaults. Adjust `eslint.config.js` to tweak rules for your project.

## License

This project is licensed under the [MIT License](LICENSE).
