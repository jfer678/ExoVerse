import { useState, useEffect } from "react";
import { useQuestions } from "../hooks/useQuestions";
import supabase from "../lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router";
import { shuffleStickers } from "../helpers/helpers";

const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const QuestionsGame = () => {
  const [session, setSession] = useState<Session | null>(null);
  const navigator = useNavigate();
  const questions = useQuestions(); //custom hook

  const [wonStickers, setWonStickers] = useState([]);
  const [repeatedStickers, setRepeatedStickers] = useState([]);

  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]); //estado random questions
  const [currentIndex, setCurrentIndex] = useState(0); //pregunta actual
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null); //opcion selected
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  //Sonidos
  const playCorrectSound = () => {
    const sound = new Audio("/sounds/matchSound.mp3");
    sound.currentTime = 0;
    sound.play();
  };

  const playWrongSound = () => {
    const sound = new Audio("/sounds/Lost.mp3");
    sound.currentTime = 0;
    sound.play();
  };

  const playWinSound = () => {
    const sound = new Audio("/sounds/Win.mp3");
    sound.currentTime = 0;
    sound.play();
  };

  // Mezclar preguntas al cargar
  useEffect(() => {
    if (questions.length > 0) {
      const shuffled = shuffleArray(questions).map((q) => ({
        ...q,
        question_options: shuffleArray(q.question_options),
      }));
      setShuffledQuestions(shuffled);
    }
  }, [questions]);

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

  // Lógica para el sonido de victoria al terminar con 10/10
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

      const randomStickers = shuffleStickers(
        allStickers.map((s) => s.id),
        3,
      );

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

    if (
      finished &&
      score === shuffledQuestions.length &&
      shuffledQuestions.length > 0
    ) {
      playWinSound();
      unlockStickers();
    }
  }, [finished, score, shuffledQuestions.length]);

  if (!shuffledQuestions || shuffledQuestions.length === 0) {
    return <h2></h2>;
  }

  const currentQuestion = shuffledQuestions[currentIndex];

  const handleAnswer = async (option: any) => {
    if (selectedOptionId) return;

    setSelectedOptionId(option.id);
    const isCorrect = option.id === currentQuestion.test_correct_option_id;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      playCorrectSound();
    } else {
      playWrongSound();
    }

    // Guardar en Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("answers").insert({
      user_id: user?.id,
      question_id: currentQuestion.id,
      selected_option_id: option.id,
      is_correct: isCorrect,
    });

    setTimeout(() => {
      if (currentIndex + 1 < shuffledQuestions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOptionId(null);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  if (finished) {
    return (
      <div className="container text-center mt-5">
        {wonStickers.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h4>Nuevos Stickers:</h4>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
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
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
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
        <h2>Juego terminado</h2>
        <h3>
          Puntaje: {score} / {shuffledQuestions.length}
        </h3>
        {score !== shuffledQuestions.length && (
          <p className="text-danger fw-bold">Intentalo de nuevo</p>
        )}
        {score === shuffledQuestions.length && (
          <p className="text-success fw-bold">¡Perfecto! Ganaste</p>
        )}
        <button
          className="btn btn-primary mt-3"
          onClick={() => window.location.reload()}
        >
          Reiniciar
        </button>
        <button
          className="btn btn-success mt-3 ms-3"
          onClick={() => navigator("/album")}
        >
          Ir al album
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div style={{ textAlign: "center", maxWidth: "900px", margin: "0 auto"  }}>
        <h3 className="text-primary"style={{fontWeight:"bold", marginBottom:"50px"}}>Obten puntaje perfecto para desbloquear stickers</h3>

        <h4>
          Pregunta {currentIndex + 1} / {shuffledQuestions.length}
        </h4>
        <h2 className="mb-4">{currentQuestion.question_text}</h2>
      </div>

      <div
        className="d-grid gap-3"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        {currentQuestion.question_options?.map((option: any) => {
          const isSelected = option.id === selectedOptionId;
          const isCorrect =
            option.id === currentQuestion.test_correct_option_id;

          let btnClass = "btn btn-outline-dark";
          if (selectedOptionId) {
            if (isCorrect) btnClass = "btn btn-success";
            else if (isSelected) btnClass = "btn btn-danger";
          }

          return (
            <button
              key={option.id}
              className={btnClass}
              onClick={() => handleAnswer(option)}
            >
              {option.option_text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionsGame;
