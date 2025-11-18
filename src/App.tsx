import "./App.css";
import { useState } from "react";
import { fetchData } from "./fetchData";
import MenuDisplay from "./components/MenuDisplay";
import type { MenuResponse } from "./types/Menu";

function App() {
  const [data, setData] = useState<MenuResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async (menuItem: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = (await fetchData(new Date().toISOString().split('T')[0], menuItem)) as MenuResponse;
      setData(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 pb-20">
      {/* Top bar */}
      <header className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700">LSU Dining Menu</h1>

        {/* Segmented meal buttons */}
        <div className="flex bg-purple-100 rounded-xl overflow-hidden shadow-inner border border-purple-300">
          {["breakfast", "lunch", "dinner"].map((meal) => (
            <button
              key={meal}
              onClick={() => handleFetch(meal)}
              disabled={loading}
              className={`
          px-5 py-2.5 transition-all font-medium capitalize
          ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-200"}
          ${
            data?.period?.name?.toLowerCase() === meal
              ? "bg-purple-700 text-white shadow"
              : "text-purple-800"
          }
        `}
            >
              {meal}
            </button>
          ))}
        </div>
      </header>

      {/* Error message */}
      {error && (
        <div className="mt-6 text-center text-red-600 font-semibold text-lg">
          Error: {error}
        </div>
      )}

      {/* Menu Data */}
      {data && (
        <div className="w-full mt-10">
          <MenuDisplay data={data} />
        </div>
      )}
    </div>
  );
}

export default App;
