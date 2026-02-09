// netlify/edge-functions/basic-auth.js

const USERNAME = "steven";
const PASSWORD = "password";

/**
 * Decode base64 in a Netlify Edge / Deno safe way
 */
function decodeBase64(encoded) {
  if (typeof globalThis.atob !== "function") {
    throw new Error("atob not available in Edge runtime");
  }

  const binary = globalThis.atob(encoded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default async function handler(request) {
  try {
    const url = new URL(request.url);

    // Allow static assets + favicon through without auth
    if (
      url.pathname.startsWith("/assets/") ||
      url.pathname === "/favicon.ico"
    ) {
      return fetch(request);
    }

    const auth = request.headers.get("authorization");

    // No credentials → browser login prompt
    if (!auth) {
      return new Response("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="JoshDash"',
        },
      });
    }

    const [scheme, encoded] = auth.split(" ");

    if (scheme !== "Basic" || !encoded) {
      return new Response("Invalid auth scheme", { status: 400 });
    }

    let decoded;
    try {
      decoded = decodeBase64(encoded);
    } catch {
      return new Response("Bad auth encoding", { status: 400 });
    }

    const [user, pass] = decoded.split(":");

    if (user !== USERNAME || pass !== PASSWORD) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Authenticated → continue request
    return fetch(request);
  } catch (err) {
    // Absolute safety net — never let Edge crash the site
    console.error(err);
    return new Response("Edge auth failure", { status: 500 });
  }
}
