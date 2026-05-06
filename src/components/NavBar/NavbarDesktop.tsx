import { useEffect, useState } from "react";
import { NAV_ELEMENTS } from "../../consts/consts";
import { LoginForm } from "../Forms/LoginForm";
import { NavBarItem } from "./NavBarItem";
import supabase from "../../lib/supabase";
import logo from "../../assets/logo.png";
import { useAuth } from "../../hooks/useAuth";
import { useLocation } from "react-router";
import type { Session } from "@supabase/supabase-js";

export const NavbarDesktop = () => {
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const location = useLocation();

  const isDisabled = !NAV_ELEMENTS.some(({ to }) => to === location.pathname); 

  const {
    handleLogout,
  } = useAuth();

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
    <>
      <ul className="nav nav-tabs bg-light">
        <div className="d-flex container">
          <li>
            <img src={logo} alt="logo" className="img-fluid" style={{maxWidth: "200px"}}/>
          </li>
          {NAV_ELEMENTS.map(({ label, to }) => (
            <NavBarItem key={to} label={label} to={to} isDisabled={isDisabled} shouldNotBeVisible={to === "/album" && !session} />
          ))}
          {!session ? (
            <>
              <li className="nav-item ms-auto">
                <button
                  type="button"
                  onClick={() => setIsOpenLogin((p) => !p)}
                  className="btn btn-lg btn-primary mt-4"
                >
                  <i className="fa-solid fa-user"></i>{" "}
                </button>
              </li>
            </>
          ) : (
            <div className="ms-auto d-flex">
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
        </div>
      </ul>
      {isOpenLogin && <LoginForm />}
    </>
  );
}
