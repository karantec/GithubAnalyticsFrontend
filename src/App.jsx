import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Toast from "./components/Toast.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import RepoDetailsPage from "./pages/RepoDetailsPage.jsx";
import SavedPage from "./pages/SavedPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/repo/:owner/:repo" element={<RepoDetailsPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route
            path="*"
            element={<p className="py-20 text-center text-slate-400">Page not found</p>}
          />
        </Routes>
      </main>
      <Toast />
    </div>
  );
}
