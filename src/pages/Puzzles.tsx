import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router";

const Puzzles = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [puzzleImageURL, setPuzzleImageURL] = useState<string | null>(null);

  const [gridSize] = useState(3);
  const pieceSize = 150;

  const [pieces, setPieces] = useState<number[]>([]);
  const [emptyIndex, setEmptyIndex] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  const navigate = useNavigate();

  // Autenticación de usuarios
  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) navigate("/", { replace: true });
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, [navigate]);

  // Obtener imágenes de la BD
  useEffect(() => {
    const fetchPuzzleImage = async () => {
      const { data, error } = await supabase
        .from("puzzles_images")
        .select("image_url");
      if (error || !data || data.length === 0) return;

      const randomIndex = Math.floor(Math.random() * data.length);
      setPuzzleImageURL(data[randomIndex].image_url);
    };

    fetchPuzzleImage();
  }, []);

  // Inicialización del Puzzle
  useEffect(() => {
    if (!puzzleImageURL) return;

    const total = gridSize * gridSize;
    let arr = Array.from({ length: total }, (_, i) => i);
    let currentEmpty = total - 1;

    // Simula movimientos reales para garantizar solución
    const shuffleMoves = 100;
    for (let i = 0; i < shuffleMoves; i++) {
      const neighbors = [];
      const row = Math.floor(currentEmpty / gridSize);
      const col = currentEmpty % gridSize;

      if (row > 0) neighbors.push(currentEmpty - gridSize); // Arriba
      if (row < gridSize - 1) neighbors.push(currentEmpty + gridSize); // Abajo
      if (col > 0) neighbors.push(currentEmpty - 1); // Izquierda
      if (col < gridSize - 1) neighbors.push(currentEmpty + 1); // Derecha

      const moveToIndex =
        neighbors[Math.floor(Math.random() * neighbors.length)];
      [arr[currentEmpty], arr[moveToIndex]] = [
        arr[moveToIndex],
        arr[currentEmpty],
      ];
      currentEmpty = moveToIndex;
    }

    setPieces(arr);
    setEmptyIndex(currentEmpty);
    setIsSolved(false);
  }, [puzzleImageURL, gridSize]);

  // Movimiento de las piezas
  const movePiece = (index: number) => {
    if (emptyIndex === null || isSolved) return;

    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    const isAdjacent =
      Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

    if (isAdjacent) {
      const newPieces = [...pieces];
      [newPieces[index], newPieces[emptyIndex]] = [
        newPieces[emptyIndex],
        newPieces[index],
      ];

      setPieces(newPieces);
      setEmptyIndex(index);
      checkIfSolved(newPieces);
    }
  };

  const checkIfSolved = (arr: number[]) => {
    const solved = arr.every((val, i) => val === i);
    if (solved) setIsSolved(true);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      {/* Referencia  */}
      <div
        style={{
          position: "absolute",
          left: "300px",
          top: "36%",
          transform: "translateY(-50%)",
          textAlign: "center",
        }}
      >
        <p style={{ marginBottom: "10px", fontSize: "14px", opacity: 0.8 }}></p>
        {puzzleImageURL && (
          <img
            src={puzzleImageURL}
            alt="Referencia"
            style={{
              width: "250px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "12px",
              border: "3px solid rgba(255,255,255,0.1)",
            }}
          />
        )}
      </div>

      <h1
        style={{ marginBottom: "30px", fontSize: "2.5rem", fontWeight: "bold" }}
      >
        Rompecabezas
      </h1>

      {isSolved && (
        <h2
          style={{
            color: "#4ade80",
            marginBottom: "20px",
            animation: "bounce 1s infinite",
          }}
        >
          ¡Excelente! Completaste
        </h2>
      )}

      {!puzzleImageURL ? (
        <p>Cargando ...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, ${pieceSize}px)`,
            gridTemplateRows: `repeat(${gridSize}, ${pieceSize}px)`,
            transform: "scaleX(1.5)",
            gap: "10px",
            padding: "15px",
            paddingTop: "20px",
            paddingBottom: "20px",
            paddingLeft: "15px",
            paddingRight: "15px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "15px",
            boxShadow: "0 2px 40px rgb(255, 255, 255)",
          }}
        >
          {pieces.map((piece, index) => {
            const total = gridSize * gridSize;
            const isPieceEmpty = piece === total - 1;

            // Coordenadas de la imagen original
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
                  transition: "background-color 0.3s ease",
                  backgroundColor: isPieceEmpty ? "#ffffff" : "transparent",
                  backgroundImage:
                    isPieceEmpty && !isSolved
                      ? "none"
                      : `url(${puzzleImageURL})`,
                  backgroundSize: `${gridSize * pieceSize}px ${gridSize * pieceSize}px`,
                  backgroundPosition: `-${col * pieceSize}px -${row * pieceSize}px`,
                  opacity: isPieceEmpty && !isSolved ? 0.3 : 1,
                  transform: isPieceEmpty ? "scale(1)" : "scale(1)",
                }}
              />
            );
          })}
        </div>
      )}

      {isSolved && (
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "40px",
            padding: "12px 24px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "full",
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
