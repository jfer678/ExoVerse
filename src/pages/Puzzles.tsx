import { useNavigate } from "react-router";
import { usePuzzles } from "../hooks/usePuzzles";

const Puzzles = () => {
  const {
    wonStickers,
    isMobile,
    isTablet,
    repeatedStickers,
    puzzleImageURL,
    isSolved,
    handlenextpuzzle,
    puzzleCount,
    gridSize,
    pieceSize,
    pieces,
    movePiece,
  } = usePuzzles();
  const navigator = useNavigate();
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "85dvh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        paddingTop: isMobile ? "100px" : isTablet ? "70px" : "80px",
        boxSizing: "border-box",
      }}
    >
      {wonStickers.length > 0 && (
        <div
          style={{
            marginBottom: "20px",
            position: "absolute",
            zIndex: 10,
            top: "55%",
            right: "10%",
          }}
        >
          <h4>Nuevos Stickers:</h4>
          <div style={{ display: "flex", gap: "10px" }}>
            {wonStickers.map((sticker) => (
              <img
                key={sticker.id}
                src={sticker.image_url}
                alt="Nuevo Sticker"
                style={{ width: "100px", height: "auto" }}
              />
            ))}
          </div>
        </div>
      )}

      {repeatedStickers.length > 0 && (
        <div
          style={{
            marginBottom: "20px",
            position: "absolute",
            zIndex: 10,
            top: "30%",
            right: "10%",
          }}
        >
          <h4>Stickers Repetidos:</h4>
          <div style={{ display: "flex", gap: "10px" }}>
            {repeatedStickers.map((sticker) => (
              <img
                key={sticker.id}
                src={sticker.image_url}
                alt="Sticker Repetido"
                style={{ width: "100px", height: "auto" }}
              />
            ))}
          </div>
        </div>
      )}
      {/* Responsive */}
      <div
        style={{
          position: isMobile || isTablet ? "relative" : "absolute",
          left: isMobile || isTablet ? "0" : "4%",
          top: isMobile || isTablet ? "0" : "44%",
          transform: isMobile || isTablet ? "none" : "translateY(-50%)",
          textAlign: "center",
          marginBottom: isMobile || isTablet ? "18px" : "0px",
          marginTop:isMobile || isTablet ? "200px" : "0px",
          zIndex: 2,
        }}
      >
        {puzzleImageURL && (
          <img
            src={puzzleImageURL}
            alt="Referencia"
            style={{
              width: isMobile ? "150px" : isTablet ? "200px" : "250px",
              height: isMobile ? "150px" : isTablet ? "150px" : "150px",
              objectFit: "cover",
              borderRadius: "12px",
              border: "3px solid rgba(255,255,255,0.1)",
            }}
          />
        )}
      </div>

      {/* TITLE */}
      <h1
        style={{
          marginBottom: "30px",
          fontSize: isMobile ? "1.6rem" : isTablet ? "2rem" : "2.5rem",
          fontWeight: "bold",
        }}
      >
        Rompecabezas
      </h1>
      {puzzleCount === 0 && (
        <h2
          className="text-white"
          style={{ fontWeight: 500, marginBottom: "10px" }}
        >
          Resuelve los 3 rompecabezas para desbloquear stickers
        </h2>
      )}
      <h4 className="text-danger">{puzzleCount}/3 </h4>

      {isSolved && (
        <h2 style={{ color: "#4ade80", marginBottom: "20px" }}>
          ¡Excelente! Completaste
        </h2>
      )}

      {/* PUZZLE */}
      {!puzzleImageURL ? (
        <p>Cargando ...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, ${pieceSize}px)`,
            gridTemplateRows: `repeat(${gridSize}, ${pieceSize}px)`,
            transform: isMobile || isTablet ? "scale(0.9)" : "scaleX(1.5)",
            gap: "10px",
            padding: "15px",
            paddingTop: "22px",
            paddingBottom: "22px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "15px",
            boxShadow: "0 2px 40px rgb(255, 255, 255)",
            marginTop: isMobile || isTablet ? "10px" : "20px",
          }}
        >
          {pieces.map((piece, index) => {
            const total = gridSize * gridSize;
            const isPieceEmpty = piece === total - 1;

            const row = Math.floor(piece / gridSize);
            const col = piece % gridSize;

            return (
              <div
                key={index}
                onClick={() => movePiece(index)}
                style={{
                  width: `${pieceSize}px`,
                  height: `${pieceSize}px`,
                  borderRadius: "8px",
                  cursor: isPieceEmpty || isSolved ? "default" : "pointer",
                  backgroundColor: isPieceEmpty ? "#ffffff" : "transparent",
                  backgroundImage:
                    isPieceEmpty && !isSolved
                      ? "none"
                      : `url(${puzzleImageURL})`,
                  backgroundSize: `${
                    gridSize * pieceSize
                  }px ${gridSize * pieceSize}px`,
                  backgroundPosition: `-${col * pieceSize}px -${
                    row * pieceSize
                  }px`,
                  opacity: isPieceEmpty && !isSolved ? 0.3 : 1,
                }}
              />
            );
          })}
        </div>
      )}

      {/* BOTÓN */}
      {isSolved && puzzleCount < 3 && (
        <button
          onClick={() => handlenextpuzzle()}
          style={{
            marginTop: "40px",
            marginBottom: "90px",
            padding: "12px 24px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "999px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Siguiente
        </button>
      )}
      
    </div>
  );
};

export default Puzzles;
