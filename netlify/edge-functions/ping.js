export default async function handler(request) {
  console.log("edge function loaded:", request.url);
  return fetch(request);
}
console.log("test");
