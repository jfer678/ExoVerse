import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { shuffleStickers } from "../helpers/helpers";
import { useNavigate } from "react-router";

interface Sticker {
  id: string;
  image_url: string;
}

export const usePuzzles = () => {
  const [puzzleCount, setPuzzleCount] = useState(0);

  const [session, setSession] = useState<Session | null>(null);

  const [puzzleImageURL, setPuzzleImageURL] = useState<string | null>(null);

  const [allPuzzles, setAllPuzzles] = useState<any[]>([]);
  const [usedPuzzles, setUsedPuzzles] = useState<string[]>([]);

  const [gridSize] = useState(3);

  const navigate = useNavigate();

  const [pieces, setPieces] = useState<number[]>([]);
  const [emptyIndex, setEmptyIndex] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  const [wonStickers, setWonStickers] = useState<Sticker[]>([]);
  const [repeatedStickers, setRepeatedStickers] = useState<Sticker[]>([]);

  // Screen size
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth < 600;
  const isTablet = screenWidth >= 600 && screenWidth < 1024;

  const pieceSize = isMobile ? 100 : isTablet ? 200 : 150;

  // Autenticacion
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

  // Trae la imagen del puzzle de BD
  useEffect(() => {
    const fetchAllPuzzles = async () => {
      const { data } = await supabase
        .from("puzzles_images")
        .select("image_url");

      if (!data || data.length === 0) return;

      setAllPuzzles(data);

      // Primer puzzle como random
      const randomIndex = Math.floor(Math.random() * data.length);
      const first = data[randomIndex].image_url;

      setPuzzleImageURL(first);
      setUsedPuzzles([first]); // 
    };

    fetchAllPuzzles();
  }, []);

  // Sin repetir puzzles
  const getRandomPuzzle = () => {
    const available = allPuzzles.filter(
      (p) => !usedPuzzles.includes(p.image_url)
    );

    if (available.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex].image_url;
  };

  // Siguiente puzzle
  const handlenextpuzzle = () => {
    const newPuzzle = getRandomPuzzle();

    if (!newPuzzle) {
      console.log("No hay más puzzles disponibles");
      return;
    }

    setPuzzleImageURL(newPuzzle);
    setUsedPuzzles((prev) => [...prev, newPuzzle]);
    setIsSolved(false);
  };

  // Stickers 
  useEffect(() => {
    if (!session) return;

    const unlockStickers = async () => {
      const { data, error } = await supabase
        .from("user_stickers")
        .select("stickers_id")
        .eq("user_id", session.user.id);

      if (error) return;

      const { data: allStickers } = await supabase
        .from("stickers")
        .select("id, image_url");

      if (!allStickers) return;

      const randomStickers = shuffleStickers(
        allStickers.map((s) => s.id),
        3
      );

      const availableStickers = randomStickers.filter(
        (id) => !data?.some((s) => s.stickers_id === id)
      );

      const won = allStickers.filter((s) =>
        availableStickers.includes(s.id)
      );
      setWonStickers(won);

      const repeated = randomStickers.filter((id) =>
        data?.some((s) => s.stickers_id === id)
      );

      const repeatedWithImage = allStickers.filter((s) =>
        repeated.includes(s.id)
      );
      setRepeatedStickers(repeatedWithImage);

      if (availableStickers.length > 0) {
        await supabase.from("user_stickers").insert(
          availableStickers.map((id) => ({
            user_id: session.user.id,
            stickers_id: id,
          }))
        );
      }
    };

    if (isSolved && puzzleCount > 2) unlockStickers();
  }, [isSolved, session, puzzleCount]);

  // Para generar puzzles, logica de siempre posible 
  useEffect(() => {
    if (!puzzleImageURL) return;

    const total = gridSize * gridSize;
    const arr = Array.from({ length: total }, (_, i) => i);
    let currentEmpty = total - 1;

    for (let i = 0; i < 100; i++) {
      const neighbors = [];
      const row = Math.floor(currentEmpty / gridSize);
      const col = currentEmpty % gridSize;

      if (row > 0) neighbors.push(currentEmpty - gridSize);
      if (row < gridSize - 1) neighbors.push(currentEmpty + gridSize);
      if (col > 0) neighbors.push(currentEmpty - 1);
      if (col < gridSize - 1) neighbors.push(currentEmpty + 1);

      const moveTo = neighbors[Math.floor(Math.random() * neighbors.length)];

      [arr[currentEmpty], arr[moveTo]] = [arr[moveTo], arr[currentEmpty]];
      currentEmpty = moveTo;
    }

    setPieces(arr);
    setEmptyIndex(currentEmpty);
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
    if (arr.every((val, i) => val === i)) {
      setIsSolved(true);
      setPuzzleCount((prev) => prev + 1);
    }
  };

  return {
    wonStickers,
    isMobile,
    isTablet,
    repeatedStickers,
    puzzleImageURL,
    isSolved,
    handlenextpuzzle,
    puzzleCount,
    gridSize,
    pieces,
    pieceSize,
    movePiece,
  };
};