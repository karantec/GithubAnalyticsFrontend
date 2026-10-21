import { useFavorites } from "../context/FavoritesContext.jsx";

const colors = {
  success: "bg-emerald-600",
  error: "bg-red-600",
  info: "bg-slate-600",
};

export default function Toast() {
  const { toast } = useFavorites();
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 rounded-lg px-4 py-2 text-sm font-medium shadow-lg ${colors[toast.type]}`}
    >
      {toast.message}
    </div>
  );
}
