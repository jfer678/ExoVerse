export const shuffleStickers = (stickers: string[], maxStickers = 3) => {
  const randomized = [...stickers].sort(() => Math.random() - 0.5);
  return [...randomized].slice(0, maxStickers);
};