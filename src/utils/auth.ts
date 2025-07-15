// src/utils/auth.ts

/**
 * Builds the Authentik OAuth2 login URL dynamically
 */
export function buildLoginUrl(): string {
  const baseUrl = import.meta.env.VITE_AUTHENTIK_BASE_URL;
  const clientId = import.meta.env.VITE_AUTH_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_AUTHENTIK_REDIRECT_URI;

  if (!baseUrl || !clientId || !redirectUri) {
    throw new Error(
      'Missing environment variables: VITE_AUTHENTIK_BASE_URL, VITE_AUTH_CLIENT_ID, VITE_AUTHENTIK_REDIRECT_URI'
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    scope: 'openid email profile',
    redirect_uri: redirectUri,
  });

  return `${baseUrl}/application/o/authorize/?${params.toString()}`;
}

/**
 * Builds the Authentik Registration flow URL
 */
export function buildRegisterUrl(): string {
  const baseUrl = import.meta.env.VITE_AUTHENTIK_BASE_URL;
  const registrationPath =
    import.meta.env.VITE_AUTHENTIK_REGISTER_PATH || '/if/flow/default-registration/';

  if (!baseUrl) {
    throw new Error('Missing environment variable: VITE_AUTHENTIK_BASE_URL');
  }

  return `${baseUrl}${registrationPath}`;
}
