import type { JSX } from "react";

interface HeroProps {
  img: string;
  children: JSX.Element;
  backgroundSize?: string; 
  minHeight?: string;
  fullWidth?: boolean;
}

export const Hero = ({ children, img, backgroundSize = "cover", minHeight = "clamp(300px, 60vh, 700px)", fullWidth = false}: HeroProps) => {
  return (
    <div
      className={`${fullWidth ? "w-100" : "vh-100"} d-flex align-items-center justify-content-center text-white bg-secondary`}
      style={{
        minHeight: fullWidth ? minHeight : "",
        backgroundImage: `url(${img})`,
        backgroundSize: backgroundSize,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
      }}
    >
      {children}
    </div>
  );
};
