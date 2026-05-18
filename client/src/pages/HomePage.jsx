import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// ── tiny hook: triggers once when element enters viewport ──
const useInView = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

// ── static mock categories (replace images with real ones if needed) ──
const CATEGORIES = [
  { label: "Electronics",  emoji: "⚡", desc: "Gadgets & devices",  color: "from-blue-950 to-blue-900"    },
  { label: "Fashion",      emoji: "👗", desc: "Style & apparel",    color: "from-rose-950 to-rose-900"    },
  { label: "Home & Living",emoji: "🏠", desc: "Furniture & décor",  color: "from-amber-950 to-amber-900"  },
  { label: "Sports",       emoji: "🏋️", desc: "Gear & fitness",     color: "from-green-950 to-green-900"  },
];

const STATS = [
  { value: "50K+",  label: "Products"       },
  { value: "120K+", label: "Happy Customers" },
  { value: "4.9★",  label: "Avg. Rating"    },
  { value: "Free",  label: "Returns"        },
];

// ── reusable fade-up wrapper ──
const FadeUp = ({ children, delay = 0, className = "" }) => {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const HomePage = () => {
  // subtle parallax on hero text
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">

        {/* background glow orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-white/[0.03] blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-indigo-900/20 blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-violet-900/20 blur-3xl" />
          {/* grid texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* pill badge */}
        <div
          className="relative mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-gray-400 backdrop-blur-sm"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          New arrivals just dropped
        </div>

        {/* headline */}
        <h1
          className="relative max-w-4xl text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter leading-none"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            transform: `translateY(${scrollY * 0.12}px)`,
          }}
        >
          Shop the
          <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-white to-gray-400">
            Future of&nbsp;Retail.
          </span>
        </h1>

        <p
          className="relative mt-6 max-w-xl text-base sm:text-lg text-gray-500 leading-relaxed"
          style={{ transform: `translateY(${scrollY * 0.06}px)` }}
        >
          Curated products. Seamless checkout. Delivered fast.
          ShopHub is where modern commerce lives.
        </p>

        {/* CTAs */}
        <div
          className="relative mt-10 flex flex-col sm:flex-row gap-3 items-center"
          style={{ transform: `translateY(${scrollY * 0.04}px)` }}
        >
          <Link
            to="/products"
            className="group flex items-center gap-2 px-7 py-3.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
          >
            Shop Now
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <Link
            to="/register"
            className="px-7 py-3.5 border border-white/15 text-sm font-medium text-gray-300 rounded-xl hover:border-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            Create Account
          </Link>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-gray-600 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════ */}
      <section className="border-y border-white/8 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ value, label }, i) => (
            <FadeUp key={label} delay={i * 80} className="text-center">
              <p className="text-2xl sm:text-3xl font-black tracking-tight text-white">{value}</p>
              <p className="mt-1 text-xs text-gray-500 uppercase tracking-widest">{label}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CATEGORIES
      ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <FadeUp>
          <p className="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase mb-3">Browse</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Shop by Category
          </h2>
        </FadeUp>

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map(({ label, emoji, desc, color }, i) => (
            <FadeUp key={label} delay={i * 80}>
              <Link
                to="/products"
                className={`group relative flex flex-col justify-between h-44 p-5 rounded-2xl bg-gradient-to-br ${color} border border-white/5 overflow-hidden hover:border-white/20 hover:scale-[1.03] transition-all duration-300 cursor-pointer`}
              >
                {/* glow on hover */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 rounded-2xl" />
                <span className="text-3xl">{emoji}</span>
                <div>
                  <p className="font-bold text-white text-sm">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                {/* arrow */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute top-4 right-4 w-4 h-4 text-white/30 group-hover:text-white/80 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURE BANNER
      ═══════════════════════════════════════ */}
      <section className="mx-6 lg:mx-auto max-w-7xl mb-24">
        <FadeUp>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-white/8 p-10 lg:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* decorative circle */}
            <div className="pointer-events-none absolute -right-20 -top-20 w-72 h-72 rounded-full bg-indigo-900/25 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-10 w-56 h-56 rounded-full bg-violet-900/20 blur-3xl" />

            <div className="relative max-w-lg">
              <span className="inline-block mb-4 px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-white/10 text-gray-300 border border-white/10">
                Limited Time
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Get 20% off your<br />first order.
              </h2>
              <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                Sign up today and unlock your welcome discount. No code needed — it's applied automatically at checkout.
              </p>
            </div>

            <div className="relative flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to="/register"
                className="px-7 py-3.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95 text-center"
              >
                Claim Offer
              </Link>
              <Link
                to="/products"
                className="px-7 py-3.5 border border-white/15 text-sm font-medium text-gray-300 rounded-xl hover:border-white/40 hover:bg-white/5 transition-all duration-200 text-center"
              >
                Browse First
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ═══════════════════════════════════════
          WHY SHOPHUB
      ═══════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 pb-28">
        <FadeUp>
          <p className="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase mb-3">Why Us</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Built different.
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: "🚚", title: "Free Fast Shipping",   body: "Orders over ₹499 ship free. Delivered in 2–4 business days across India."          },
            { icon: "🔒", title: "Secure Payments",      body: "Powered by Razorpay. Your card details never touch our servers."                     },
            { icon: "↩️", title: "Hassle-free Returns",  body: "Not satisfied? Return within 30 days — no questions asked."                          },
            { icon: "✦",  title: "Curated Quality",      body: "Every product is vetted before it hits the shelf. No junk, no knock-offs."            },
            { icon: "🎧", title: "24 / 7 Support",       body: "Real humans. Live chat, email, and phone — whenever you need us."                     },
            { icon: "🏷️", title: "Best Price Promise",   body: "Found it cheaper? We'll match the price or refund the difference."                   },
          ].map(({ icon, title, body }, i) => (
            <FadeUp key={title} delay={i * 60}>
              <div className="group p-6 rounded-2xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15 transition-all duration-300">
                <span className="text-2xl mb-4 block">{icon}</span>
                <h3 className="font-bold text-white text-sm mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER CTA
      ═══════════════════════════════════════ */}
      <section className="border-t border-white/8 px-6 py-16 text-center">
        <FadeUp>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Ready to start shopping?
          </h2>
          <p className="text-gray-500 text-sm mb-8">Join 120,000+ customers who already trust ShopHub.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold text-sm rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Explore Products
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </FadeUp>
      </section>

    </div>
  );
};

export default HomePage;