import { httpClient } from "../lib/httpClient";

export const getNews = async () => {
  const news = await httpClient.get("https://newsapi.org/v2/everything", {
      q: "wildlife",
      apiKey: import.meta.env.VITE_NEWS_API_KEY,
      page: 1,
      pageSize: 5,
      language: "es",
    })
  return news.articles;
};
