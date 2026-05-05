import { NavLink } from "react-router";

interface NavBarItemProps {
  to: string;
  label: string;
  isDisabled?: boolean;
  shouldNotBeVisible?: boolean;
}

export const NavBarItem = ({
  to,
  label,
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
                isActive ? "nav-link active text-center" : "nav-link text-primary text-center"
              }
              style={{
                fontSize: "28px",
              }}
            >
              {label}
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
