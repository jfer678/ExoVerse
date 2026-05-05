import HTMLFlipBook from "react-pageflip";
import cover from "../assets/PortadaAlbum.jpg";
import whitepage from "../assets/HojaenBlanco.jpg";
import pag1 from "../assets/Pagina1.jpg";
import pag2 from "../assets/Pagina2.jpg";
import pag3 from "../assets/Pagina3.jpg";
import pag4 from "../assets/Pagina4.jpg";
import backcover from "../assets/Contraportada.jpg";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Session } from "@supabase/supabase-js";
import supabase from "../lib/supabase";

const PAGE_RATIO = 9 / 16;

export const Album = () => {
  const [newStickers, setNewStickers] = useState<any[]>([]);
  const [attachedStickers, setAttachedStickers] = useState<any[]>([]);
  const [allStickers, setAllStickers] = useState<any[]>({
    reptiles: [],
    anfibios: [],
    aves: [],
    mamiferos: [],
  });
  const [session, setSession] = useState<Session | null>(null);
  const [size, setSize] = useState({
    width: 360,
    height: 640,
  });
  const navigator = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const availableHeight = window.innerHeight - 200;
      const height = Math.min(availableHeight, 620);
      const width = height * PAGE_RATIO;
      setSize({
        width,
        height,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    const fetchAllStickers = async () => {
      if (allStickers.reptiles.length > 0) return;
      const { data, error } = await supabase
        .from("stickers")
        .select("*,album_sections(*)");

      if (error) {
        console.error("Error fetching stickers", error);
        return;
      }

      const reptilesSection =
        data?.filter(
          (sticker) => sticker.album_sections.title === "Reptiles",
        ) || [];
      const anfibiosSection =
        data?.filter(
          (sticker) => sticker.album_sections.title === "Anfibios",
        ) || [];
      const avesSection =
        data?.filter((sticker) => sticker.album_sections.title === "Aves") ||
        [];
      const mamiferosSection =
        data?.filter(
          (sticker) => sticker.album_sections.title === "Mamíferos",
        ) || [];

      setAllStickers({
        reptiles: reptilesSection,
        anfibios: anfibiosSection,
        aves: avesSection,
        mamiferos: mamiferosSection,
      });
    };

    fetchAllStickers();
  }, []);

  useEffect(() => {
    if (!session) return;
    const fetchStickers = async () => {
      const { data, error } = await supabase
        .from("user_stickers")
        .select("*, stickers(*)")
        .eq("user_id", session.user.id);
      if (error) {
        console.error("Error fetching stickers");
        return;
      }

      const stickers =
        data
          ?.filter((item) => !item.is_sticker_paste)
          .map((item) => ({ ...item.stickers })) || [];
      const attached =
        data
          ?.filter((item) => item.is_sticker_paste)
          .map((item) => ({ ...item.stickers })) || [];
      setNewStickers(stickers);
      setAttachedStickers(attached.map((sticker) => sticker.id));
    };
    if (newStickers.length === 0 && attachedStickers.length === 0) {
      fetchStickers();
    }
  }, [session]);

  const handleAttachSticker = async (
    stickerId: string,
    targetStickerId: string,
  ) => {
    console.log("🚀 ~ handleAttachSticker ~ stickerId:", stickerId)
    if (!session) return;

    if (stickerId !== targetStickerId) {
      alert("¡Solo puedes pegar el sticker en su lugar correspondiente!");
      return;
    }

    console.log("🚀 ~ handleAttachSticker ~ session:", session.user.id)
    const { data, error } = await supabase.from("user_stickers").update({is_sticker_paste: true}).eq("user_id", session.user.id.trim()).eq("stickers_id", stickerId.trim()).select("*")

    console.log("🚀 ~ handleAttachSticker ~ data:", data)

    setAttachedStickers((prev) => [...prev, stickerId]);

    setNewStickers((prev) =>
      prev.filter((sticker) => sticker.id !== stickerId),
    );

    if (error) {
      console.error("Error attaching sticker", error);
    }
  };

  return (
    <>
      <div className="container">
        {newStickers.length > 0 && (
          <div style={{ marginBottom: "20px"  }}>
            <h3 style= {{fontWeight:"bold", textAlign:"center",fontSize:"25px" }}>HAZ CLICK Y ARRASTRA LOS STICKERS AL ALBUM </h3> 
            <h4 style={{textAlign:"center"}}> Stickers obtenidos: </h4>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              {newStickers.map((sticker) => (
                <img
                  key={sticker.id}
                  src={sticker.image_url}
                  alt="Nuevo Sticker"
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData("stickerId", sticker.id);
                  }}
                  style={{ width: "100px", height: "auto", cursor: "grab" }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="album-wrapper">
        <HTMLFlipBook
          width={size.width}
          height={510}
          startZIndex={0}
          showCover={true}
          size="stretch"
          minWidth={300}
          maxWidth={600}
          minHeight={400}
          maxHeight={700}
          drawShadow={false}
          autoSize={true}
        >
          <div className="demoPage">
            <img
              src={cover}
              alt="Portada del álbum"
              style={{ maxHeight: "100%" }}
            />
          </div>
          <div className="demoPage">
            <img
              src={whitepage}
              alt="En Blanco"
              style={{ maxHeight: "100%" }}
            />
          </div>

          <div className="demoPage album-page">
            <img
              src={pag1}
              alt="Pag1"
              className="album-page-img"
              style={{ maxHeight: "100%" }}
            />

            <div className="album-overlay">
              {allStickers.mamiferos.map((sticker, index) => (
                <div
                  className={"album-sticker sticker-" + (index + 1)}
                  key={sticker.id}
                  onDragOver={(event) => {
                    event.preventDefault();
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const stickerId = event.dataTransfer.getData("stickerId");
                    handleAttachSticker(stickerId, sticker.id);
                  }}
                >
                  <img
                    key={sticker.id}
                    src={sticker.image_url}
                    alt="Sticker"
                    className={`album-sticker-image ${!attachedStickers.includes(sticker.id) ? "white-image" : ""}`}
                  />
                  {!attachedStickers.includes(sticker.id) && (
                    <span className="sticker-name">{sticker.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="demoPage album-page">
            <img src={pag2} alt="Pag2" style={{ maxHeight: "100%" }} />
            <div className="album-overlay">
              {allStickers.anfibios.map((sticker, index) => (
                <div
                  className={"album-sticker sticker-" + (index + 1)}
                  key={sticker.id}
                  onDragOver={(event) => {
                    event.preventDefault();
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const stickerId = event.dataTransfer.getData("stickerId");
                    handleAttachSticker(stickerId, sticker.id);
                  }}
                >
                  <img
                    key={sticker.id}
                    src={sticker.image_url}
                    alt="Sticker"
                    className={`album-sticker-image ${!attachedStickers.includes(sticker.id) ? "white-image" : ""}`}
                  />
                  {!attachedStickers.includes(sticker.id) && (
                    <span className="sticker-name">{sticker.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="demoPage album-page">
            <img src={pag3} alt="Pag3" style={{ maxHeight: "100%" }} />
            <div className="album-overlay">
              {allStickers.reptiles.map((sticker, index) => (
                <div
                  className={"album-sticker sticker-" + (index + 1)}
                  key={sticker.id}
                  onDragOver={(event) => {
                    event.preventDefault();
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const stickerId = event.dataTransfer.getData("stickerId");
                    handleAttachSticker(stickerId, sticker.id);
                  }}
                >
                  <img
                    key={sticker.id}
                    src={sticker.image_url}
                    alt="Sticker"
                    className={`album-sticker-image ${!attachedStickers.includes(sticker.id) ? "white-image" : ""}`}
                  />
                  {!attachedStickers.includes(sticker.id) && (
                    <span className="sticker-name">{sticker.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="demoPage album-page">
            <img src={pag4} alt="Pag4" style={{ maxHeight: "100%" }} />
            <div className="album-overlay">
              {allStickers.aves.map((sticker, index) => (
                <div
                  className={"album-sticker sticker-" + (index + 1)}
                  key={sticker.id}
                  onDragOver={(event) => {
                    event.preventDefault();
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const stickerId = event.dataTransfer.getData("stickerId");
                    handleAttachSticker(stickerId, sticker.id);
                  }}
                >
                  <img
                    key={sticker.id}
                    src={sticker.image_url}
                    alt="Sticker"
                    className={`album-sticker-image ${!attachedStickers.includes(sticker.id) ? "white-image" : ""}`}
                  />
                  {!attachedStickers.includes(sticker.id) && (
                    <span className="sticker-name">{sticker.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="demoPage">
            <img
              src={whitepage}
              alt="En Blanco"
              style={{ maxHeight: "100%" }}
            />
          </div>
          <div className="demoPage">
            <img
              src={backcover}
              alt="Backcover"
              style={{ maxHeight: "100%" }}
            />
          </div>
        </HTMLFlipBook>
      </div>
    </>
  );
};
