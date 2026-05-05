interface HeroButtonProps {
  label: string;
  customStyles?: {
    backgroundColor?: string;
    color?: string;
  };
  onClick?: () => void;
}

export const HeroButton = (props: HeroButtonProps) => {
  const { label, customStyles, onClick } = props;

  return (
    <button
      onClick={onClick}
      className={`ev-game-btn ${customStyles?.backgroundColor || ''} ${customStyles?.color || ''}`}
    >
      {label}
    </button>
  );
};
