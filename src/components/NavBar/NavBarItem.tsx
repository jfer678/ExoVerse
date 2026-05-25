import type { JSX } from "react";
import { NavLink } from "react-router";

interface NavBarItemProps {
  to: string;
  label: string;
  icon: JSX.Element;
  isDisabled?: boolean;
  shouldNotBeVisible?: boolean;
}

export const NavBarItem = ({
  to,
  label,
  icon,
  isDisabled = false,
  shouldNotBeVisible = false,
}: NavBarItemProps) => {
  return (
    <>
      {!shouldNotBeVisible && (
        <li className="nav-item">
          {!isDisabled ? (
            <NavLink
              to={to}
              className={({ isActive }) =>
                isActive ? "nav-link active text-center text-light bg-success" : "nav-link text-primary text-center"
              }
              style={{
                fontSize: "28px",
                borderRadius: "25px",
                maxWidth: "200px",
                margin: "0 auto",
              }}
            >
              {icon}{" "}{label}
            </NavLink>
          ) : (
            <span className="nav-link disabled" style={{ fontSize: "28px" }}>
              {label}
            </span>
          )}
        </li>
      )}
    </>
  );
};
