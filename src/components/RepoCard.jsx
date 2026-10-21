import { Link } from "react-router-dom";
import SaveButton from "./SaveButton.jsx";

export default function RepoCard({ repo }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-600">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            to={`/repo/${repo.owner}/${repo.name}`}
            className="break-all text-lg font-semibold text-indigo-400 hover:underline"
          >
            {repo.fullName}
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-slate-300">
            {repo.description || "No description provided"}
          </p>
        </div>
        <SaveButton repo={repo} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-400">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-400" />
            {repo.language}
          </span>
        )}
        <span>⭐ {repo.stars?.toLocaleString()}</span>
        <span>🍴 {repo.forks?.toLocaleString()}</span>
        {repo.updatedAt && (
          <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}
