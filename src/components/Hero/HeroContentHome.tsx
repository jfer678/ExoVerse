import { HeroButton } from "./HeroButton";

const BUTTONS = [
  {
    label: "Explorar",
    customStyles: { color: "ev-bg-primary", backgroundColor: "ev-text-light" },
  },
  {
    label: "Jugar Ahora",
    customStyles: { color: "ev-bg-secondary", backgroundColor: "ev-text-dark" },
  },
];

export const HeroContentHome = () => {
  return (
    <div
      className="d-flex gap-3"
      style={{
        transform: "translateY(300px)",
      }}
    >
      {BUTTONS.map((button, index) => (
        <HeroButton
          key={`hero_button_${index}`}
          label={button.label}
          customStyles={button.customStyles}
        />
      ))}
    </div>
  );
};