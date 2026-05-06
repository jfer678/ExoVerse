import { Hero } from "../components/Hero/Hero";
import HeroImageMisiones from "../assets/Misiones.png";
import MemoryPairsImage from "../assets/MemoryPairs.png";
import QuestionsImage from "../assets/Questions.png";
import { useNavigate, type Session } from "react-router";
import { useEffect, useState } from "react";
import supabase from "../lib/supabase";

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
        children={<div></div>}
        backgroundSize="cover"
        fullWidth={true}
      />
      <div className="container my-3">
        <div className="row justify-content-evenly">
          <div className="col-12 col-md-5 me-5">
            <div className="d-flex gap-2 align-items-center">
              <i className="bi bi-leaf text-success"></i>
              <h2 className="fw-bold">Misiones</h2>
            </div>
            <div className="ev-cards-container-variant-2 ev-icon-container-variant-2-color-1 mb-3">
              <div className="ev-icon-container ev-icon-container-color-1">
                <i className="bi bi-search"></i>
              </div>
              <div className="">
                <h3 className="bold">Memory Pairs</h3>
                <p>Desbloquea hasta 3 nuevos cromos completando todo.</p>
              </div>
            </div>
            <div className="ev-cards-container-variant-2 ev-icon-container-variant-2-color-2">
              <div className="ev-icon-container ev-icon-container-color-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-book"
                  viewBox="0 0 16 16"
                >
                  <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                </svg>
              </div>
              <div className="">
                <h3 className="bold">Questions</h3>
                <p>
                  Gana hasta 3 stickers respondiendo todas las preguntas de forma correcta.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="d-flex flex-column gap-2">
              <div className="d-flex gap-2 align-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-controller"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.5 6.027a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2.5-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m-6.5-3h1v1h1v1h-1v1h-1v-1h-1v-1h1z" />
                  <path d="M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729q.211.136.373.297c.408.408.78 1.05 1.095 1.772.32.733.599 1.591.805 2.466s.34 1.78.364 2.606c.024.816-.059 1.602-.328 2.21a1.42 1.42 0 0 1-1.445.83c-.636-.067-1.115-.394-1.513-.773-.245-.232-.496-.526-.739-.808-.126-.148-.25-.292-.368-.423-.728-.804-1.597-1.527-3.224-1.527s-2.496.723-3.224 1.527c-.119.131-.242.275-.368.423-.243.282-.494.575-.739.808-.398.38-.877.706-1.513.773a1.42 1.42 0 0 1-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772a2.3 2.3 0 0 1 .433-.335l-.028-.079zm2.036.412c-.877.185-1.469.443-1.733.708-.276.276-.587.783-.885 1.465a14 14 0 0 0-.748 2.295 12.4 12.4 0 0 0-.339 2.406c-.022.755.062 1.368.243 1.776a.42.42 0 0 0 .426.24c.327-.034.61-.199.929-.502.212-.202.4-.423.615-.674.133-.156.276-.323.44-.504C4.861 9.969 5.978 9.027 8 9.027s3.139.942 3.965 1.855c.164.181.307.348.44.504.214.251.403.472.615.674.318.303.601.468.929.503a.42.42 0 0 0 .426-.241c.18-.408.265-1.02.243-1.776a12.4 12.4 0 0 0-.339-2.406 14 14 0 0 0-.748-2.295c-.298-.682-.61-1.19-.885-1.465-.264-.265-.856-.523-1.733-.708-.85-.179-1.877-.27-2.913-.27s-2.063.091-2.913.27" />
                </svg>
                <h2 className="fw-bold">Mini - juegos</h2>
              </div>
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="ev-square-cards">
                    <img
                      src={MemoryPairsImage}
                      alt="memory pairs image"
                      className="img-fluid"
                    />
                    {session && (<button
                      onClick={() => handleGoToMiniGame("memory-pairs")}
                      type="button"
                      className="btn btn-primary position-absolute bottom-0 end-0 m-3"
                    >
                      Jugar
                    </button>)}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="ev-square-cards">
                    <img
                      src={QuestionsImage}
                      alt="Questions image"
                      className="img-fluid"
                    />
                    {session && (<button
                      onClick={() => handleGoToMiniGame("questions-game")}
                      type="button"
                      className="btn btn-primary position-absolute bottom-0 end-0 m-3"
                    >
                      Jugar
                    </button>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
