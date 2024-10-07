const API_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.GOOGLE_CX;

export function googleURL(query: string) {
  const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${query}`;
  return url;
}
