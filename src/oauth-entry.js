import { BrowserOAuthClient } from '@atproto/oauth-client-browser';
import metadata from '../client-metadata.json';

const SCOPE = metadata.scope;

function loopbackMetadata() {
  const port = location.port ? `:${location.port}` : '';
  const redirect = `http://127.0.0.1${port}${location.pathname}`;
  const clientId = `http://localhost?redirect_uri=${encodeURIComponent(redirect)}&scope=${encodeURIComponent(SCOPE)}`;
  return {
    client_id: clientId,
    client_name: 'LibreSky',
    redirect_uris: [redirect],
    scope: SCOPE,
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    token_endpoint_auth_method: 'none',
    application_type: 'native',
    dpop_bound_access_tokens: true,
  };
}

export function createClient() {
  const host = location.hostname;
  const loop = host === '127.0.0.1' || host === '[::1]' || host === 'localhost';
  return new BrowserOAuthClient({
    clientMetadata: loop ? loopbackMetadata() : metadata,
    responseMode: 'query',
    handleResolver: 'https://public.api.bsky.app',
  });
}
