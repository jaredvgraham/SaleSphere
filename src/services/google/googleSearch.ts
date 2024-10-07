export async function googleSearch(url: string) {
  const res = await fetch(url);
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    return "No results found.";
  }

  const formattedResults = data.items
    .map((item: any, index: number) => {
      return `Result ${index + 1}:\nTitle: ${item.title}\nSnippet: ${
        item.snippet
      }\nLink: ${item.link}\n`;
    })
    .join("\n");

  return formattedResults;
}
