import { useEffect, useState, useRef } from "react";
import supabase from "../lib/supabase";
import { type Session, useNavigate } from "react-router";
import { useStickers } from "../hooks/useStickers";
import { shuffleStickers } from "../helpers/helpers";

interface Card {
  id: string;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryPairs = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [wonStickers, setWonStickers] = useState([]);
  const [repeatedStickers, setRepeatedStickers] = useState([]);
  const navigator = useNavigate(); //para navegar con el router por cada page
  const { stickersImage } = useStickers(); // customhook para traer images

  const [cards, setCards] = useState<Card[]>([]); //almacenar cards o null
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const flipBackTimeoutRef = useRef<number | null>(null);

  // sonidos
  const flipSound = useRef<HTMLAudioElement | null>(null);

  const playMatchSound = () => {
    const sound = new Audio("/sounds/matchSound.mp3");
    sound.play();
  };

  const playWinSound = () => {
    const sound = new Audio("/sounds/Win.mp3");
    sound.play();
  };

  const playLoseSound = () => {
    const sound = new Audio("/sounds/Lost.mp3");
    sound.play();
  };

  // TIMER
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    flipSound.current = new Audio("/sounds/flipCard.wav");
  }, []);

  // detecta victoria + sonido
  useEffect(() => {
    const unlockStickers = async () => {
      const { data, error } = await supabase
        .from("user_stickers")
        .select("stickers_id")
        .eq("user_id", session?.user.id);

      if (error) {
        console.error("Error fetching user stickers:", error);
        return;
      }

      const { data: allStickers, error: allStickersError } = await supabase
        .from("stickers")
        .select("id, image_url");

      if (allStickersError) {
        console.error("Error fetching all stickers:", allStickersError);
        return;
      }

      const randomStickers = shuffleStickers(allStickers.map((s) => s.id), 3);

      const availableStickers = randomStickers.filter(
        (stickerId) =>
          !data?.some((userSticker) => userSticker.stickers_id === stickerId),
      );
      const wonStickersWithImage = allStickers.filter((s) =>
        availableStickers.includes(s.id),
      );
      setWonStickers(wonStickersWithImage);
      const repeated = randomStickers.filter((stickerId) =>
        data?.some((userSticker) => userSticker.stickers_id === stickerId),
      );
      const repeatedWithImage = allStickers.filter((s) =>
        repeated.includes(s.id),
      );
      setRepeatedStickers(repeatedWithImage);

      if (availableStickers.length === 0) {
        console.log("No new stickers to unlock");
      }

      if (availableStickers.length > 0) {
        console.log("Unlocking stickers:", availableStickers);
        const { data: insertData, error: insertError } = await supabase
          .from("user_stickers")
          .insert(
            availableStickers.map((stickerId) => ({
              user_id: session?.user.id,
              stickers_id: stickerId,
            })),
          );
      }
    };

    if (cards.length > 0 && cards.every((c) => c.isMatched)) {
      setGameWon(true);
      unlockStickers();
      playWinSound();
    }
  }, [cards]);

  // TIMER CORRECTO
  useEffect(() => {
    if (gameOver || gameWon) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1 && !gameWon) {
          clearInterval(timer);
          setGameOver(true);
          playLoseSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, gameWon]);

  useEffect(() => {
    return () => {
      if (flipBackTimeoutRef.current) {
        clearTimeout(flipBackTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);

        if (!session) {
          navigator("/", { replace: true });
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigator]);

  useEffect(() => {
    if (stickersImage.length === 0) return;

    const flatStickers = stickersImage.flat();

    const newCards: Card[] = flatStickers.map((sticker, index) => ({
      id: `${sticker}_${index}`,
      image: sticker,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(newCards);
  }, [stickersImage]);

  const handleCardClick = (card: Card) => {
    if (gameOver || gameWon) return;
    if (card.isFlipped || card.isMatched) return;
    if (selectedCards.length >= 2) return;

    // flip
    if (flipSound.current) {
      flipSound.current.currentTime = 0;
      flipSound.current.play();
    }

    const updatedCards = cards.map((c) =>
      c.id === card.id ? { ...c, isFlipped: true } : c,
    );

    setCards(updatedCards);

    const newSelectedCards = [...selectedCards, { ...card, isFlipped: true }];
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 1) {
      if (flipBackTimeoutRef.current) {
        clearTimeout(flipBackTimeoutRef.current);
      }

      flipBackTimeoutRef.current = window.setTimeout(() => {
        setSelectedCards((prevSelected) => {
          if (prevSelected.length !== 1) return prevSelected;

          const [onlyCard] = prevSelected;
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.id === onlyCard.id ? { ...c, isFlipped: false } : c,
            ),
          );

          return [];
        });
      }, 2000);
    }

    if (newSelectedCards.length !== 2) return;

    const [firstCard, secondCard] = newSelectedCards;

    if (firstCard.image === secondCard.image) {
      playMatchSound();

      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.id === firstCard.id || c.id === secondCard.id
              ? { ...c, isMatched: true }
              : c,
          ),
        );
        setSelectedCards([]);
      }, 500);
    } else {
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((c) =>
            c.id === firstCard.id || c.id === secondCard.id
              ? { ...c, isFlipped: false }
              : c,
          ),
        );

        setSelectedCards([]);
      }, 1000);
    }
  };

  return (
    <div
      className="container"
      style={{ maxWidth: "1000px" }}
    >
      
      <h1 style={{textAlign:"center", fontWeight:"bold"}}> Memory Pairs </h1>

      <h2  className="text-primary"style={{fontWeight:500, marginBottom:"10px"}}>Encuentra todas las parejas antes de terminar el tiempo.</h2>
      {/* TIMER */}
      <h3>TIME: {timeLeft}s</h3>
     

      {gameOver && !gameWon && <h2 style={{ color: "red" }}>GAME OVER</h2>}
      {gameWon && <h2 style={{ color: "green" }}>YOU WIN</h2>}

      {wonStickers.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
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
        <div style={{ marginBottom: "20px" }}>
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

      {/* RESTART */}
      {(gameOver || gameWon) && (
        <div
          style={{
            marginTop: "30px",
            marginBottom: "20px",
            display: "flex",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Reiniciar
          </button>
          <button
            className="btn btn-success" onClick={() => navigator("/album")}>
              Ir al album
            </button>
        </div>
      )}

      <div className="row row-cols-5 g-3">
        {cards.map((card) => (
          <div key={card.id} className="col">
            <div className="memory-card" onClick={() => handleCardClick(card)}>
              <div
                className={`card-inner ${
                  card.isFlipped || card.isMatched ? "flipped" : ""
                }`}
              >
                <div className="card-front">
                  <img src={card.image} alt="sticker" className="img-fluid" />
                </div>

                <div className="card-back bg-secondary"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryPairs;
