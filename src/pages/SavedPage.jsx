import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext.jsx";
import RepoCard from "../components/RepoCard.jsx";
import Loader from "../components/Loader.jsx";
import ErrorBox from "../components/ErrorBox.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function SavedPage() {
  const { favorites, loading, error, reload } = useFavorites();

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Saved repositories</h1>

      {loading && <Loader />}
      {error && <ErrorBox message={error} onRetry={reload} />}

      {!loading && !error && favorites.length === 0 && (
        <EmptyState
          icon="⭐"
          title="Nothing saved yet"
          subtitle="Save repositories from the search page and they will show up here"
        />
      )}
      {!loading && !error && favorites.length === 0 && (
        <div className="text-center">
          <Link to="/" className="text-indigo-400 hover:underline">Go to search</Link>
        </div>
      )}

      <div className="space-y-4">
        {favorites.map((f) => (
          // RepoCard expects `id`; saved docs store it as `repoId`
          <RepoCard key={f.repoId} repo={{ ...f, id: f.repoId }} />
        ))}
      </div>
    </div>
  );
}
