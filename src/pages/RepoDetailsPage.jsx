import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { getRepoDetails, getErrorMessage } from "../api/client.js";
import SaveButton from "../components/SaveButton.jsx";
import Loader from "../components/Loader.jsx";
import ErrorBox from "../components/ErrorBox.jsx";

const Stat = ({ label, value }) => (
  <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
    <div className="text-xl font-bold">{value}</div>
    <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
  </div>
);

export default function RepoDetailsPage() {
  const { owner, repo } = useParams();
  const [state, setState] = useState({ loading: true, error: null, data: null });
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setState({ loading: true, error: null, data: null });
    getRepoDetails(owner, repo, ctrl.signal)
      .then((res) => setState({ loading: false, error: null, data: res.data }))
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setState({ loading: false, error: getErrorMessage(err), data: null });
      });
    return () => ctrl.abort();
  }, [owner, repo, retryKey]);

  const { loading, error, data } = state;

  return (
    <div>
      <Link to={-1} className="text-sm text-slate-400 hover:text-slate-200">← Back</Link>

      {loading && <Loader text="Loading repository..." />}
      {error && (
        <div className="mt-4">
          <ErrorBox message={error} onRetry={() => setRetryKey((k) => k + 1)} />
        </div>
      )}

      {data && (
        <div className="mt-4 space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="break-all text-2xl font-bold">{data.fullName}</h1>
              <p className="mt-2 max-w-2xl text-slate-300">
                {data.description || "No description provided"}
              </p>
              {data.topics?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.topics.map((t) => (
                    <span key={t} className="rounded-full bg-indigo-500/15 px-3 py-0.5 text-xs text-indigo-300">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <SaveButton repo={data} />
              <a
                href={data.htmlUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium hover:bg-indigo-500"
              >
                View on GitHub ↗
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Stars" value={data.stars.toLocaleString()} />
            <Stat label="Forks" value={data.forks.toLocaleString()} />
            <Stat label="Open issues" value={data.openIssues.toLocaleString()} />
            <Stat label="Language" value={data.language || "—"} />
          </div>

          {data.partial && (
            <p className="rounded-md bg-amber-500/10 p-3 text-sm text-amber-300">
              Some data (commits or contributors) could not be loaded for this repository.
            </p>
          )}

          <section>
            <h2 className="mb-3 text-lg font-semibold">Latest 5 commits</h2>
            {data.commits.length === 0 ? (
              <p className="text-sm text-slate-400">No commits available.</p>
            ) : (
              <ul className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-900">
                {data.commits.map((c) => (
                  <li key={c.sha} className="flex items-center gap-3 p-4">
                    {c.authorAvatar ? (
                      <img src={c.authorAvatar} alt="" className="h-8 w-8 rounded-full" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-slate-700" />
                    )}
                    <div className="min-w-0 flex-1">
                      <a href={c.htmlUrl} target="_blank" rel="noreferrer"
                         className="block truncate text-sm font-medium hover:text-indigo-400">
                        {c.message}
                      </a>
                      <p className="text-xs text-slate-400">
                        {c.author} · {new Date(c.date).toLocaleDateString()} ·{" "}
                        <code>{c.sha.slice(0, 7)}</code>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Top 5 contributors</h2>
            {data.contributors.length === 0 ? (
              <p className="text-sm text-slate-400">No contributors available.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {data.contributors.map((c) => (
                  <a key={c.login} href={c.htmlUrl} target="_blank" rel="noreferrer"
                     className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center hover:border-slate-600">
                    <img src={c.avatar} alt={c.login} className="mx-auto h-14 w-14 rounded-full" />
                    <p className="mt-2 truncate text-sm font-medium">{c.login}</p>
                    <p className="text-xs text-slate-400">{c.contributions.toLocaleString()} commits</p>
                  </a>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
