import { useState, useEffect } from "react";

export default function SearchBar({ initial = "", onSearch }) {
  const [value, setValue] = useState(initial);
  useEffect(() => setValue(initial), [initial]);

  const submit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search repositories, e.g. react, express, machine learning..."
        className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 outline-none focus:border-indigo-500"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium hover:bg-indigo-500 disabled:opacity-50"
      >
        Search
      </button>
    </form>
  );
}
