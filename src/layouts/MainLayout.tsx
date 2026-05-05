import { Outlet, useLocation, useNavigate } from "react-router";
import { NavBar } from "../components/NavBar/NavBar";
import { Footer } from "../components/Footer/Footer";
import { NAV_ELEMENTS } from "../consts/consts";

export const MainLayout = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const shouldShowGameButtons = !NAV_ELEMENTS.some(({ to }) => to === location.pathname);
  
  const handleExitGame = () => {
    navigator("/misiones");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />

      <main className="flex-fill">
        <Outlet />
        {shouldShowGameButtons && (
          <div className="d-flex justify-content-center my-4">
            <button type="button" className="btn btn-danger mx-2" onClick={handleExitGame}>Salir del juego</button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
