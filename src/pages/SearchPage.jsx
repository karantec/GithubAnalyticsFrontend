import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { searchRepos, getErrorMessage } from "../api/client.js";
import SearchBar from "../components/SearchBar.jsx";
import RepoCard from "../components/RepoCard.jsx";
import Pagination from "../components/Pagination.jsx";
import Loader from "../components/Loader.jsx";
import ErrorBox from "../components/ErrorBox.jsx";
import EmptyState from "../components/EmptyState.jsx";

const SORTS = [
  { value: "", label: "Best match" },
  { value: "stars", label: "Most stars" },
  { value: "updated", label: "Recently updated" },
];

export default function SearchPage() {
  // Search state lives in the URL, so refresh/back-button keep working
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const page = parseInt(params.get("page"), 10) || 1;
  const sort = params.get("sort") || "";

  const [state, setState] = useState({
    loading: false, error: null, data: [], pagination: null, cached: false,
  });
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!q) return;
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    searchRepos({ q, page, per_page: 10, ...(sort && { sort }) }, ctrl.signal)
      .then((res) =>
        setState({
          loading: false, error: null,
          data: res.data, pagination: res.pagination, cached: res.cached,
        })
      )
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setState({ loading: false, error: getErrorMessage(err), data: [], pagination: null });
      });

    return () => ctrl.abort();
  }, [q, page, sort, retryKey]);

  const update = useCallback(
    (changes) => {
      const next = new URLSearchParams(params);
      Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
      setParams(next);
    },
    [params, setParams]
  );

  const { loading, error, data, pagination } = state;

  return (
    <div>
      <SearchBar initial={q} onSearch={(value) => update({ q: value, page: 1 })} />

      {q && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-400">
            {pagination
              ? `${pagination.totalCount.toLocaleString()} results for "${q}"`
              : `Results for "${q}"`}
          </p>
          <label className="flex items-center gap-2 text-sm text-slate-400">
            Sort by
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value, page: 1 })}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-slate-100"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {!q && (
          <EmptyState
            icon="🔍"
            title="Search GitHub repositories"
            subtitle="Type a keyword above to get started"
          />
        )}
        {q && loading && <Loader text="Searching GitHub..." />}
        {q && !loading && error && (
          <ErrorBox message={error} onRetry={() => setRetryKey((k) => k + 1)} />
        )}
        {q && !loading && !error && data.length === 0 && (
          <EmptyState title="No repositories found" subtitle="Try a different keyword" />
        )}
        {!loading && !error && data.map((repo) => <RepoCard key={repo.id} repo={repo} />)}
      </div>

      {!loading && !error && pagination && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onChange={(p) => {
            update({ page: p });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}
