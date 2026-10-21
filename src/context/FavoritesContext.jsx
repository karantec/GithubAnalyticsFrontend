import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getFavorites, addFavorite, removeFavorite, getErrorMessage } from "../api/client.js";

const FavoritesContext = createContext(null);
export const useFavorites = () => useContext(FavoritesContext);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFavorites();
      setFavorites(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const isSaved = (repoId) => favorites.some((f) => f.repoId === repoId);

  const toggle = async (repo) => {
    try {
      if (isSaved(repo.id)) {
        await removeFavorite(repo.id);
        setFavorites((prev) => prev.filter((f) => f.repoId !== repo.id));
        notify("Removed from saved");
      } else {
        const res = await addFavorite({
          repoId: repo.id,
          name: repo.name,
          fullName: repo.fullName,
          owner: repo.owner,
          description: repo.description,
          stars: repo.stars,
          forks: repo.forks,
          language: repo.language,
          htmlUrl: repo.htmlUrl,
        });
        setFavorites((prev) => [res.data, ...prev]);
        notify("Repository saved");
      }
    } catch (err) {
      // 409 = duplicate: just resync the list
      if (err.response?.status === 409) {
        notify("Already saved", "info");
        load();
      } else {
        notify(getErrorMessage(err), "error");
      }
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, error, isSaved, toggle, reload: load, toast }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
