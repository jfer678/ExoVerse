import { useEffect, useState } from "react";
import supabase from "../lib/supabase"; 


const formatStickerInMatrix = (stickers: string[], columns: number = 5) => {
    const matrix: string[][] = [];
    for (let i = 0; i < stickers.length; i += columns) {
        matrix.push(stickers.slice(i, i + columns));
    }
    return matrix;
}

const shuffleArray = (array: string[]) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
    }

    return copy;
}

const formatStickersWithPairs = (stickers: string[], totalCards: number = 20) => {
    const pairsNeeded = totalCards / 2;

    const randomStickers = shuffleArray(stickers).slice(0, pairsNeeded);

    const stickersWithPairs = [...randomStickers, ...randomStickers];
    return shuffleArray(stickersWithPairs);
}

export const useStickers = () => {
    const [stickersImage, setStickersImages] = useState<string[]>([]);

    
    useEffect(() => {
        const fetchStickers = async () => {
            const { data, error } = await supabase
                .from("memory_pairs_stickers")
                .select("image_url")
                .limit(20);
    
            if (error) {
                console.error("Error fetching stickers:", error);
                return;
            }
    
            if (data) {
                const stickerUrls = data.map((sticker) => sticker.image_url);

                const formattedStickers = formatStickersWithPairs(stickerUrls, 20);

                const stickerMatrix = formatStickerInMatrix(formattedStickers, 5);
                
                setStickersImages(stickerMatrix);
            }
        }
        if (stickersImage.length === 0) {
            fetchStickers();
        }

    }, []);

    return { stickersImage };
}