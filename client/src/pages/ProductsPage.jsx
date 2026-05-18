import { useEffect, useState, useMemo } from "react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-56 bg-white/5" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-3.5 bg-white/5 rounded-full w-3/4" />
      <div className="h-3 bg-white/5 rounded-full w-full" />
      <div className="h-3 bg-white/5 rounded-full w-2/3" />
      <div className="flex justify-between items-center mt-2">
        <div className="h-5 bg-white/5 rounded-full w-16" />
        <div className="h-8 bg-white/5 rounded-xl w-24" />
      </div>
    </div>
  </div>
);

// ── Sort options ──────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "default",    label: "Featured"       },
  { value: "price-asc",  label: "Price: Low–High" },
  { value: "price-desc", label: "Price: High–Low" },
  { value: "name-asc",   label: "Name: A–Z"       },
  { value: "rating",     label: "Top Rated"       },
];

const ProductsPage = () => {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort]           = useState("default");
  const [sortOpen, setSortOpen]   = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.get("/products");
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // ── Derive categories from data ────────────────────────────────────────────
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["All", ...cats];
  }, [products]);

  // ── Filter + sort ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }

    switch (sort) {
      case "price-asc":  list.sort((a, b) => a.price - b.price);           break;
      case "price-desc": list.sort((a, b) => b.price - a.price);           break;
      case "name-asc":   list.sort((a, b) => a.name?.localeCompare(b.name)); break;
      case "rating":     list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      default: break;
    }

    return list;
  }, [products, search, activeCategory, sort]);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase mb-2">
            Catalogue
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1
              className="text-4xl sm:text-5xl font-black tracking-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              All Products
            </h1>
            {!loading && (
              <p className="text-sm text-gray-500 pb-1">
                {filtered.length} {filtered.length === 1 ? "item" : "items"}
              </p>
            )}
          </div>
        </div>

        {/* ── Search + Sort row ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">

          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/8 rounded-xl text-sm text-gray-300 hover:border-white/20 hover:text-white transition-all duration-200 whitespace-nowrap w-full sm:w-auto"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M6 12h12M9 17h6" />
              </svg>
              {currentSortLabel}
              <svg
                className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ml-auto ${sortOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/50">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 flex items-center justify-between
                      ${sort === opt.value
                        ? "bg-white/10 text-white font-semibold"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    {opt.label}
                    {sort === opt.value && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Category pills ───────────────────────────────────────────────── */}
        {categories.length > 1 && (
          <div className="flex gap-2 flex-wrap mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-gray-400 border-white/8 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ── Close sort dropdown on outside click ────────────────────────── */}
        {sortOpen && (
          <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
        )}

        {/* ── States ──────────────────────────────────────────────────────── */}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-white font-semibold">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center text-2xl">
              🔍
            </div>
            <p className="text-white font-semibold text-lg">No products found</p>
            <p className="text-gray-500 text-sm max-w-xs">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); setSort("default"); }}
              className="mt-2 px-5 py-2.5 border border-white/15 text-sm text-gray-300 rounded-xl hover:border-white/30 hover:text-white transition-all duration-200"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Product grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductsPage;