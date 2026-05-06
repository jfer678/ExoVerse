import { Link } from "react-router";

export const Footer = () => {
  return (
    <footer className="bg-body-tertiary text-center mt-5">
      

      <div
        className="text-center p-3"
        style={{backgroundColor:" rgba(0, 0, 0, 0.05)"}}
      >
        © 2026 Copyright:
        <Link className="text-body" to="/">
          ExoticVerse
        </Link>
      </div>
    </footer>
  );
};
