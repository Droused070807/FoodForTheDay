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
      <header className="w-full bg-white shadow-sm py-3 sm:py-4 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-purple-700 text-center sm:text-left">
            LSU Dining Menu
          </h1>

          {/* Segmented meal buttons */}
          <div className="flex bg-purple-100 rounded-xl overflow-hidden shadow-inner border border-purple-300 w-full sm:w-auto">
            {["breakfast", "lunch", "dinner"].map((meal) => (
              <button
                key={meal}
                onClick={() => handleFetch(meal)}
                disabled={loading}
                className={`
                  flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-2.5 transition-all font-medium capitalize text-sm sm:text-base
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
        </div>
      </header>

      {/* Error message */}
      {error && (
        <div className="mt-4 sm:mt-6 px-4 text-center text-red-600 font-semibold text-base sm:text-lg">
          Error: {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="mt-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          <p className="mt-2 text-gray-600">Loading menu...</p>
        </div>
      )}

      {/* Menu Data */}
      {data && (
        <div className="w-full mt-6 sm:mt-10">
          <MenuDisplay data={data} />
        </div>
      )}
    </div>
  );
}

export default App;
