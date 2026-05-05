import { useState } from "react";
import { CardsSection } from "../components/CardsSection/CardsSection"
import supabase from "../lib/supabase";

export const Animales = () => {
  const [stickers, setStickers] = useState([]);
  const [activeSection, setActiveSection] = useState("");

  const handleClick = async (section:string) => {
    const { data, error } = await supabase.from("stickers").select("*,stickers_details(*,regions(*),sticker_funfacts(*)) ").eq("album_section_id", section)
    
    if (error) {
      console.error("Error fetching stickers:", error);
    }

    if (data) {
      setActiveSection(section);
      setStickers(data);
    }

  };
  return (
    <>
   <CardsSection onButtonClick={handleClick} activeSectionId={activeSection} />
   {stickers.length > 0 && (
    <div className="container">
      {stickers.map((sticker) => (
        <div key={sticker.id} className="sticker-card row g-4 pb-4">
          <div className="col-2">
            <img src={sticker.image_url_for_show} alt={sticker.name} className="img-fluid"/>
          </div>
          <div className="col-4">
            <h3>{sticker.name}</h3>
            {sticker.stickers_details.map((detail) => (
              <div key={detail.id}>
                <p>
                  <strong>Descripción: </strong>
                  {detail["description"]}
                </p>
                <p>
                  <strong>Hábitat: </strong>
                  {detail.habitat}
                </p>
                <p>
                  <strong>Alimentación: </strong>
                  {detail.feeding}
                </p>
                <p>
                  <strong>Región: </strong>
                  {detail.regions.name}
                </p>
              </div>
            ))}
          </div>
          <div className="col-6">
            <strong>Curiosidades:</strong>
            <ul>
              {sticker.stickers_details.map((detail) => (
                detail.sticker_funfacts.map((funfact) => (
                  <li key={funfact.id}>{funfact.description}</li>
                ))
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
   )}

    </>

  )
}
