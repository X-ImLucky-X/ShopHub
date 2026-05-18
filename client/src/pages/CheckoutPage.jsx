import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

// ── MUST be outside CheckoutPage — defining it inside causes remount on every keystroke ──
const Field = ({ label, name, placeholder, type = "text", half = false, value, onChange, error }) => (
  <div className={half ? "col-span-1" : "col-span-2"}>
    <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-700
        focus:outline-none focus:bg-white/8 transition-all duration-200
        ${error ? "border-red-500/50 focus:border-red-500/70" : "border-white/8 focus:border-white/25"}`}
    />
    {error && (
      <p className="mt-1 text-[11px] text-red-400">{error}</p>
    )}
  </div>
);

const CheckoutPage = () => {
  const [cart, setCart]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying]   = useState(false);
  const [paid, setPaid]       = useState(false);
  const [toast, setToast]     = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // ── Toast ─────────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Shipping form state ───────────────────────────────────────────────────
  const [shipping, setShipping] = useState({
    name:       "",
    phone:      "",
    address:    "",
    city:       "",
    postalCode: "",
    country:    "India",
  });
  const [errors, setErrors] = useState({});

  const handleField = (e) => {
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  // ── Fetch cart ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!token) { setLoading(false); return; }
        const { data } = await API.get("/cart", authHeader);
        setCart(data.items ?? []);
      } catch (err) {
        console.error(err);
        showToast("Failed to load cart", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // ── Derived totals ────────────────────────────────────────────────────────
  const subtotal  = cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const shipping_ = subtotal > 499 ? 0 : 49;
  const total     = subtotal + shipping_;
  const fmt       = (n) => n.toLocaleString("en-IN");

  // ── Validate ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!shipping.name.trim())       e.name       = "Full name is required";
    if (!shipping.phone.trim())      e.phone      = "Phone number is required";
    if (!shipping.address.trim())    e.address    = "Address is required";
    if (!shipping.city.trim())       e.city       = "City is required";
    if (!shipping.postalCode.trim()) e.postalCode = "Postal code is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Payment ───────────────────────────────────────────────────────────────
  const handlePayment = async () => {
    if (!validate()) {
      showToast("Please fill in all shipping details", "error");
      return;
    }
    if (paying || paid) return;

    try {
      setPaying(true);

      const { data } = await API.post(
        "/payments/create-order",
        { amount: total },
        authHeader
      );

      const options = {
        key: "rzp_test_SqALpNcjs7H1FG",
        amount: data.amount,
        currency: data.currency,
        name: "ShopHub",
        description: "Order Payment",
        order_id: data.id,
        prefill: {
          name:    shipping.name,
          contact: shipping.phone,
        },
        handler: async (response) => {
          try {
            await API.post(
              "/orders",
              {
                shippingAddress: {
                  address:    shipping.address,
                  city:       shipping.city,
                  postalCode: shipping.postalCode,
                  country:    shipping.country,
                },
                totalPrice: total,
              },
              authHeader
            );
            setPaid(true);
            showToast("Payment successful! Redirecting…", "success");
            setTimeout(() => navigate("/"), 2500);
          } catch (err) {
            console.error(err);
            showToast("Order saving failed. Contact support.", "error");
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
            showToast("Payment cancelled", "error");
          },
        },
        theme: { color: "#000000" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      setPaying(false);
      showToast("Payment failed. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl border backdrop-blur-sm
          ${toast.type === "success"
            ? "bg-green-500/15 border-green-500/25 text-green-300"
            : "bg-red-500/15 border-red-500/25 text-red-300"}`}
        >
          {toast.type === "success"
            ? <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            : <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          }
          {toast.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase mb-2">Final Step</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Checkout
          </h1>
        </div>

        {/* ── Progress steps ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-10">
          {["Cart", "Shipping", "Payment"].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 text-xs font-semibold ${i <= 1 ? "text-white" : "text-gray-600"}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
                  ${i === 0 ? "bg-white text-black" : i === 1 ? "bg-white text-black" : "bg-white/10 text-gray-600"}`}>
                  {i === 0
                    ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    : i + 1}
                </span>
                <span className="hidden sm:inline">{step}</span>
              </div>
              {i < 2 && <div className={`h-px w-8 sm:w-16 ${i < 1 ? "bg-white/30" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* ── Left: Shipping form ────────────────────────────────────────── */}
          <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl p-6 sm:p-8">
            <h2 className="font-black text-lg text-white mb-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Shipping Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Full Name" name="name" placeholder="Rahul Sharma"
                value={shipping.name} onChange={handleField} error={errors.name}
              />
              <Field
                label="Phone Number" name="phone" placeholder="+91 98765 43210" half
                value={shipping.phone} onChange={handleField} error={errors.phone}
              />
              <Field
                label="Country" name="country" placeholder="India" half
                value={shipping.country} onChange={handleField} error={errors.country}
              />
              <Field
                label="Street Address" name="address" placeholder="123, MG Road, Flat 4B"
                value={shipping.address} onChange={handleField} error={errors.address}
              />
              <Field
                label="City" name="city" placeholder="New Delhi" half
                value={shipping.city} onChange={handleField} error={errors.city}
              />
              <Field
                label="Postal Code" name="postalCode" placeholder="110001" half
                value={shipping.postalCode} onChange={handleField} error={errors.postalCode}
              />
            </div>

            {/* Security note */}
            <div className="mt-6 flex items-center gap-2 text-[11px] text-gray-600 border-t border-white/6 pt-5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Your information is encrypted and never shared with third parties.
            </div>
          </div>

          {/* ── Right: Order summary ───────────────────────────────────────── */}
          <div className="flex flex-col gap-5 sticky top-24">

            <div className="bg-[#0d0d0d] border border-white/6 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/6">
                <h2 className="font-black text-base text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Order Summary
                </h2>
              </div>

              <div className="divide-y divide-white/5 max-h-60 overflow-y-auto">
                {loading
                  ? [...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
                        <div className="w-10 h-10 rounded-lg bg-white/5 shrink-0" />
                        <div className="flex-1 h-3 bg-white/5 rounded-full" />
                        <div className="w-12 h-3 bg-white/5 rounded-full" />
                      </div>
                    ))
                  : cart.map((item) => (
                      <div key={item.product._id} className="flex items-center gap-3 px-5 py-3.5">
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/8 overflow-hidden">
                            <img
                              src={item.product.image || `https://placehold.co/40x40/111/333?text=?`}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = "https://placehold.co/40x40/111/333?text=?"; }}
                            />
                          </div>
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-black text-[9px] font-black rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <span className="flex-1 text-xs text-gray-300 font-medium truncate">
                          {item.product.name}
                        </span>
                        <span className="text-xs font-bold text-white shrink-0">
                          ₹{fmt(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))
                }
              </div>

              <div className="px-5 py-4 border-t border-white/6 flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  {shipping_ === 0
                    ? <span className="text-green-400 font-medium">Free</span>
                    : <span className="text-white">₹{fmt(shipping_)}</span>
                  }
                </div>
                <div className="flex justify-between border-t border-white/8 pt-2.5 mt-1">
                  <span className="font-bold text-white">Total</span>
                  <span className="font-black text-xl text-white tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    ₹{fmt(total)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={paying || paid || loading || cart.length === 0}
              className={`relative w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-bold transition-all duration-300
                ${paid
                  ? "bg-green-500/20 border border-green-500/30 text-green-300 cursor-default"
                  : paying
                  ? "bg-white/80 text-black cursor-wait"
                  : cart.length === 0
                  ? "bg-white/5 border border-white/8 text-gray-600 cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/10"
                }`}
            >
              {paid ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Payment Successful
                </>
              ) : paying ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Opening Razorpay…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  Pay ₹{fmt(total)} with Razorpay
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              {["UPI", "Cards", "NetBanking", "Wallets"].map((m) => (
                <span key={m} className="px-2.5 py-1 text-[10px] font-semibold text-gray-600 border border-white/6 rounded-md">
                  {m}
                </span>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;