import { useState, useEffect, useCallback } from "react";

const FAVORITES_KEY = "morho_favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isFavorite = useCallback(
    (productId: number) => favorites.includes(productId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
};
