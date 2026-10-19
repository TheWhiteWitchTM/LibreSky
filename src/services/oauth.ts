/**
 * Bluesky / AT Protocol OAuth2 Client with PKCE
 */

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}

function generateRandomString(length = 64): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues)
    .map((x) => charset[x % charset.length])
    .join('');
}

export class OAuthService {
  private verifierKey = 'libresky_oauth_verifier';
  private stateKey = 'libresky_oauth_state';
  private dpopKey = 'libresky_dpop_key';

  async initiateAuth(handle: string, clientId?: string): Promise<string> {
    const cleanHandle = handle.trim().replace(/^@/, '');
    
    // Default client ID points to GitHub Pages client-metadata or localhost if in dev
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const effectiveClientId =
      clientId ||
      (isLocal
        ? `${window.location.origin}/client-metadata.json`
        : 'https://thewhitewitchtm.github.io/LibreSky/client-metadata.json');

    const redirectUri = window.location.origin + window.location.pathname;

    // 1. Resolve handle to DID and authorization server
    const didRes = await fetch(`https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(cleanHandle)}`);
    if (!didRes.ok) {
      throw new Error(`Could not resolve handle @${cleanHandle}`);
    }
    const { did } = await didRes.json();

    // 2. Fetch DID doc
    const docRes = await fetch(`https://plc.directory/${did}`);
    let pdsEndpoint = 'https://bsky.social';
    if (docRes.ok) {
      const doc = await docRes.json();
      const pdsService = doc.service?.find((s: any) => s.id === '#atproto_pds');
      if (pdsService?.serviceEndpoint) {
        pdsEndpoint = pdsService.serviceEndpoint;
      }
    }

    // 3. Generate PKCE Verifier and Challenge
    const codeVerifier = generateRandomString(64);
    const codeChallenge = base64UrlEncode(await sha256(codeVerifier));
    const state = generateRandomString(32);

    sessionStorage.setItem(this.verifierKey, codeVerifier);
    sessionStorage.setItem(this.stateKey, state);
    sessionStorage.setItem('libresky_pds_endpoint', pdsEndpoint);
    sessionStorage.setItem('libresky_auth_handle', cleanHandle);

    // 4. Build authorization URL
    // Standard ATProto OAuth entry point
    const authUrl = new URL(`${pdsEndpoint}/oauth/authorize`);
    authUrl.searchParams.set('client_id', effectiveClientId);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'atproto transition:generic');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');
    authUrl.searchParams.set('login_hint', cleanHandle);

    return authUrl.toString();
  }

  async handleCallback(code: string, state: string): Promise<any> {
    const savedState = sessionStorage.getItem(this.stateKey);
    const codeVerifier = sessionStorage.getItem(this.verifierKey);
    const pdsEndpoint = sessionStorage.getItem('libresky_pds_endpoint') || 'https://bsky.social';
    const redirectUri = window.location.origin + window.location.pathname;

    if (!codeVerifier) {
      throw new Error('OAuth verifier not found in session');
    }
    if (state !== savedState) {
      throw new Error('State mismatch error in OAuth callback');
    }

    // Exchange code for token
    const tokenRes = await fetch(`${pdsEndpoint}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
        client_id: 'https://thewhitewitchtm.github.io/LibreSky/client-metadata.json',
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      throw new Error(`Token exchange failed: ${errText}`);
    }

    const tokenData = await tokenRes.json();
    sessionStorage.removeItem(this.verifierKey);
    sessionStorage.removeItem(this.stateKey);
    return tokenData;
  }
}

export const oauthService = new OAuthService();
