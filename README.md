# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Environment Variables

1. Copy `.env.example` to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and set the values for your environment. The main variables are:
   - `VITE_API_BASE_URL` – base URL of the MakerWorks API
   - `VITE_AUTHENTIK_BASE_URL` – base URL of your Authentik instance
   - `VITE_AUTH_CLIENT_ID` – OAuth client ID
   - `VITE_AUTH_CLIENT_SECRET` – OAuth client secret
   - `VITE_AUTHENTIK_LOGIN_URL` – direct login URL
   - `VITE_AUTHENTIK_REGISTER_URL` – registration flow URL
   - `VITE_AUTHENTIK_LOGOUT_URL` – logout URL
