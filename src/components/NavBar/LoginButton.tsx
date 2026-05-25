import React from "react";

interface LoginButtonProps {
  setter: (value: React.SetStateAction<boolean>) => void;
  isMobile?: boolean;
}

export const LoginButton = ({ setter, isMobile = false }: LoginButtonProps) => {
  return (
    <li className={`nav-item ${isMobile ? "mx-auto" : "ms-auto"}`}>
      <button
        type="button"
        onClick={() => setter((prev) => !prev)}
        className="btn btn-lg btn-primary mt-4"
      >
        <i className="fa-solid fa-user"></i>{" "}Iniciar Sesión
      </button>
    </li>
  );
};
