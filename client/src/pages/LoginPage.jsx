import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const { data } = await API.post("/auth/login", formData);
      localStorage.setItem("token", data.token);
      setSuccess(true);
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">

      {/* ── Left panel (decorative) ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#080808] flex-col justify-between p-14">

        {/* grid texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* glow orbs */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-indigo-900/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full bg-violet-900/15 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5 z-10">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-sm">S</span>
          </div>
          <span className="text-white font-black text-xl tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Shop<span className="text-gray-500">Hub</span>
          </span>
        </div>

        {/* Center quote */}
        <div className="relative z-10 space-y-6">
          <div className="text-5xl text-white/10 font-black leading-none" style={{ fontFamily: "serif" }}>"</div>
          <p className="text-2xl font-black text-white leading-snug tracking-tight max-w-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Premium products.<br />Seamless checkout.<br />Every time.
          </p>
          <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
            Join 120,000+ shoppers who trust ShopHub for their everyday and luxury purchases.
          </p>

          {/* Social proof avatars */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2">
              {["R","A","P","M"].map((l, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: ["#374151","#1e3a5f","#2d1b4e","#1a3a2a"][i] }}
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              <span className="text-white font-semibold">4.9★</span> from 12,000+ reviews
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-[11px] text-gray-700 tracking-widest uppercase">
            Secure · Fast · Trusted
          </p>
        </div>
      </div>

      {/* ── Right panel (form) ──────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-16 relative">

        {/* mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-xs">S</span>
          </div>
          <span className="text-white font-black text-lg tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Shop<span className="text-gray-500">Hub</span>
          </span>
        </div>

        <div className="max-w-sm w-full mx-auto">

          {/* Heading */}
          <div className="mb-8">
            <h2
              className="text-3xl sm:text-4xl font-black text-white tracking-tight"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/register" className="text-white font-semibold hover:underline underline-offset-2">
                Sign up free
              </Link>
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          {/* Success banner */}
          {success && (
            <div className="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Login successful! Redirecting…
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-500 tracking-wide">Password</label>
                <button type="button" className="text-xs text-gray-500 hover:text-white transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="w-full bg-white/5 border border-white/8 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 mt-2
                ${success
                  ? "bg-green-500/20 border border-green-500/30 text-green-300 cursor-default"
                  : loading
                  ? "bg-white/80 text-black cursor-wait"
                  : "bg-white text-black hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/10"
                }`}
            >
              {success ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Logged in!
                </>
              ) : loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign in to ShopHub"
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[11px] text-gray-600 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Register CTA */}
          <Link
            to="/register"
            className="flex items-center justify-center w-full py-3.5 border border-white/10 rounded-xl text-sm font-medium text-gray-400 hover:border-white/25 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            Create a new account
          </Link>

          {/* Fine print */}
          <p className="mt-6 text-center text-[11px] text-gray-700 leading-relaxed">
            By signing in, you agree to our{" "}
            <span className="text-gray-500 hover:text-white cursor-pointer transition-colors">Terms of Service</span>{" "}
            and{" "}
            <span className="text-gray-500 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>.
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;