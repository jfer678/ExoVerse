import { Hero } from "../components/Hero/Hero";
import HeroImageMisiones from "../assets/MisionesBG.jpg";
import MemoryPairsImage from "../assets/MemoryPairs.png";
import QuestionsImage from "../assets/Questions.png";
import PuzzlesImage from "../assets/Puzzles.png";
import MatchGameImage from "../assets/MatchGameLogo.png";
import { useNavigate, type Session } from "react-router";
import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import { GameCard } from "../components/GameCard/GameCard";

export const Misiones = () => {
  const [session, setSession] = useState<Session | null>(null);
  const navigator = useNavigate();

  const handleGoToMiniGame = (game: string) => {
    const navigationPath = `/misiones/${game}`;
    navigator(navigationPath);
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <Hero
        img={HeroImageMisiones}
        children={<div className="flex flex-col">
            <h1 className="display-4 fw-bold text-white text-center" style={{
              textShadow: "5px 5px 5px rgba(0, 0, 0, 0.7)"
            }}>
              Completa misiones{" "}
              <span className="text-warning">y gana stickers</span>
            </h1>
          </div>}
        backgroundSize="cover"
        fullWidth={true}
      />
      <div className="container-fluid px-auto py-4 py-md-5">
        <div className="row justify-content-center">
          {/* Misiones*/}
          <div className="col-12 col-md-10 col-lg-6 col-xl-5">
            <div className="d-flex gap-2 align-items-center mb-4 flex-wrap">
              <i className="bi bi-leaf text-success fs-3"></i>
              <h2 className="fw-bold h2 mb-0">Misiones</h2>
            </div>

            {/* Memory Pairs */}
            <div className="ev-cards-container-variant-2 ev-icon-container-variant-2-color-1 mb-4">
              <div className="ev-icon-container ev-icon-container-color-1 d-flex align-items-center justify-content-center me-3">
                <i className="bi bi-search fs-5"></i>
              </div>
              <div className="flex-grow-1">
                <h3 className="bold h5 mb-2">Memory Pairs</h3>
                <p className="mb-0 text-muted">
                  Desbloquea hasta 3 nuevos cromos completando todo.
                </p>
              </div>
            </div>
            <div className="ev-cards-container-variant-2 ev-icon-container-variant-3-color-3 mb-4">
              <div className="ev-icon-container ev-icon-container-color-3 d-flex align-items-center justify-content-center me-3">
                <i className="bi bi-puzzle-fill"></i>
              </div>
              <div className="flex-grow-1">
                <h3 className="bold h5 mb-2">Puzzles</h3>
                <p className="mb-0 text-muted">
                  Completa todos los rompecabezas y gana stickers.
                </p>
              </div>
            </div>
            {/* Questions */}
            <div className="ev-cards-container-variant-2 ev-icon-container-variant-2-color-2 mb-4">
              <div className="ev-icon-container ev-icon-container-color-2 d-flex align-items-center justify-content-center me-3">
                <i className="bi bi-book fs-5"></i>
              </div>
              <div className="flex-grow-1">
                <h3 className="bold h5 mb-2">Questions</h3>
                <p className="mb-0 text-muted">
                  Gana hasta 3 stickers respondiendo todas las preguntas de
                  forma correcta.
                </p>
              </div>
            </div>
            <div className="ev-cards-container-variant-2 ev-icon-container-variant-4-color-4 mb-4">
              <div className="ev-icon-container ev-icon-container-color-4 d-flex align-items-center justify-content-center me-3">
               <i className="bi bi-arrow-left-right"></i>
              </div>
              <div className="flex-grow-1">
                <h3 className="bold h5 mb-2">Match Game</h3>
                <p className="mb-0 text-muted">
                  Une de forma correcta y adquiere stickers.
                </p>
              </div>
            </div>
          </div>

          {/* Mini juegos */}
          <div className="col-12 col-md-10 col-lg-6 col-xl-5 ms-5">
            <div className="d-flex gap-3 align-items-center mb-4 flex-wrap">
              <i className="bi bi-controller text-primary fs-3"></i>
              <h2 className="fw-bold h2 mb-0">Mini-juegos</h2>
            </div>

            <div className="row g-3 g-md-4">
              <div className="col-12 col-md-6 mb-5 me-4">
                <GameCard
                  session={session}
                  imageSrc={MemoryPairsImage}
                  redirectFunction={handleGoToMiniGame}
                  gameName="memory-pairs"
                />
              </div>
              <div className="col-12 col-md-5">
                <GameCard
                  session={session}
                  imageSrc={QuestionsImage}
                  redirectFunction={handleGoToMiniGame}
                  gameName="questions-game"
                />
              </div>
            </div>
            <div className="row g-3 g-md-4">
              <div className="col-12 col-md-6 me-4">
                <GameCard
                  session={session}
                  imageSrc={PuzzlesImage}
                  redirectFunction={handleGoToMiniGame}
                  gameName="puzzles"
                />
              </div>
              <div className="col-12 col-md-5">
                <GameCard
                  session={session}
                  imageSrc={MatchGameImage}
                  redirectFunction={handleGoToMiniGame}
                  gameName="match-game"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
