import { NavLink, Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";

const link = ({ isActive }) =>
  `rounded-md px-3 py-1.5 text-sm font-medium transition ${
    isActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800"
  }`;

export default function Navbar() {
  const { favorites } = useFavorites();
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold tracking-tight">
          GitHub<span className="text-indigo-400">Explorer</span>
        </Link>
        <nav className="flex gap-2">
          <NavLink to="/" end className={link}>
            Search
          </NavLink>
          <NavLink to="/saved" className={link}>
            Saved ({favorites.length})
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
