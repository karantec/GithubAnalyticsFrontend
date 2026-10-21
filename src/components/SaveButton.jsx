import { useFavorites } from "../context/FavoritesContext.jsx";

export default function SaveButton({ repo, className = "" }) {
  const { isSaved, toggle } = useFavorites();
  const saved = isSaved(repo.id);
  return (
    <button
      onClick={() => toggle(repo)}
      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
        saved
          ? "border-amber-500 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
          : "border-slate-600 text-slate-200 hover:bg-slate-800"
      } ${className}`}
    >
      {saved ? "★ Saved" : "☆ Save"}
    </button>
  );
}
