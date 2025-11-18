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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero Header */}
        <header className="text-center mb-16 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/70 backdrop-blur-lg rounded-full border border-purple-200 shadow-sm mb-6">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-bold text-purple-700 tracking-wider">
              Fresh Daily Menu
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 bg-clip-text text-transparent leading-tight">
            {period.name}
          </h1>

          <div className="flex items-center justify-center gap-2 mt-4 text-gray-600">
            <Calendar className="w-5 h-5" />
            <time className="text-lg font-medium">{formattedDate}</time>
          </div>
        </header>

        {period.categories.length === 0 ? (
          <div className="text-center py-32">
            <div className="bg-gray-100 rounded-3xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-xl text-gray-500">No menu available today</p>
          </div>
        ) : (
          <div className="space-y-24">
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
      <div className="flex items-center gap-6 mb-10">
        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
          {category.name}
        </h2>
        <div className="h-1.5 flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-transparent rounded-full opacity-60"></div>
      </div>

      {/* Highest Protein Hero Card */}
      {highestProtein && highestProtein.value > 15 && (
        <div className="mb-12 -mx-4 sm:mx-0">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-pink-600 p-1 shadow-2xl">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 flex items-center gap-6">
              <div className="flex-shrink-0 p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                <Beef className="w-12 h-12 text-white" />
              </div>
              <div>
                <p className="text-purple-600 font-bold text-sm uppercase tracking-wider">
                  Highest Protein Today
                </p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">
                  {highestProtein.item.name}
                </h3>
                <p className="text-5xl font-black text-purple-600 mt-2">
                  {highestProtein.value}g
                  <span className="text-2xl text-gray-600 ml-2">protein</span>
                </p>
              </div>
              <Flame className="w-16 h-16 text-purple-300 absolute -top-4 -right-4 opacity-30" />
            </div>
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2.5 font-bold text-sm z-10 shadow-md">
          <span className="flex items-center justify-center gap-1.5">
            <Flame className="w-4 h-4" />
            HIGHEST PROTEIN
          </span>
        </div>
      )}

      <div className={`p-6 ${isHighestProtein ? "pt-14" : ""} space-y-5`}>
        {/* Name & Calories */}
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-lg font-bold text-gray-900 leading-tight flex-1">
            {item.name}
          </h3>
          <div className="text-right">
            <div className="text-2xl font-black text-purple-600">
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
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
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
    <div className="flex justify-between items-center">
      <span className="text-sm font-semibold text-gray-600">{label}</span>
      <span
        className={`font-black text-lg ${
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