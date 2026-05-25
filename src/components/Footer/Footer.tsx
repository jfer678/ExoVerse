import { Link, useLocation } from "react-router";

export const Footer = () => {
  const location = useLocation();
  return (
    <footer
      className={`bg-body-tertiary text-center ${
        location.pathname === "/misiones/puzzles" ? "" : "mt-5"
      }`}
    >
      <div
        className="container-fluid text-center p-3 d-flex flex-column flex-md-row justify-content-center align-items-center gap-2"
        style={{ backgroundColor: "rgba(108, 107, 107, 0.58)" }}
      >
        <span className="text-muted small">
          © 2026 Copyright:
        </span>
        <Link className="text-body fw-bold" to="/">
          ExoticVerse
        </Link>
      </div>
    </footer>
  );
};

