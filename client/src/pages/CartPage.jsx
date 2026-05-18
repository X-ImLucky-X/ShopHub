import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

// ── Skeleton row ──────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <div className="flex gap-4 p-5 animate-pulse">
    <div className="w-20 h-20 rounded-xl bg-white/5 shrink-0" />
    <div className="flex-1 flex flex-col gap-2 justify-center">
      <div className="h-3.5 bg-white/5 rounded-full w-1/2" />
      <div className="h-3 bg-white/5 rounded-full w-1/4" />
    </div>
    <div className="w-20 h-8 bg-white/5 rounded-xl self-center" />
  </div>
);

const CartPage = () => {
  const [cart, setCart]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null); // productId being removed
  const [updating, setUpdating] = useState(null); // productId being qty-updated
  const [toast, setToast]     = useState(null);
  const navigate = useNavigate();

  // ── Toast helper ────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Auth header ─────────────────────────────────────────────────────────────
  const authHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // ── Fetch cart ──────────────────────────────────────────────────────────────
  const fetchCart = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) { setCart([]); setLoading(false); return; }
      const { data } = await API.get("/cart", authHeader());
      setCart(data.items ?? []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load cart", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  // ── Remove item ─────────────────────────────────────────────────────────────
  const removeItem = async (productId, name) => {
    try {
      setRemoving(productId);
      await API.delete(`/cart/${productId}`, authHeader());
      setCart((prev) => prev.filter((i) => i.product._id !== productId));
      showToast(`${name} removed from cart`);
    } catch (err) {
      console.error(err);
      showToast("Failed to remove item", "error");
    } finally {
      setRemoving(null);
    }
  };

  // ── Update quantity ─────────────────────────────────────────────────────────
  // If your backend supports PATCH /cart/:productId with { quantity },
  // wire it here. For now we do an optimistic local update + API call.
  const updateQty = async (productId, delta, currentQty) => {
    const newQty = currentQty + delta;
    if (newQty < 1) { removeItem(productId); return; }
    try {
      setUpdating(productId);
      // Optimistic update
      setCart((prev) =>
        prev.map((i) =>
          i.product._id === productId ? { ...i, quantity: newQty } : i
        )
      );
      // Replace with your actual PATCH/PUT endpoint if available
      await API.post(
        "/cart",
        { productId, quantity: newQty },
        authHeader()
      );
    } catch (err) {
      console.error(err);
      // Rollback
      setCart((prev) =>
        prev.map((i) =>
          i.product._id === productId ? { ...i, quantity: currentQty } : i
        )
      );
      showToast("Failed to update quantity", "error");
    } finally {
      setUpdating(null);
    }
  };

  // ── Derived totals ──────────────────────────────────────────────────────────
  const subtotal  = cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const itemCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const shipping  = subtotal > 499 ? 0 : 49;
  const total     = subtotal + shipping;

  const fmt = (n) => n.toLocaleString("en-IN");

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Global toast ──────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl border backdrop-blur-sm transition-all duration-300
            ${toast.type === "success"
              ? "bg-green-500/15 border-green-500/25 text-green-300"
              : "bg-red-500/15 border-red-500/25 text-red-300"
            }`}
        >
          {toast.type === "success"
            ? <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            : <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          }
          {toast.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase mb-2">Review</p>
          <div className="flex items-end justify-between">
            <h1
              className="text-4xl sm:text-5xl font-black tracking-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Your Cart
            </h1>
            {!loading && cart.length > 0 && (
              <p className="text-sm text-gray-500 pb-1">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
            )}
          </div>
        </div>

        {/* ── Loading ─────────────────────────────────────────────────────────── */}
        {loading && (
          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl overflow-hidden divide-y divide-white/5">
              {[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
            <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl h-64 animate-pulse" />
          </div>
        )}

        {/* ── Empty state ─────────────────────────────────────────────────────── */}
        {!loading && cart.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center text-3xl">
              🛒
            </div>
            <p className="text-white font-semibold text-xl">Your cart is empty</p>
            <p className="text-gray-500 text-sm max-w-xs">
              Looks like you haven't added anything yet. Start exploring our catalogue.
            </p>
            <Link
              to="/products"
              className="mt-3 inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              Browse Products
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        )}

        {/* ── Cart content ────────────────────────────────────────────────────── */}
        {!loading && cart.length > 0 && (
          <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">

            {/* ── Items list ────────────────────────────────────────────────── */}
            <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl overflow-hidden">

              {/* column headers */}
              <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 border-b border-white/6">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-600">Product</span>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 text-center w-28">Quantity</span>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 text-right w-20">Subtotal</span>
              </div>

              <div className="divide-y divide-white/5">
                {cart.map((item) => {
                  const p = item.product;
                  const lineTotal = p.price * item.quantity;
                  const isRemoving = removing === p._id;
                  const isUpdating = updating === p._id;

                  return (
                    <div
                      key={p._id}
                      className={`flex flex-col sm:grid sm:grid-cols-[1fr_auto_auto] gap-4 items-start sm:items-center px-5 py-5 transition-all duration-300 ${isRemoving ? "opacity-40 scale-[0.98]" : "opacity-100"}`}
                    >
                      {/* Product info */}
                      <div className="flex items-center gap-4 min-w-0">
                        {/* image */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/5 border border-white/8 overflow-hidden shrink-0">
                          <img
                            src={p.image || `https://placehold.co/80x80/111111/333333?text=${encodeURIComponent(p.name ?? "")}`}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = `https://placehold.co/80x80/111111/333333?text=?`; }}
                          />
                        </div>
                        {/* text */}
                        <div className="min-w-0">
                          <h2
                            className="font-bold text-white text-sm truncate"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {p.name}
                          </h2>
                          <p className="text-xs text-gray-500 mt-0.5">
                            ₹{fmt(p.price)} each
                          </p>
                          {/* mobile remove */}
                          <button
                            onClick={() => removeItem(p._id, p.name)}
                            disabled={isRemoving}
                            className="sm:hidden mt-2 text-[11px] text-red-400/70 hover:text-red-400 transition-colors flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-2 w-28 justify-center">
                        <button
                          onClick={() => updateQty(p._id, -1, item.quantity)}
                          disabled={isUpdating || isRemoving}
                          className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all duration-150 disabled:opacity-40"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                          </svg>
                        </button>

                        <span className="w-8 text-center text-sm font-bold text-white">
                          {isUpdating ? (
                            <svg className="w-3.5 h-3.5 animate-spin mx-auto text-gray-400" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                          ) : item.quantity}
                        </span>

                        <button
                          onClick={() => updateQty(p._id, +1, item.quantity)}
                          disabled={isUpdating || isRemoving}
                          className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all duration-150 disabled:opacity-40"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                      </div>

                      {/* Subtotal + desktop remove */}
                      <div className="hidden sm:flex items-center justify-end gap-3 w-20">
                        <span className="font-bold text-white text-sm">₹{fmt(lineTotal)}</span>
                        <button
                          onClick={() => removeItem(p._id, p.name)}
                          disabled={isRemoving}
                          className="text-gray-700 hover:text-red-400 transition-colors disabled:opacity-40"
                          aria-label="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue shopping */}
              <div className="border-t border-white/6 px-5 py-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Continue shopping
                </Link>
              </div>
            </div>

            {/* ── Order summary ─────────────────────────────────────────────── */}
            <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl p-6 flex flex-col gap-5 sticky top-24">

              <h2
                className="font-black text-lg text-white tracking-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Order Summary
              </h2>

              {/* breakdown */}
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                  <span className="text-white font-medium">₹{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  {shipping === 0
                    ? <span className="text-green-400 font-medium">Free</span>
                    : <span className="text-white font-medium">₹{fmt(shipping)}</span>
                  }
                </div>
                {shipping > 0 && (
                  <p className="text-[11px] text-gray-600 -mt-1">
                    Add ₹{fmt(499 - subtotal)} more for free shipping
                  </p>
                )}
                <div className="border-t border-white/8 pt-3 flex justify-between">
                  <span className="font-bold text-white">Total</span>
                  <span
                    className="font-black text-xl text-white tracking-tight"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    ₹{fmt(total)}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Link
                to="/checkout"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10"
              >
                Proceed to Checkout
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              {/* trust badges */}
              <div className="flex flex-col gap-2 pt-1 border-t border-white/6">
                {[
                  { icon: "🔒", text: "Secure checkout via Razorpay" },
                  { icon: "↩️", text: "Free returns within 30 days"  },
                  { icon: "🚚", text: "Free shipping on orders ₹499+" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-[11px] text-gray-600">
                    <span>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CartPage;