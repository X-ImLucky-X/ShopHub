import { useState } from "react";
import API from "../api/axios";

const ProductCard = ({ product }) => {
  const [adding, setAdding] = useState(false);   // loading state
  const [added, setAdded] = useState(false);     // success flash
  const [toast, setToast] = useState(null);      // { msg, type }
  const [imgError, setImgError] = useState(false);

  // ── Toast helper ──────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Add to cart ───────────────────────────────────────────
  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login to add items to cart", "error");
      return;
    }
    if (adding || added) return;

    try {
      setAdding(true);
      await API.post(
        "/cart",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdded(true);
      showToast(`${product.name} added to cart!`, "success");
      setTimeout(() => setAdded(false), 2500);
    } catch (error) {
      console.error(error);
      showToast("Failed to add to cart. Try again.", "error");
    } finally {
      setAdding(false);
    }
  };

  // ── Derived values ────────────────────────────────────────
  const image =
    !imgError && product.image
      ? product.image
      : `https://placehold.co/400x320/111111/333333?text=${encodeURIComponent(product.name ?? "Product")}`;

  // fake discount for visual flair (remove if you have real data)
  const fakeOriginal =
    product.originalPrice ?? Math.round(product.price * 1.25);
  const discount = Math.round(((fakeOriginal - product.price) / fakeOriginal) * 100);

  // fake star rating (replace with product.rating if available)
  const rating = product.rating ?? 4.2;
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="group relative flex flex-col bg-[#0d0d0d] border border-white/6 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-1">

      {/* ── Toast ─────────────────────────────────────────── */}
      {toast && (
        <div
          className={`absolute top-3 left-3 right-3 z-30 flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-xl backdrop-blur-sm transition-all duration-300
            ${toast.type === "success"
              ? "bg-green-500/20 border border-green-500/30 text-green-300"
              : "bg-red-500/20 border border-red-500/30 text-red-300"
            }`}
        >
          {toast.type === "success" ? (
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      {/* ── Image ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#111] h-56">
        <img
          src={image}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* discount badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold tracking-wide rounded-md bg-white text-black uppercase">
            -{discount}%
          </span>
        )}

        {/* wishlist button */}
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
          onClick={(e) => e.preventDefault()}
          aria-label="Wishlist"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* out-of-stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3 py-1.5 text-xs font-bold tracking-widest uppercase border border-white/20 rounded-lg text-white/60">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── Body ──────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* name + description */}
        <div>
          <h2
            className="font-bold text-white text-sm leading-snug line-clamp-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {product.name}
          </h2>
          <p className="mt-1 text-gray-500 text-xs leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* stars */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => {
              const filled = i < fullStars;
              const half = !filled && i === fullStars && hasHalf;
              return (
                <svg
                  key={i}
                  className={`w-3 h-3 ${filled ? "text-amber-400" : half ? "text-amber-400" : "text-gray-700"}`}
                  viewBox="0 0 20 20"
                  fill={filled ? "currentColor" : half ? "url(#half)" : "currentColor"}
                >
                  {half && (
                    <defs>
                      <linearGradient id="half">
                        <stop offset="50%" stopColor="#fbbf24" />
                        <stop offset="50%" stopColor="#374151" />
                      </linearGradient>
                    </defs>
                  )}
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            })}
          </div>
          <span className="text-[10px] text-gray-500">{rating.toFixed(1)}</span>
        </div>

        {/* price row + button */}
        <div className="flex items-center justify-between mt-auto pt-1 gap-3">
          {/* pricing */}
          <div className="flex flex-col">
            <span
              className="text-lg font-black text-white tracking-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {discount > 0 && (
              <span className="text-[11px] text-gray-600 line-through">
                ₹{fakeOriginal.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* add to cart button */}
          <button
            onClick={addToCart}
            disabled={adding || product.stock === 0}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200
              ${added
                ? "bg-green-500/20 border border-green-500/40 text-green-300"
                : product.stock === 0
                ? "bg-white/5 border border-white/8 text-gray-600 cursor-not-allowed"
                : "bg-white text-black hover:bg-gray-100 hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
              }`}
          >
            {adding ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Adding…
              </>
            ) : added ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Added!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.847-7.148a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;