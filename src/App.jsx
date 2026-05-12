import { useState, useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/next"

const FLAVOURS = [
  {
    id: 1,
    name: "Lemon Smash",
    tag: "CITRUS ENERGY",
    desc: "Bright citrus layered over real brewed tea. Crisp. Cold. Absolutely unreal.",
    price: "₹59",
    accent: "#FFE45E",
    accentDark: "#e6c800",
    emoji: "🍋",
    image: "/images/lemon-can.png",
    notes: ["Yuzu Citrus", "Green Tea Base", "Lemongrass Finish"],
    gradient: "linear-gradient(135deg, #FFF9D4 0%, #FFE45E 100%)",
  },
  {
    id: 2,
    name: "Peach Rush",
    tag: "SMOOTH VIBES",
    desc: "Smooth peach meets zero-sugar tea energy. No crash. Just pure vibe.",
    price: "₹59",
    accent: "#FFB38A",
    accentDark: "#e8824a",
    emoji: "🍑",
    image: "/images/peach-can.png",
    notes: ["White Peach", "Oolong Base", "Vanilla Drift"],
    gradient: "linear-gradient(135deg, #FFF0E6 0%, #FFB38A 100%)",
  },
];

const WHY = [
  { icon: "🍃", title: "Real Brewed Tea", desc: "Authentic whole-leaf tea, brewed slow and cold for a genuinely clean flavour profile." },
  { icon: "⚡", title: "Zero Sugar", desc: "Naturally sweetened. No spikes, no crash. Just sustained, clean hydration all day." },
  { icon: "🧪", title: "No Preservatives", desc: "If you can't pronounce it, we don't add it. Minimal ingredients, maximum refreshment." },
  { icon: "🎯", title: "Gen-Z Energy", desc: "Built for creators, athletes and people who move fast. No compromise on taste or label." },
];

const MARQUEE_ITEMS = ["REAL TEA", "ZERO SUGAR", "NO PRESERVATIVES", "CLEAN LABEL", "BREWED SLOW", "100% HONEST"];

function useCountup(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

export default function App() {
  const [waitlistCount, setWaitlistCount] = useState(247);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedFlavour, setSelectedFlavour] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  const c1 = useCountup(247, 1800, statsVisible);
  const c2 = useCountup(100, 1800, statsVisible);
  const c3 = useCountup(0, 1800, statsVisible);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const [activeCan, setActiveCan] = useState(0);
  const heroCans = ["/images/lemon-can.png", "/images/peach-can.png"];

  useEffect(() => {
    const interval = setInterval(() => setActiveCan(p => (p + 1) % heroCans.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const handleWaitlist = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setWaitlistCount(c => c + 1);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Satoshi', sans-serif", background: "#FAFAF7", color: "#111", overflowX: "hidden", cursor: "default" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900;1,9..40,400&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .display { font-family: 'Bebas Neue', sans-serif; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform:translateY(0px) rotate(-2deg); } 50% { transform:translateY(-18px) rotate(2deg); } }
        @keyframes marqueeTick { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes pulseRing { 0% { transform:scale(0.9); opacity:0.6; } 100% { transform:scale(1.4); opacity:0; } }
        @keyframes spinSlow { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes shimmer { 0%,100% { opacity:0.4; } 50% { opacity:0.9; } }
        .fade-up { animation: fadeUp 0.8s both; }
        .float-can { animation: float 6s ease-in-out infinite; }
        .marquee-track { display:flex; width:max-content; animation: marqueeTick 20s linear infinite; }
        .nav-link { text-decoration:none; color:#111; font-weight:600; font-size:0.9rem; letter-spacing:0.5px; transition:color 0.2s; }
        .nav-link:hover { color:#888; }
        .btn-pill { border:none; border-radius:999px; font-family:'DM Sans',sans-serif; font-weight:700; cursor:pointer; transition:all 0.2s; letter-spacing:0.3px; }
        .btn-dark { background:#111; color:white; }
        .btn-dark:hover { transform:translateY(-2px) scale(1.02); background:#222; }
        .btn-light { background:white; color:#111; border:1.5px solid #e5e5e5; }
        .btn-light:hover { border-color:#aaa; transform:translateY(-2px); }
        .btn-yellow { background:#FFE45E; color:#111; }
        .btn-yellow:hover { transform:translateY(-2px) scale(1.02); background:#ffd700; }
        .flavour-card { transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1); cursor:pointer; }
        .flavour-card:hover { transform: translateY(-12px) scale(1.01); }
        .flavour-card:hover .flavour-can-img { transform: rotate(-6deg) scale(1.1); }
        .why-card { transition: all 0.3s; }
        .why-card:hover { transform:translateY(-8px); box-shadow:0 20px 50px rgba(0,0,0,0.08); }
        .input-email { border:1.5px solid #e5e5e5; border-radius:999px; padding:16px 24px; font-family:'DM Sans',sans-serif; font-size:1rem; outline:none; transition:border 0.2s; background:white; }
        .input-email:focus { border-color:#111; }
        .pulse-ring { position:absolute; border-radius:50%; border:2px solid rgba(255,228,94,0.5); animation:pulseRing 2s ease-out infinite; }
        .tag-pill { display:inline-flex; align-items:center; gap:6px; background:white; border-radius:999px; padding:8px 16px; font-size:0.75rem; font-weight:700; letter-spacing:1px; box-shadow:0 4px 20px rgba(0,0,0,0.08); }
        .section-label { font-size:0.75rem; font-weight:700; letter-spacing:3px; color:#888; text-transform:uppercase; }
        .gradient-text { background: linear-gradient(135deg, #111 40%, #888); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .hero-can-container { position:relative; display:flex; align-items:center; justify-content:center; height:560px; }
        .can-placeholder { width:220px; height:380px; border-radius:60px; display:flex; align-items:center; justify-content:center; font-size:5rem; box-shadow:0 40px 80px rgba(0,0,0,0.15); }
        .stat-card { background:white; border-radius:20px; padding:28px; text-align:center; }
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:1000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px); animation:fadeUp 0.2s both; }
        .modal-inner { background:white; border-radius:32px; padding:48px; max-width:500px; width:90%; position:relative; }
        @media(max-width:768px) {
          .hero-grid { grid-template-columns:1fr !important; }
          .story-grid { grid-template-columns:1fr !important; }
          .nav-links { display:none !important; }
          .hero-can-container { height:360px; }
          .can-placeholder { width:160px; height:280px; font-size:4rem; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 500,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: scrollY > 40 ? "14px 6%" : "22px 6%",
        background: scrollY > 40 ? "rgba(250,250,247,0.9)" : "transparent",
        backdropFilter: scrollY > 40 ? "blur(20px)" : "none",
        borderBottom: scrollY > 40 ? "1px solid rgba(0,0,0,0.06)" : "none",
        transition: "all 0.4s",
      }}>
        <div className="display" style={{ fontSize: "2.2rem", letterSpacing: "4px" }}>QUENCH</div>
        <div className="nav-links" style={{ display: "flex", gap: "36px" }}>
          <a href="#flavours" className="nav-link">Flavours</a>
          <a href="#why" className="nav-link">Why Us</a>
          <a href="#story" className="nav-link">Story</a>
          <a href="#waitlist" className="nav-link">Pre-order</a>
        </div>
        <a href="#waitlist">
          <button className="btn-pill btn-dark" style={{ padding: "12px 22px", fontSize: "0.85rem" }}>
            Join Waitlist →
          </button>
        </a>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 6% 80px", position: "relative", overflow: "hidden" }}>
        {/* Background blobs */}
        <div style={{ position: "absolute", width: 600, height: 600, background: "radial-gradient(circle, rgba(255,228,94,0.35) 0%, transparent 70%)", top: -100, right: -100, borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 400, height: 400, background: "radial-gradient(circle, rgba(255,179,138,0.3) 0%, transparent 70%)", bottom: -80, left: -80, borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 300, height: 300, background: "radial-gradient(circle, rgba(217,255,63,0.2) 0%, transparent 70%)", top: "35%", right: "35%", borderRadius: "50%", pointerEvents: "none" }} />

        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", width: "100%", position: "relative", zIndex: 2 }}>
          {/* Left */}
          <div>
            <div className="fade-up tag-pill" style={{ marginBottom: 24, animationDelay: "0s" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }}></span>
              NOW TAKING PRE-ORDERS · SHIPS Q3 2025
            </div>

            <h1 className="display fade-up" style={{
              fontSize: "clamp(5.5rem, 11vw, 10rem)",
              lineHeight: 0.88,
              letterSpacing: "-2px",
              marginBottom: 24,
              animationDelay: "0.1s"
            }}>
              TEA<br />
              THAT<br />
              <span style={{ color: "#FFE45E", WebkitTextStroke: "2px #111" }}>HITS.</span>
            </h1>

            <p className="fade-up" style={{ color: "#666", lineHeight: 1.8, fontSize: "1.05rem", maxWidth: 460, marginBottom: 36, animationDelay: "0.25s" }}>
              Premium clean-label iced tea for the next generation.
              Real brewed tea, zero sugar, zero BS. Two flavours. One mission.
            </p>

            <div className="fade-up" style={{ display: "flex", gap: 12, marginBottom: 48, flexWrap: "wrap", animationDelay: "0.35s" }}>
              <a href="#waitlist">
                <button className="btn-pill btn-dark" style={{ padding: "16px 28px", fontSize: "0.95rem" }}>
                  Claim Early Access →
                </button>
              </a>
              <a href="#flavours">
                <button className="btn-pill btn-light" style={{ padding: "16px 28px", fontSize: "0.95rem" }}>
                  See Flavours
                </button>
              </a>
            </div>

            <div ref={statsRef} className="fade-up" style={{ display: "flex", gap: 40, animationDelay: "0.45s" }}>
              {[
                { val: `${c1}+`, label: "On Waitlist" },
                { val: `${c2}%`, label: "Real Tea" },
                { val: `${c3}g`, label: "Sugar" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="display" style={{ fontSize: "2.8rem", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: "0.8rem", color: "#888", marginTop: 4, fontWeight: 600, letterSpacing: "1px" }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Can Visual */}
          <div className="hero-can-container">
            {/* Rings */}
            {[240, 360, 480].map((size, i) => (
              <div key={i} style={{
                position: "absolute", width: size, height: size, borderRadius: "50%",
                border: "1px solid rgba(0,0,0,0.07)",
                animation: `pulseRing ${3 + i}s ease-out infinite`,
                animationDelay: `${i * 0.8}s`,
              }} />
            ))}

            {/* Glow */}
            <div style={{
              position: "absolute", width: 280, height: 280, borderRadius: "50%",
              background: "rgba(255,228,94,0.45)", filter: "blur(60px)",
            }} />

            {/* Can image — cycles between flavours */}
            <div className="float-can" style={{ position: "relative", zIndex: 5 }}>
              <img
                src={heroCans[activeCan]}
                alt="QUENCH can"
                style={{
                  width: 280, height: "auto",
                  filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.22))",
                  transition: "opacity 0.6s ease",
                  display: "block",
                }}
              />
            </div>

            {/* Floating tags */}
            {[
              { label: "Zero Sugar", top: "12%", left: "-5%" },
              { label: "Real Brewed Tea", top: "50%", right: "-8%" },
              { label: "No Preservatives", bottom: "14%", left: "5%" },
            ].map((t, i) => (
              <div key={i} className="tag-pill" style={{
                position: "absolute", ...t,
                animationDelay: `${i * 0.5}s`,
                fontSize: "0.7rem",
              }}>{t.label}</div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ overflow: "hidden", background: "#111", padding: "18px 0" }}>
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{
              color: "white", fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.2rem", letterSpacing: "4px", padding: "0 32px", opacity: i % 2 === 0 ? 1 : 0.4,
            }}>
              {item} {i % 2 === 0 ? "✦" : "·"}
            </span>
          ))}
        </div>
      </div>

      {/* FLAVOURS */}
      <section id="flavours" style={{ padding: "120px 6%" }}>
        <div style={{ marginBottom: 60 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>OUR FLAVOURS</div>
          <h2 className="display" style={{ fontSize: "clamp(3.5rem, 7vw, 6.5rem)", lineHeight: 0.9 }}>
            PICK YOUR<br />
            <span style={{ color: "#FFE45E", WebkitTextStroke: "1.5px #111" }}>VIBE.</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {FLAVOURS.map((f) => (
            <div key={f.id} className="flavour-card" onClick={() => setSelectedFlavour(f)}
              style={{
                background: "white", borderRadius: 32, padding: 40, border: "1.5px solid #f0f0f0",
                position: "relative", overflow: "hidden",
              }}>
              {/* bg blob */}
              <div style={{
                position: "absolute", width: 260, height: 260, borderRadius: "50%",
                background: f.accent, top: -120, right: -80, filter: "blur(50px)", opacity: 0.35,
              }} />

              <div style={{
                display: "inline-block", background: "#111", color: "white",
                padding: "6px 14px", borderRadius: "999px", fontSize: "0.68rem",
                fontWeight: 700, letterSpacing: "1.5px", marginBottom: 28,
              }}>{f.tag}</div>

              {/* Can image */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
                <img
                  src={f.image}
                  alt={f.name}
                  style={{
                    height: 220, width: "auto",
                    filter: `drop-shadow(0 20px 40px ${f.accent}80)`,
                    transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                    display: "block",
                  }}
                  className="flavour-can-img"
                />
              </div>

              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                {f.notes.map(n => (
                  <span key={n} style={{
                    background: "#f5f5f0", borderRadius: "999px", padding: "4px 12px",
                    fontSize: "0.7rem", fontWeight: 600, color: "#555",
                  }}>{n}</span>
                ))}
              </div>

              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", marginBottom: 10, letterSpacing: "1px" }}>{f.name}</h3>
              <p style={{ color: "#777", lineHeight: 1.75, marginBottom: 28, fontSize: "0.9rem" }}>{f.desc}</p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#aaa", fontWeight: 600, letterSpacing: "1px" }}>PER CAN</div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.2rem" }}>{f.price}</div>
                </div>
                <button className="btn-pill" style={{
                  padding: "12px 24px", background: f.accent, color: "#111",
                  fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
                  border: "none",
                }}>
                  Pre-order +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Combo deal */}
        <div style={{
          marginTop: 24, background: "#111", borderRadius: 28, padding: "36px 40px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20,
        }}>
          <div>
            <div style={{ color: "#FFE45E", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "2px", marginBottom: 6 }}>BEST VALUE</div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2rem", color: "white", letterSpacing: "2px" }}>MIXED CASE · 12 CANS</div>
            <div style={{ color: "#888", fontSize: "0.85rem", marginTop: 4 }}>6 Lemon Smash + 6 Peach Rush · Free shipping</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#555", textDecoration: "line-through", fontSize: "0.9rem" }}>₹708</div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.5rem", color: "white" }}>₹599</div>
            </div>
            <a href="#waitlist">
              <button className="btn-pill btn-yellow" style={{ padding: "16px 28px", fontSize: "0.9rem" }}>
                Pre-order Pack →
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* WHY QUENCH */}
      <section id="why" style={{ padding: "120px 6%", background: "#F5F4EF" }}>
        <div style={{ marginBottom: 60 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>WHY QUENCH</div>
          <h2 className="display" style={{ fontSize: "clamp(3.5rem, 7vw, 6.5rem)", lineHeight: 0.9 }}>
            BUILT<br />
            <span style={{ color: "#FFE45E", WebkitTextStroke: "1.5px #111" }}>DIFFERENT.</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {WHY.map((w, i) => (
            <div key={i} className="why-card" style={{
              background: "white", borderRadius: 24, padding: 32,
              border: "1.5px solid #efefef",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>{w.icon}</div>
              <h3 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.8rem", marginBottom: 10, letterSpacing: "1px" }}>{w.title}</h3>
              <p style={{ color: "#777", lineHeight: 1.75, fontSize: "0.9rem" }}>{w.desc}</p>
            </div>
          ))}
        </div>

        {/* Ingredient compare */}
        <div style={{ marginTop: 60, background: "white", borderRadius: 28, padding: 40, border: "1.5px solid #efefef" }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.6rem", letterSpacing: "2px", marginBottom: 28, color: "#aaa" }}>
            QUENCH VS THE REST
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
            {[
              { label: "INGREDIENT", vals: ["Real Brewed Tea", "Zero Added Sugar", "No Preservatives", "No Artificial Colours", "Recyclable Can"] },
              { label: "QUENCH", vals: ["✅", "✅", "✅", "✅", "✅"], accent: "#FFE45E" },
              { label: "TYPICAL ICED TEA", vals: ["❌", "❌", "❌", "❌", "⚠️"] },
            ].map((col, ci) => (
              <div key={ci} style={{ borderLeft: ci > 0 ? "1px solid #f0f0f0" : "none" }}>
                <div style={{
                  fontWeight: 700, fontSize: "0.7rem", letterSpacing: "2px", color: "#aaa",
                  padding: "0 20px 16px", borderBottom: "1px solid #f0f0f0",
                  background: col.accent ? col.accent + "30" : "transparent",
                }}>{col.label}</div>
                {col.vals.map((v, vi) => (
                  <div key={vi} style={{
                    padding: "14px 20px", borderBottom: vi < col.vals.length - 1 ? "1px solid #f5f5f5" : "none",
                    fontSize: "0.88rem", color: ci === 0 ? "#444" : "#111",
                    fontWeight: ci === 0 ? 500 : 400,
                    background: col.accent ? col.accent + "15" : "transparent",
                  }}>{v}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" style={{ padding: "120px 6%" }}>
        <div className="story-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div className="section-label" style={{ marginBottom: 16 }}>OUR STORY</div>
            <h2 className="display" style={{ fontSize: "clamp(3.5rem, 6vw, 6rem)", lineHeight: 0.9, marginBottom: 32 }}>
              BORN FROM<br />
              FRUSTRATION.<br />
              <span style={{ color: "#FFE45E", WebkitTextStroke: "1.5px #111" }}>BUILT WITH</span><br />
              OBSESSION.
            </h2>

            {/* Timeline */}
            {[
              { year: "2023", event: "Fed up with sugary, fake iced teas" },
              { year: "2024", event: "50+ recipes brewed in a home kitchen" },
              { year: "2025", event: "QUENCH launches to the world" },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 20, marginBottom: 20, alignItems: "flex-start" }}>
                <div style={{
                  minWidth: 56, height: 28, background: "#FFE45E", borderRadius: 999,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: "0.75rem",
                }}>{t.year}</div>
                <div style={{ color: "#666", paddingTop: 4, lineHeight: 1.6 }}>{t.event}</div>
              </div>
            ))}
          </div>

          <div>
            <p style={{ color: "#555", lineHeight: 1.9, marginBottom: 24, fontSize: "1.05rem" }}>
              Every iced tea brand we loved was loaded with sugar or packed with stuff
              we couldn't pronounce. So we stopped buying and started brewing.
            </p>
            <p style={{ color: "#555", lineHeight: 1.9, marginBottom: 24, fontSize: "1.05rem" }}>
              QUENCH started as a frustration, became an obsession, and is now ready
              to become your new favourite drink. Two flavours. Zero compromise.
              Made for people who actually read labels.
            </p>
            <p style={{ color: "#555", lineHeight: 1.9, marginBottom: 40, fontSize: "1.05rem" }}>
              We're a small team. Pre-orders go live first to early believers.
              Be one of them.
            </p>
            <a href="#waitlist">
              <button className="btn-pill btn-dark" style={{ padding: "16px 28px", fontSize: "0.95rem" }}>
                Join the Movement →
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF TICKER */}
      <div style={{ background: "#FFE45E", padding: "48px 6%", textAlign: "center" }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", letterSpacing: "3px", marginBottom: 24, color: "#111" }}>
          WHAT EARLY TESTERS ARE SAYING
        </div>
        <div style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { quote: "Finally a tea that doesn't taste like sugar water.", name: "Arjun M., Mumbai" },
            { quote: "The Peach Rush is dangerously good.", name: "Priya S., Bangalore" },
            { quote: "I've had 3 cans today. No regrets.", name: "Rahul K., Delhi" },
          ].map((r, i) => (
            <div key={i} style={{
              background: "white", borderRadius: 20, padding: "20px 24px",
              maxWidth: 260, textAlign: "left", boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>⭐⭐⭐⭐⭐</div>
              <p style={{ color: "#333", lineHeight: 1.7, marginBottom: 12, fontSize: "0.88rem" }}>"{r.quote}"</p>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", letterSpacing: "1px" }}>{r.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WAITLIST / PRE-ORDER CTA */}
      <section id="waitlist" style={{ padding: "120px 6%", background: "#111", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,228,94,0.2) 0%, transparent 70%)",
          top: -200, right: -200,
        }} />
        <div style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,179,138,0.15) 0%, transparent 70%)",
          bottom: -150, left: -100,
        }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", borderRadius: "999px", padding: "8px 18px", marginBottom: 32 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "shimmer 2s infinite" }}></span>
            <span style={{ color: "#aaa", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "2px" }}>
              {waitlistCount} PEOPLE ALREADY WAITING
            </span>
          </div>

          <h2 className="display" style={{ fontSize: "clamp(4rem, 9vw, 8rem)", lineHeight: 0.9, color: "white", marginBottom: 20 }}>
            DON'T MISS<br />
            <span style={{ color: "#FFE45E" }}>LAUNCH DAY.</span>
          </h2>

          <p style={{ color: "#888", lineHeight: 1.8, marginBottom: 40, fontSize: "1rem" }}>
            Join the waitlist and be first to order when we launch.
            Early backers get <strong style={{ color: "white" }}>20% off their first case</strong> + free shipping.
          </p>

          {!submitted ? (
            <form onSubmit={handleWaitlist}>
              <div style={{ display: "flex", gap: 10, maxWidth: 480, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
                <input
                  type="email"
                  className="input-email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ flex: 1, minWidth: 220 }}
                  required
                />
                <button type="submit" className="btn-pill btn-yellow" style={{ padding: "16px 28px", fontSize: "0.9rem" }}>
                  Claim 20% Off →
                </button>
              </div>
              <div style={{ color: "#555", fontSize: "0.75rem", marginTop: 14 }}>
                No spam, ever. Just launch news and your exclusive discount.
              </div>
            </form>
          ) : (
            <div style={{
              background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "28px 36px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🎉</div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.8rem", color: "white", letterSpacing: "2px", marginBottom: 8 }}>
                YOU'RE IN!
              </div>
              <div style={{ color: "#888", fontSize: "0.9rem" }}>
                Check your inbox for a confirmation. Your 20% off code is waiting.
              </div>
            </div>
          )}

          {/* Trust signals */}
          <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
            {[
              { icon: "🔒", label: "No charge until launch" },
              { icon: "✈️", label: "Free shipping included" },
              { icon: "↩️", label: "Cancel anytime" },
            ].map((t, i) => (
              <div key={i} style={{ color: "#555", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <span>{t.icon}</span>{t.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "60px 6%", background: "#0a0a0a", textAlign: "center" }}>
        <div className="display" style={{ fontSize: "4rem", letterSpacing: "8px", color: "white", marginBottom: 8 }}>QUENCH</div>
        <div style={{ color: "#444", fontSize: "0.85rem", marginBottom: 32 }}>Tea That Hits Different. · Real. Clean. Unreal.</div>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {["Instagram", "Twitter / X", "hello@drinkquench.in", "Privacy Policy"].map(l => (
            <a key={l} href="#" style={{ color: "#444", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600, transition: "color 0.2s" }}
              onMouseOver={e => e.target.style.color = "#fff"}
              onMouseOut={e => e.target.style.color = "#444"}>{l}</a>
          ))}
        </div>
        <div style={{ color: "#2a2a2a", fontSize: "0.72rem", marginTop: 40 }}>© 2025 QUENCH BEVERAGES PVT LTD · MADE IN INDIA 🇮🇳</div>
      </footer>

      {/* FLAVOUR MODAL */}
      {selectedFlavour && (
        <div className="modal-overlay" onClick={() => setSelectedFlavour(null)}>
          <div className="modal-inner" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedFlavour(null)} style={{
              position: "absolute", top: 20, right: 20, background: "#f0f0f0",
              border: "none", borderRadius: "50%", width: 36, height: 36,
              cursor: "pointer", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <img
                src={selectedFlavour.image}
                alt={selectedFlavour.name}
                style={{
                  height: 200, width: "auto",
                  filter: `drop-shadow(0 20px 50px ${selectedFlavour.accent}60)`,
                  display: "block",
                }}
              />
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ background: "#111", color: "white", display: "inline-block", padding: "5px 12px", borderRadius: 999, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1.5px", marginBottom: 12 }}>
                {selectedFlavour.tag}
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.8rem", letterSpacing: "2px", marginBottom: 12 }}>{selectedFlavour.name}</h2>
              <p style={{ color: "#666", lineHeight: 1.75, marginBottom: 20 }}>{selectedFlavour.desc}</p>

              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 28, flexWrap: "wrap" }}>
                {selectedFlavour.notes.map(n => (
                  <span key={n} style={{ background: "#f5f5f0", borderRadius: 999, padding: "6px 14px", fontSize: "0.75rem", fontWeight: 600, color: "#555" }}>{n}</span>
                ))}
              </div>

              <div style={{ background: "#f5f5f0", borderRadius: 16, padding: "16px 20px", marginBottom: 24, textAlign: "left" }}>
                {[["Calories", "5 kcal"], ["Sugar", "0g"], ["Caffeine", "~35mg"], ["Ingredients", "Brewed Tea, Natural Flavour, Stevia"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #ebebeb", fontSize: "0.85rem" }}>
                    <span style={{ color: "#888", fontWeight: 600 }}>{k}</span>
                    <span style={{ color: "#333" }}>{v}</span>
                  </div>
                ))}
              </div>

              <a href="#waitlist" onClick={() => setSelectedFlavour(null)}>
                <button className="btn-pill" style={{
                  width: "100%", padding: "16px", fontSize: "1rem", fontWeight: 700,
                  background: selectedFlavour.accent, color: "#111", border: "none", cursor: "pointer",
                }}>
                  Pre-order {selectedFlavour.name} — {selectedFlavour.price}
                </button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}