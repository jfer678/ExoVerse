import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { NAV_ELEMENTS } from "../../consts/consts";
import { useAuth } from "../../hooks/useAuth";
import supabase from "../../lib/supabase";
import { type Session } from "@supabase/supabase-js";
import logo from "../../assets/logo.png";
import { NavBarItem } from "./NavBarItem";
import { LoginForm } from "../Forms/LoginForm";

export const NavbarMobile = () => {
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const location = useLocation();

  const isDisabled = !NAV_ELEMENTS.some(({ to }) => to === location.pathname);

  const { handleLogout } = useAuth();

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

  useEffect(() => {
    if (isOpenLogin) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpenLogin]);

  return (
    <nav className="navbar bg-body-tertiary fixed-top">
      <div className="container-fluid">
        <img
          src={logo}
          alt="logo"
          className="img-fluid"
          style={{ maxWidth: "200px" }}
        />
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-end"
          tabindex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                {!session ? (
                <>
                  <li className="nav-item ms-auto">
                    <button
                      type="button"
                      onClick={() => setIsOpenLogin((p) => !p)}
                      className="btn btn-primary"
                    >
                      <i className="fa-solid fa-user"></i>{" "}
                    </button>
                  </li>
                </>
              ) : (
                <div className="me-auto">
                  <li className="nav-item ">
                    <span className="nav-link text-dark">
                      Bienvenid@, {session.user.user_metadata.name}
                    </span>
                  </li>
                  <li className="nav-item">
                    <button
                      type="button"
                      onClick={() => handleLogout()}
                      className="btn btn-primary"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </div>
              )}
              {NAV_ELEMENTS.map(({ label, to }) => (
                <NavBarItem
                  key={to}
                  label={label}
                  to={to}
                  isDisabled={isDisabled}
                  shouldNotBeVisible={to === "/album" && !session}
                />
              ))}
            </ul>
             {isOpenLogin && <LoginForm />}
          </div>
        </div>
      </div>
    </nav>
  );
};
