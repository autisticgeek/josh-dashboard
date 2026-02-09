// // netlify/edge-functions/basic-auth.js

// const USERNAME = "steven";
// const PASSWORD = "password";

// function decodeBase64(encoded) {
//   if (typeof globalThis.atob !== "function") {
//     throw new Error("atob not available in Edge runtime");
//   }

//   const binary = globalThis.atob(encoded);
//   const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
//   return new TextDecoder().decode(bytes);
// }

// export default async function handler(request) {
//   try {
//     const url = new URL(request.url);

//     // Let static assets and favicon through
//     if (
//       url.pathname.startsWith("/assets/") ||
//       url.pathname === "/favicon.ico"
//     ) {
//       return fetch(request);
//     }

//     const auth = request.headers.get("authorization");

//     if (!auth) {
//       // CDN-friendly 401
//       return new Response("Authentication required", {
//         status: 401,
//         headers: {
//           "WWW-Authenticate": 'Basic realm="JoshDash"',
//           "Cache-Control": "no-store, no-cache, must-revalidate",
//           Pragma: "no-cache",
//           Expires: "0",
//         },
//       });
//     }

//     const [scheme, encoded] = auth.split(" ");
//     if (scheme !== "Basic" || !encoded) {
//       return new Response("Invalid auth scheme", {
//         status: 400,
//         headers: {
//           "Cache-Control": "no-store",
//         },
//       });
//     }

//     let decoded;
//     try {
//       decoded = decodeBase64(encoded);
//     } catch {
//       return new Response("Bad auth encoding", {
//         status: 400,
//         headers: {
//           "Cache-Control": "no-store",
//         },
//       });
//     }

//     const [user, pass] = decoded.split(":");
//     if (user !== USERNAME || pass !== PASSWORD) {
//       return new Response("Unauthorized", {
//         status: 401,
//         headers: {
//           "WWW-Authenticate": 'Basic realm="JoshDash"',
//           "Cache-Control": "no-store, no-cache, must-revalidate",
//           Pragma: "no-cache",
//           Expires: "0",
//         },
//       });
//     }

//     // Authenticated → pass through to site
//     return fetch(request);
//   } catch (err) {
//     console.error(err);
//     // Absolute safety net — prevent 500 
//     return new Response("Edge auth failure", {
//       status: 500,
//       headers: {
//         "Cache-Control": "no-store",
//       },
//     });
//   }
// }
