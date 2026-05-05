import { useLocation } from "react-router";
import { Card } from "./Card";
import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";

interface CardData {
  id: string;
  title: string;
  imageUrl: string;
  altText: string;
}

interface CardsSectionProps {
  onButtonClick?: (sectionId: string) => void;
  activeSectionId?: string;
}

export const CardsSection = (props:CardsSectionProps) => {
  const { onButtonClick, activeSectionId } = props;
  const location = useLocation();
  const [cardsData, setCardsData] = useState<CardData[]>();

  useEffect(() => {
    const fetchCardsData = async () => {
      try {
        const { data, error } = await supabase.from("album_sections").select("*").order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching cards data:", error);
          return;
        }

        if (data) {
          setCardsData(data.map((item) => ({
            id: item.id,
            title: item.title,
            imageUrl: item.cover_image_url,
            altText: "section image",
          })));
        }
      } catch (error) {
        console.error("Error fetching cards data:", error);
      }
    }

   fetchCardsData();
  }, [])

  
  return (
    <section className="container py-4">
      <div className="ev-cards-grid">
        {cardsData && cardsData.map((card, index) => (
          <Card
            key={`card_image_${index}`}
            imageUrl={card.imageUrl}
            title={card.title}
            altText={card.altText}
            location={location.pathname}
            sectionId={card.id}
            onButtonClick={onButtonClick}
            activeSectionId={activeSectionId}
          />
        ))}
      </div>
    </section>
  );
};
