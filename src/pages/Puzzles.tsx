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

  // 📱 Detectar pantalla
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth < 640;
  const isTablet = screenWidth >= 640 && screenWidth < 1024;

  // 🔐 Auth
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
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, [navigate]);

  // 🖼️ Imagen
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

  // 🧩 Puzzle init
  useEffect(() => {
    if (!puzzleImageURL) return;

    const total = gridSize * gridSize;
    let arr = Array.from({ length: total }, (_, i) => i);
    let currentEmpty = total - 1;

    for (let i = 0; i < 100; i++) {
      const neighbors = [];
      const row = Math.floor(currentEmpty / gridSize);
      const col = currentEmpty % gridSize;

      if (row > 0) neighbors.push(currentEmpty - gridSize);
      if (row < gridSize - 1) neighbors.push(currentEmpty + gridSize);
      if (col > 0) neighbors.push(currentEmpty - 1);
      if (col < gridSize - 1) neighbors.push(currentEmpty + 1);

      const moveTo =
        neighbors[Math.floor(Math.random() * neighbors.length)];

      [arr[currentEmpty], arr[moveTo]] = [
        arr[moveTo],
        arr[currentEmpty],
      ];

      currentEmpty = moveTo;
    }

    setPieces(arr);
    setEmptyIndex(currentEmpty);
    setIsSolved(false);
  }, [puzzleImageURL, gridSize]);

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
    if (arr.every((val, i) => val === i)) setIsSolved(true);
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
        paddingTop: isMobile ? "100px" : isTablet ? "70px" : "0px",
        boxSizing: "border-box",
      }}
    >
      {/* 🧠 REFERENCIA (SOLO FIX RESPONSIVE) */}
      <div
        style={{
          position: isMobile || isTablet ? "relative" : "absolute",

          left: isMobile || isTablet ? "0" : "300px",
          top: isMobile || isTablet ? "0" : "36%",

          transform:
            isMobile || isTablet ? "none" : "translateY(-50%)",

          textAlign: "center",

          // 🔥 CLAVE: separa del puzzle en mobile/tablet
          marginBottom: isMobile || isTablet ? "25px" : "0px",

          zIndex: 2,
        }}
      >
        {puzzleImageURL && (
          <img
            src={puzzleImageURL}
            alt="Referencia"
            style={{
              width: isMobile
                ? "120px"
                : isTablet
                ? "180px"
                : "250px",
              height: isMobile
                ? "80px"
                : isTablet
                ? "120px"
                : "150px",
              objectFit: "cover",
              borderRadius: "12px",
              border: "3px solid rgba(255,255,255,0.1)",
            }}
          />
        )}
      </div>

      {/* 🧠 TÍTULO (NO SE TOCA) */}
      <h1
        style={{
          marginBottom: "30px",
          fontSize: isMobile ? "1.6rem" : isTablet ? "2rem" : "2.5rem",
          fontWeight: "bold",
        }}
      >
        Rompecabezas
      </h1>

      {isSolved && (
        <h2 style={{ color: "#4ade80", marginBottom: "20px" }}>
          ¡Excelente! Completaste
        </h2>
      )}

      {/* 🧩 PUZZLE */}
      {!puzzleImageURL ? (
        <p>Cargando ...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, ${pieceSize}px)`,
            gridTemplateRows: `repeat(${gridSize}, ${pieceSize}px)`,

            transform: isMobile ? "scale(1)" : "scaleX(1.5)",

            gap: "10px",
            padding: "15px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "15px",
            boxShadow: "0 2px 40px rgb(255, 255, 255)",
            marginTop: isMobile || isTablet ? "10px" : "0px",
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
                  cursor:
                    isPieceEmpty || isSolved
                      ? "default"
                      : "pointer",
                  backgroundColor: isPieceEmpty
                    ? "#ffffff"
                    : "transparent",
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

      {/* 🏁 BOTÓN */}
      {isSolved && (
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: "40px",
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