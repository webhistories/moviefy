import { generateCodeVerifier, generateCodeChallenge } from './pkce.js';

const clientId = "da8efc3f20814776b216228d8a9033fe";
const redirectUri = "http://127.0.0.1:8000/";
// const redirectUri = "https://bea-moviefy.netlify.app/";
const scopes = "user-top-read";

export async function redirectToSpotifyLogin() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem("verifier", codeVerifier);

  const args = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    scope: scopes
  });

  window.location.href = `https://accounts.spotify.com/authorize?${args.toString()}`;
}

export async function getAccessToken(code) {
  const codeVerifier = localStorage.getItem("verifier");

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  });

  const data = await response.json();
  return data.access_token;
}
