import { useMemo } from "react";
import type { MenuResponse, Category, MenuItem as Item } from "../types/Menu";
import { Leaf, Flame, Beef, Sparkles, Calendar } from "lucide-react";

function parseNutrientValue(value: string | number): number {
  const str = String(value).toLowerCase();
  if (str.includes("less than")) {
    const match = str.match(/less than\s*(\d+\.?\d*)/);
    if (match) return Number(match[1]);
  }
  const num = Number(str.replace(/[^\d.]/g, ""));
  return isNaN(num) ? 0 : num;
}

function formatNutrientValue(value: string | number, uom: string = "g"): string {
  const str = String(value);
  if (str.toLowerCase().includes("less than")) {
    const match = str.match(/less than\s*(\d+\.?\d*)/);
    return match ? `${match[1]}${uom}` : str;
  }
  const num = str.replace(/[^\d.]/g, "");
  return num ? `${num}${uom}` : str;
}

export default function MenuDisplay({ data }: { data: MenuResponse }) {
  const { period } = data;

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-pink-50/50 to-indigo-50/60 backdrop-blur-3xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-10 md:py-16">
        {/* Hero Header */}
        <header className="text-center mb-8 sm:mb-12 md:mb-16 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 bg-white/70 backdrop-blur-lg rounded-full border border-purple-200 shadow-sm mb-4 sm:mb-6">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            <span className="text-xs sm:text-sm font-bold text-purple-700 tracking-wider">
              Fresh Daily Menu
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 bg-clip-text text-transparent leading-tight px-2">
            {period.name}
          </h1>

          <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4 text-gray-600">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <time className="text-sm sm:text-base md:text-lg font-medium">{formattedDate}</time>
          </div>
        </header>

        {period.categories.length === 0 ? (
          <div className="text-center py-16 sm:py-24 md:py-32">
            <div className="bg-gray-100 rounded-3xl w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-500">No menu available today</p>
          </div>
        ) : (
          <div className="space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24">
            {period.categories.map((category, i) => (
              <CategorySection key={category.id} category={category} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Category Section with Staggered Animation
function CategorySection({ category, index }: { category: Category; index: number }) {
  const highestProtein = useMemo(() => {
    if (category.items.length === 0) return null;
    return category.items
      .map((item) => {
        const protein = item.nutrients.find((n) =>
          n.name.toLowerCase().includes("protein")
        );
        return {
          item,
          value: protein ? parseNutrientValue(protein.value) : 0,
        };
      })
      .reduce((max, curr) => (curr.value > max.value ? curr : max), {
        item: category.items[0],
        value: 0,
      });
  }, [category.items]);

  if (category.items.length === 0) return null;

  return (
    <section
      className="animate-in fade-in slide-in-from-bottom duration-800"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Category Title */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight flex-shrink-0">
          {category.name}
        </h2>
        <div className="h-0.5 sm:h-1 md:h-1.5 flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-transparent rounded-full opacity-60 min-w-0"></div>
      </div>

      {/* Highest Protein Hero Card */}
      {highestProtein && highestProtein.value > 15 && (
        <div className="mb-8 sm:mb-10 md:mb-12 -mx-3 sm:-mx-4 md:mx-0">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 p-0.5 sm:p-1 shadow-2xl">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex-shrink-0 p-3 sm:p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl">
                <Beef className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-purple-600 font-bold text-xs sm:text-sm uppercase tracking-wider">
                  Highest Protein Today
                </p>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mt-1 break-words">
                  {highestProtein.item.name}
                </h3>
                <p className="text-3xl sm:text-4xl md:text-5xl font-black text-purple-600 mt-2">
                  {highestProtein.value}g
                  <span className="text-lg sm:text-xl md:text-2xl text-gray-600 ml-2">protein</span>
                </p>
              </div>
              <Flame className="hidden sm:block w-12 h-12 md:w-16 md:h-16 text-purple-300 absolute -top-2 -right-2 md:-top-4 md:-right-4 opacity-30" />
            </div>
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {category.items.map((item, i) => (
          <MenuItem
            key={item.id}
            item={item}
            isHighestProtein={highestProtein?.item.id === item.id}
            delay={index * 100 + i * 50}
          />
        ))}
      </div>
    </section>
  );
}

// Individual Menu Item Card
function MenuItem({
  item,
  isHighestProtein,
  delay,
}: {
  item: Item;
  isHighestProtein?: boolean;
  delay: number;
}) {
  const { vegan, vegetarian } = useMemo(() => ({
    vegan: item.filters.some((f) => f.name === "Vegan" && f.icon),
    vegetarian: item.filters.some((f) => f.name === "Vegetarian" && f.icon),
  }), [item.filters]);

  const nutrients = useMemo(() => {
    const find = (keyword: string) =>
      item.nutrients.find((n) => n.name.toLowerCase().includes(keyword));
    return {
      protein: find("protein"),
      carbs: find("carb"),
      fat: find("fat"),
      sugar: find("sugar"),
    };
  }, [item.nutrients]);

  return (
    <article
      className={`
        group relative bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/80 shadow-lg
        hover:shadow-2xl hover:border-purple-300/50 transition-all duration-500
        hover:-translate-y-2 overflow-hidden
        ${isHighestProtein ? "ring-4 ring-purple-400 ring-offset-4 ring-offset-transparent" : ""}
        animate-in fade-in zoom-in-95 duration-700
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top Badge */}
      {isHighestProtein && (
        <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 sm:py-2.5 font-bold text-xs sm:text-sm z-10 shadow-md">
          <span className="flex items-center justify-center gap-1 sm:gap-1.5">
            <Flame className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">HIGHEST PROTEIN</span>
            <span className="sm:hidden">TOP PROTEIN</span>
          </span>
        </div>
      )}

      <div className={`p-4 sm:p-5 md:p-6 ${isHighestProtein ? "pt-12 sm:pt-14" : ""} space-y-4 sm:space-y-5`}>
        {/* Name & Calories */}
        <div className="flex justify-between items-start gap-3 sm:gap-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight flex-1 min-w-0">
            {item.name}
          </h3>
          <div className="text-right flex-shrink-0">
            <div className="text-xl sm:text-2xl font-black text-purple-600">
              {item.calories || "-"}
            </div>
            <div className="text-xs text-gray-500 font-medium">cal</div>
          </div>
        </div>

        {/* Diet Badges */}
        {(vegan || vegetarian) && (
          <div className="flex flex-wrap gap-2">
            {vegan && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                <Leaf className="w-3.5 h-3.5" /> Vegan
              </span>
            )}
            {vegetarian && !vegan && (
              <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                Vegetarian
              </span>
            )}
          </div>
        )}

        {/* Macros */}
        {(nutrients.protein || nutrients.carbs || nutrients.fat || nutrients.sugar) && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200">
            {nutrients.protein && (
              <Macro label="Protein" value={formatNutrientValue(nutrients.protein.value, nutrients.protein.uom)} highlight />
            )}
            {nutrients.carbs && (
              <Macro label="Carbs" value={formatNutrientValue(nutrients.carbs.value, nutrients.carbs.uom)} />
            )}
            {nutrients.fat && (
              <Macro label="Fat" value={formatNutrientValue(nutrients.fat.value, nutrients.fat.uom)} />
            )}
            {nutrients.sugar && (
              <Macro
                label="Sugar"
                value={formatNutrientValue(nutrients.sugar.value, nutrients.sugar.uom)}
                warning={parseNutrientValue(nutrients.sugar.value) > 12}
              />
            )}
          </div>
        )}
      </div>

      {/* Hover Glow */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-400/20 via-transparent to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </article>
  );
}

function Macro({
  label,
  value,
  highlight = false,
  warning = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-2 min-w-0">
      <span className="text-xs sm:text-sm font-semibold text-gray-600 truncate">{label}</span>
      <span
        className={`font-black text-base sm:text-lg whitespace-nowrap flex-shrink-0 ${
          highlight
            ? "text-purple-600"
            : warning
            ? "text-red-600"
            : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}