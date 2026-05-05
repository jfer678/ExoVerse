import { useEffect, useState } from "react";
import { NavbarDesktop } from "./NavbarDesktop";
import { NavbarMobile } from "./NavbarMobile";


export const NavBar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 968);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 968);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isMobile ? (<NavbarMobile/>) : (<NavbarDesktop />)}
    </>
  );
};
