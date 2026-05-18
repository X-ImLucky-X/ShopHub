import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

// ── MUST be outside RegisterPage — defining it inside causes remount on every keystroke ──
const InputField = ({ label, name, type = "text", placeholder, icon, suffix, value, onChange, error }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wide">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={name === "password" ? "new-password" : name}
        className={`w-full bg-white/5 border rounded-xl pl-10 py-3 text-sm text-white placeholder-gray-700
          focus:outline-none focus:bg-white/8 transition-all duration-200
          ${suffix ? "pr-11" : "pr-4"}
          ${error ? "border-red-500/50 focus:border-red-500/70" : "border-white/8 focus:border-white/25"}`}
      />
      {suffix && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{suffix}</div>
      )}
    </div>
    {error && (
      <p className="mt-1 text-[11px] text-red-400 flex items-center gap-1">
        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData]       = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass]       = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  // ── password strength ──────────────────────────────────────────────────────
  const getStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8)          score++;
    if (/[A-Z]/.test(pw))        score++;
    if (/[0-9]/.test(pw))        score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strength      = getStrength(formData.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-500", "bg-amber-400", "bg-blue-400", "bg-green-400"][strength];

  // ── validate ───────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!formData.name.trim())     e.name     = "Full name is required";
    if (!formData.email.trim())    e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email";
    if (!formData.password)        e.password = "Password is required";
    else if (formData.password.length < 6) e.password = "At least 6 characters required";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      setError("");
      const { data } = await API.post("/auth/register", formData);
      localStorage.setItem("token", data.token);
      setSuccess(true);
      setTimeout(() => navigate("/"), 1400);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">

      {/* ── Left decorative panel ──────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#080808] flex-col justify-between p-14">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-violet-900/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-indigo-900/15 blur-3xl pointer-events-none" />

        <div className="relative flex items-center gap-2.5 z-10">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-sm">S</span>
          </div>
          <span className="text-white font-black text-xl tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Shop<span className="text-gray-500">Hub</span>
          </span>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <div className="text-5xl text-white/10 font-black leading-none" style={{ fontFamily: "serif" }}>"</div>
            <p className="text-2xl font-black text-white leading-snug tracking-tight max-w-sm mt-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Your account.<br />Your wishlist.<br />Your way.
            </p>
            <p className="text-sm text-gray-600 max-w-xs leading-relaxed mt-3">
              Create a free account and unlock exclusive deals, order tracking, and a personalised shopping experience.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: "🎁", text: "20% off your first order"           },
              { icon: "📦", text: "Real-time order tracking"            },
              { icon: "↩️", text: "Free 30-day returns on every order" },
              { icon: "⚡", text: "Priority support & early access"     },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-base shrink-0">
                  {icon}
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[11px] text-gray-700 tracking-widest uppercase">
          Free forever · No credit card required
        </p>
      </div>

      {/* ── Right form panel ────────────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-16">

        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-xs">S</span>
          </div>
          <span className="text-white font-black text-lg tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Shop<span className="text-gray-500">Hub</span>
          </span>
        </div>

        <div className="max-w-sm w-full mx-auto">

          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Create account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Already have one?{" "}
              <Link to="/login" className="text-white font-semibold hover:underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Account created! Redirecting…
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <InputField
              label="Full Name"
              name="name"
              placeholder="Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              error={fieldErrors.name}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              }
            />

            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={fieldErrors.email}
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              }
            />

            {/* Password with strength meter */}
            <div>
              <InputField
                label="Password"
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                error={fieldErrors.password}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                }
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-gray-600 hover:text-gray-300 transition-colors"
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
                }
              />

              {formData.password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? strengthColor : "bg-white/8"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-[11px] font-medium ${
                    strength === 1 ? "text-red-400"
                    : strength === 2 ? "text-amber-400"
                    : strength === 3 ? "text-blue-400"
                    : "text-green-400"
                  }`}>
                    {strengthLabel} password
                  </p>
                </div>
              )}
            </div>

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
                  Account created!
                </>
              ) : loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating account…
                </>
              ) : (
                "Create free account"
              )}
            </button>

          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[11px] text-gray-600 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <Link
            to="/login"
            className="flex items-center justify-center w-full py-3.5 border border-white/10 rounded-xl text-sm font-medium text-gray-400 hover:border-white/25 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            Sign in to existing account
          </Link>

          <p className="mt-6 text-center text-[11px] text-gray-700 leading-relaxed">
            By creating an account you agree to our{" "}
            <span className="text-gray-500 hover:text-white cursor-pointer transition-colors">Terms of Service</span>{" "}
            and{" "}
            <span className="text-gray-500 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>.
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;