// netlify/edge-functions/basic-auth.js

const USERNAME = "steven";
const PASSWORD = "password";

export default async function handler(request) {
  try {
    const url = new URL(request.url);

    // Allow static assets through without auth
    if (
      url.pathname.startsWith("/assets/") ||
      url.pathname === "/favicon.ico"
    ) {
      return fetch(request);
    }

    const auth = request.headers.get("authorization");

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
      decoded = atob(encoded);
    } catch {
      return new Response("Bad auth encoding", { status: 400 });
    }

    const [user, pass] = decoded.split(":");

    if (user !== USERNAME || pass !== PASSWORD) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Authenticated → pass through
    return fetch(request);
  } catch (err) {
    console.error(err)
    return new Response("Edge auth failure", { status: 500 });
  }
}
