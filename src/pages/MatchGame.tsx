import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import { useNavigate } from "react-router";
import type { Session } from "@supabase/supabase-js";
import { ConnectProvider, Connect } from "react-connect-lines";
import { DndContext } from "@dnd-kit/core";
import { shuffleStickers } from "../helpers/helpers";

// Las respuestas correctas
const correctAnswers: Record<string, string> = {
  fenec: "desierto",
  "dragon de komodo": "asia",
  "aguila harpia": "sonido",
  ajolote: "america del norte",
  "lince iberico": "bosque",
};

const normalize = (text: string) =>
  text
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Shuffle
const shuffleArray = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

// Sonidos
const playSound = (ok: boolean) => {
  const audio = new Audio(ok ? "/sounds/Win.mp3" : "/sounds/Lost.mp3");
  audio.play();
};

const MatchGame = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [wonStickers, setWonStickers] = useState([]);
  const [repeatedStickers, setRepeatedStickers] = useState([]);
  const [items, setItems] = useState({
    leftItems: [] as any[],
    rightItems: [] as any[],
  });

  const [connections, setConnections] = useState<
    { from: string; to: string }[]
  >([]);

  const navigate = useNavigate();

  // La sesion
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
    };

    init();

    const { data } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) navigate("/", { replace: true });
    });

    return () => data.subscription.unsubscribe();
  }, [navigate]);

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
    if (connections.length === 5) {
      unlockStickers();
    }
  }, [connections]);

  // Data
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("lastgame_animals")
        .select("*, habitat(*)");

      if (error) return console.error(error);

      const left = shuffleArray(
        data.map((item) => ({
          id: item.id,
          name: item.name,
          image_url: item.image_url,
        })),
      );

      const right = shuffleArray(
        data.flatMap((item) => [
          {
            id: `${item.id}-habitat`,
            value: normalize(item?.habitat?.name),
            image_url: item?.habitat?.image_url,
            type: "habitat",
          },
          {
            id: `${item.id}-region`,
            value: normalize(item?.region_names),
            image_url: item?.region_images,
            type: "region",
          },
          {
            id: `${item.id}-sound`,
            value: "sonido",
            sound_url: item?.animal_sounds,
            type: "sound",
          },
        ]),
      );

      setItems({ leftItems: left, rightItems: right });
    };

    fetchData();
  }, []);

  return (
    <>
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
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
      </div>
      <h3
        className="text-primary title"
        style={{
          fontWeight: 600,
          marginBottom: "10px",
          textAlign: "center",
          paddingTop: "2%",
        }}
      >
        Une las imágenes de la izquierda que pertenecen a la derecha de forma
        correcta arrastrando.
      </h3>
      <div className="wrapper">
        <DndContext>
          <ConnectProvider>
            {/* Left items */}
            <div className="game-container left">
              {items.leftItems.map((item) => {
                const sourceId = ` ${item.id}L`;
                console.log("🚀 ~ MatchGame ~ sourceId:", sourceId);
                const isConnected = connections.some(
                  (connection) => connection.from === sourceId,
                );

                return (
                  <Connect
                    key={`${item.id}L`}
                    id={`${item.id}L`}
                    connectWith={connections
                      .filter((c) => c.from === `${item.id}L`)
                      .map((c) => ({ id: c.to }))}
                  >
                    <div
                      className="card-item"
                      style={{ maxHeight: -"5px" }}
                      draggable={!isConnected}
                      onDragStart={(e) => {
                        console.log(
                          "🚀 ~ MatchGame ~ connections:",
                          connections,
                        );

                        if (isConnected) {
                          e.preventDefault();
                          return;
                        }
                        e.dataTransfer.setData("sourceId", `${item.id}L`);
                        e.dataTransfer.setData(
                          "sourceValue",
                          normalize(item.name),
                        );
                      }}
                    >
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="img-fluid"
                      />
                    </div>
                  </Connect>
                );
              })}
            </div>

            {/* Right items */}
            <div className="game-container right">
              {items.rightItems.map((item) => {
                return (
                  <Connect key={item.id} id={item.id}>
                    <div
                      id={item.id}
                      style={{display:"flex", justifyContent:"center"}}
                      className="card-item"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();

                        const sourceValue =
                          e.dataTransfer.getData("sourceValue");
                        const sourceId = e.dataTransfer.getData("sourceId");

                        if (!sourceValue || !sourceId) return;

                        const animal = normalize(sourceValue);

                        const target = normalize(item.value);

                        const expected = normalize(correctAnswers[animal]);

                        const isCorrect = expected === target;

                        playSound(isCorrect);

                        const el = document.getElementById(item.id);

                        if (!isCorrect) {
                          el?.classList.add("wrong");
                          setTimeout(() => el?.classList.remove("wrong"), 600);
                          return;
                        }

                        el?.classList.add("correct");
                        setTimeout(() => el?.classList.remove("correct"), 600);

                        setConnections((prev) => [
                          ...prev,
                          { from: sourceId, to: item.id },
                        ]);
                      }}
                    >
                      {item.image_url && (
                        <img src={item.image_url} alt={item.type}/>
                      )}

                      {item.sound_url && (
                        <audio controls style={{ width: "100%" }}>
                          <source src={item.sound_url} type="audio/mpeg" />
                        </audio>
                      )}
                    </div>
                  </Connect>
                );
              })}
              
            </div>
          </ConnectProvider>
        </DndContext>
      </div>
    </>
  );
};

export default MatchGame;
