// netlify/edge-functions/basic-auth.js

const USERNAME = "pikachu";
const PASSWORD = "byu";

// Helper: decode base64 safely in Edge runtime
function decodeBase64(encoded) {
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default async function handler(request, context) {
  const url = new URL(request.url);
  const path = url.pathname;

  // 1. Skip Netlify internal requests (critical!)
  if (path.startsWith("/.netlify/")) {
    return context.next();
  }

  // 2. Skip static files (JS, CSS, images, fonts, etc.)
  //    This regex matches any file extension.
  if (/\.[a-zA-Z0-9]+$/.test(path)) {
    return context.next();
  }

  // 3. Basic Auth check
  const auth = request.headers.get("authorization");

  if (!auth) {
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="JoshDash"',
        "Cache-Control": "no-store",
      },
    });
  }

  const [scheme, encoded] = auth.split(" ");
  if (scheme !== "Basic" || !encoded) {
    return new Response("Invalid auth scheme", {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  let decoded;
  try {
    decoded = decodeBase64(encoded);
  } catch {
    return new Response("Bad auth encoding", {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const [user, pass] = decoded.split(":");

  if (user !== USERNAME || pass !== PASSWORD) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="JoshDash"',
        "Cache-Control": "no-store",
      },
    });
  }

  // 4. Authenticated → continue to site
  return context.next();
}

export const config = {
  path: "/*",
};
