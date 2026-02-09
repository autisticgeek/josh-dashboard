// netlify/edge-functions/basic-auth.js

const USERNAME = "steven";       // change this
const PASSWORD = "password"; // change this

export default async function handler(request, context) {
  const auth = request.headers.get("authorization");

  // No credentials → ask browser to show login prompt
  if (!auth) {
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="JoshDash"',
      },
    });
  }

  // Parse "Basic base64(username:password)"
  const [scheme, encoded] = auth.split(" ");

  if (scheme !== "Basic") {
    return new Response("Invalid auth scheme", { status: 400 });
  }

  const decoded = atob(encoded);
  const [user, pass] = decoded.split(":");

  if (user !== USERNAME || pass !== PASSWORD) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Authenticated → continue to site
  return context.next();
}

export const config = {
  path: "/*", // protect the entire site
};
