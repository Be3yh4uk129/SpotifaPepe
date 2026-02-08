export async function itunesSearch({ term, entity = "song", limit = 10 }) {
  const url = new URL("https://itunes.apple.com/search");
  url.searchParams.set("term", term);
  url.searchParams.set("entity", entity);
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url);
  if (!res.ok) throw new Error("iTunes API error");
  return res.json();
}
