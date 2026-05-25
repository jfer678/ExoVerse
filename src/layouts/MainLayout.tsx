import { Outlet, useLocation, useNavigate } from "react-router";
import { NavBar } from "../components/NavBar/NavBar";
import { Footer } from "../components/Footer/Footer";
import { NAV_ELEMENTS } from "../consts/consts";
import { useEffect, useState } from "react";

export const MainLayout = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const shouldShowGameButtons = !NAV_ELEMENTS.some(
    ({ to }) => to === location.pathname,
  );

  const handleExitGame = () => {
    navigator("/misiones");
  };
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth < 600;
  const isTablet = screenWidth >= 600 && screenWidth < 1024;

  const userIsInPuzzlesPage = location.pathname === "/misiones/puzzles";

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />

      <main
        className="flex-fill"
        style={{
          backgroundColor: `${userIsInPuzzlesPage ? "#0f172a" : "#fff"}`,
        }}
      >
        <Outlet />
        {shouldShowGameButtons && (
          <div
            style={{ marginTop: isMobile || isTablet ? "160px" : "80px", }}
            className={`d-flex justify-content-center ${!userIsInPuzzlesPage ? "my-4" : "mb-4"}`}
          >
            <button
              type="button"
              className="btn btn-danger mx-2"
              onClick={handleExitGame}
            >
              Salir del juego
            </button>
            <button
              className="btn btn-success"
              onClick={() => navigator("/album")}
            >
              Ir al album
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
