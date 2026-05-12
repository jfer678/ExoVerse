interface GameCardProps {
    session: any;
    imageSrc: string;
    gameName?: string;
    redirectFunction: (game: string) => void;
}

export const GameCard = ({session, imageSrc, redirectFunction, gameName = ""}:GameCardProps) => {
  return (
    <div className="ev-square-cards">
      <img
        src={imageSrc}
        alt="memory pairs image"
        className="img-fluid"
      />
      {session && (
        <button
          onClick={() => redirectFunction(gameName)}
          type="button"
          className="btn btn-primary position-absolute bottom-0 end-0 m-3"
        >
          Jugar
        </button>
      )}
    </div>
  );
};
