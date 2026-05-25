import { Hero } from "../components/Hero/Hero";
import { CardsSection } from "../components/CardsSection/CardsSection";
import ImgNews from "../assets/news1.png";
import HeroImageHome from "../assets/HomeBG.jpg";
import { useEffect, useState } from "react";
import { getNews } from "../services/news";
import type { Article } from "../interfaces/news";
import { HeroButton } from "../components/Hero/HeroButton";

export const Home = () => {
  const [news, setNews] = useState<Article[] | []>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const articles = await getNews();

      setNews(articles);
    };

    fetchNews();
  }, []);

  const handleGoToNews = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <>
      <Hero
        img={HeroImageHome}
        children={
          <div className="flex flex-col">
            <h1 className="display-4 fw-bold text-white text-center" style={{
              textShadow: "5px 5px 5px rgba(0, 0, 0, 0.7)"
            }}>
              Descubre el mundo de los{" "}
              <span className="text-warning"><a href="mailto:"></a>animales exóticos</span>
            </h1>
            <br />
            <p className="lead text-white text-center fw-bold display-5" style={{
              textShadow: "5px 5px 5px rgba(0, 0, 0, 0.7)"
            }}> Aprende <i className="bi bi-dot"></i> juega</p>
          </div>
        }
      />
      <CardsSection />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-center mt-5 mb-4 text-primary fw-bold">
              Últimas Noticias
            </h2>
          </div>
        </div>
        {news &&
          news.map((article) => (
            <div className="row mb-3 border shadow rounded" key={article.title}>
              <div className="col-12 col-md-6">
                <h3 className="fw-bold">{article.title}</h3>
                <p>{article.description}</p>
                <HeroButton
                  key={`hero_button_1`}
                  label={"Ver mas +"}
                  onClick={() => handleGoToNews(article.url)}
                />
              </div>
              <div className="col-12 col-md-6">
                <div>
                  <img
                    src={article.urlToImage || ImgNews}
                    className="img-fluid rounded"
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
