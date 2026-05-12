import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   EMAILJS SETUP  (free tier = 200 emails/month)
   1. Create account at https://www.emailjs.com
   2. Add an Email Service (Gmail works great)
   3. Create a Template with these variables:
        {{to_name}}   {{to_email}}   {{reply_to}}
   4. Paste your IDs below
────────────────────────────────────────────────────────────────────────────── */
const EJS_SERVICE  = "service_12blv4h";
const EJS_TEMPLATE = "template_zqfza0j";
const EJS_KEY      = "2qiVqozantoDGpwH2";

/* ── Data ── */
const FLAVOURS = [
  {
    id: 1, name: "Lemon Smash", tag: "CITRUS ENERGY",
    desc: "Bright citrus layered over real brewed tea. Crisp. Cold. Absolutely unreal.",
    price: "₹59", accent: "#FFE45E", emoji: "🍋",
    image: "/images/lemon-can.png",
    notes: ["Yuzu Citrus", "Green Tea Base", "Lemongrass Finish"],
    gradient: "linear-gradient(135deg,#FFF9D4 0%,#FFE45E 100%)",
  },
  {
    id: 2, name: "Peach Rush", tag: "SMOOTH VIBES",
    desc: "Smooth peach meets zero-sugar tea energy. No crash. Just pure vibe.",
    price: "₹59", accent: "#FFB38A", emoji: "🍑",
    image: "/images/peach-can.png",
    notes: ["White Peach", "Oolong Base", "Vanilla Drift"],
    gradient: "linear-gradient(135deg,#FFF0E6 0%,#FFB38A 100%)",
  },
];

const WHY = [
  { icon: "🍃", title: "Real Brewed Tea",  desc: "Whole-leaf tea, brewed slow and cold for a genuinely clean flavour profile." },
  { icon: "⚡", title: "Zero Sugar",        desc: "Naturally sweetened. No spikes, no crash. Just clean hydration all day." },
  { icon: "🧪", title: "No Preservatives", desc: "If you can't pronounce it, we don't add it. Minimal ingredients, maximum refreshment." },
  { icon: "🎯", title: "Gen-Z Energy",      desc: "Built for creators, athletes and people who move fast. No compromise." },
];

const COMPARE = [
  { feature: "Real Brewed Tea",        quench: true,      rest: false },
  { feature: "Zero Added Sugar",       quench: true,      rest: false },
  { feature: "No Preservatives",       quench: true,      rest: false },
  { feature: "No Artificial Colours",  quench: true,      rest: false },
  { feature: "No Artificial Flavour",  quench: true,      rest: false },
  { feature: "Recyclable Packaging",   quench: true,      rest: "partial" },
  { feature: "Sub-10 Ingredients",     quench: true,      rest: false },
  { feature: "Stevia-Sweetened",       quench: true,      rest: false },
];

const MARQUEE = ["REAL TEA","ZERO SUGAR","NO PRESERVATIVES","CLEAN LABEL","BREWED SLOW","100% HONEST"];

/* ── Helpers ── */
function useCountup(target, duration = 1800, active = false) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let t0 = null;
    const tick = ts => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setN(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return n;
}

function saveLocal(entry) {
  const KEY = "quench_waitlist";
  const list = JSON.parse(localStorage.getItem(KEY) || "[]");
  list.push(entry);
  localStorage.setItem(KEY, JSON.stringify(list));
}

/* ── Main component ── */
export default function App() {
  const [dark, setDark]             = useState(() => window.matchMedia("(prefers-color-scheme:dark)").matches);
  const [scrollY, setScrollY]       = useState(0);
  const [activeCan, setActiveCan]   = useState(0);
  const [statsOn, setStatsOn]       = useState(false);
  const [selFlavour, setSelFlavour] = useState(null);
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [sending, setSending]       = useState(false);
  const [done, setDone]             = useState(false);
  const [wCount, setWCount]         = useState(247);
  const statsRef = useRef(null);
  const CANS = ["/images/lemon-can.png", "/images/peach-can.png"];

  const c1 = useCountup(247, 1800, statsOn);
  const c2 = useCountup(100, 1800, statsOn);
  const c3 = useCountup(0,   1800, statsOn);

  /* dark-mode system listener */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme:dark)");
    const fn = e => setDark(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsOn(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveCan(p => (p + 1) % CANS.length), 4200);
    return () => clearInterval(id);
  }, []);

  /* EmailJS submit + local storage */
  const handleSubmit = async e => {
    e.preventDefault();
    setSending(true);
    const entry = { name: name || "Friend", email, ts: new Date().toISOString() };
    try {
      if (!window.emailjs) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
        window.emailjs.init(EJS_KEY);
      }
      await window.emailjs.send(EJS_SERVICE, EJS_TEMPLATE, {
        to_name: name || "Friend",
        to_email: email,
        reply_to: email,
      });
    } catch (err) {
      /* EmailJS not configured yet – fail silently, still save */
      console.warn("EmailJS not configured – saved locally only.", err);
    }
    saveLocal(entry);
    setDone(true);
    setWCount(c => c + 1);
    setSending(false);
  };

  /* ── Design tokens (dark/light) ── */
  const d    = dark;
  const BG   = d ? "#0e0e0e" : "#FAFAF7";
  const BG2  = d ? "#161616" : "#F5F4EF";
  const CARD = d ? "#1c1c1c" : "#ffffff";
  const TX   = d ? "#f0f0f0" : "#111111";
  const MT   = d ? "#888888" : "#666666";
  const BR   = d ? "rgba(255, 255, 255, 0.07)" : "rgba(255, 255, 255, 0.07)";
  const YLW  = "#FFE45E";
  const navBG = scrollY > 40
    ? (d ? "rgba(14,14,14,0.92)" : "rgba(250,250,247,0.92)")
    : "transparent";

  return (
    <div style={{ fontFamily: "'DM Sans','Satoshi',sans-serif", background: BG, color: TX, overflowX: "hidden", transition: "background 0.3s,color 0.3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700;9..40,900&family=Bebas+Neue&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        .bb{font-family:'Bebas Neue',sans-serif;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatCan{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-20px) rotate(1.5deg)}}
        @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes pulse{0%{transform:scale(0.88);opacity:0.65}100%{transform:scale(1.45);opacity:0}}
        @keyframes shimmer{0%,100%{opacity:0.3}50%{opacity:1}}
        @keyframes canIn{from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}
        .fu{animation:fadeUp 0.75s both;}
        .fc{animation:floatCan 6s ease-in-out infinite;}
        .ci{animation:canIn 0.45s ease both;}
        .mq-t{display:flex;width:max-content;animation:mq 22s linear infinite;}
        .pill{border:none;border-radius:999px;font-family:'DM Sans',sans-serif;font-weight:700;cursor:pointer;transition:all 0.2s;}
        .pd{background:#111;color:#fff;} .pd:hover{transform:translateY(-2px) scale(1.02);background:#252525;}
        .pl{background:#fff;color:#111;border:1.5px solid #e0e0e0;} .pl:hover{border-color:#aaa;transform:translateY(-2px);}
        .py{background:#FFE45E;color:#111;} .py:hover{transform:translateY(-2px) scale(1.02);background:#ffd700;}
        .fcard{transition:all 0.35s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer;}
        .fcard:hover{transform:translateY(-14px) scale(1.015);}
        .fcard:hover .cimg{transform:rotate(-7deg) scale(1.13);}
        .cimg{transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);}
        .wcard:hover{transform:translateY(-8px);}
        .wcard{transition:transform 0.28s;}
        .inp{border-radius:999px;padding:14px 22px;font-family:'DM Sans',sans-serif;font-size:0.95rem;outline:none;transition:border 0.2s;width:100%;}
        .sl{font-size:0.7rem;font-weight:700;letter-spacing:3px;color:#888;text-transform:uppercase;}
        .ov{position:fixed;inset:0;background:rgba(0,0,0,0.68);z-index:1000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);animation:fadeUp 0.18s both;}
        .mi{border-radius:32px;padding:44px;max-width:500px;width:92%;position:relative;max-height:90vh;overflow-y:auto;}
        /* hero orbit tags */
        .orb{position:absolute;display:flex;align-items:center;gap:7px;border-radius:999px;padding:9px 16px;font-size:0.71rem;font-weight:700;letter-spacing:0.8px;white-space:nowrap;pointer-events:none;backdrop-filter:blur(12px);}
        @media(max-width:820px){
          .hg,.sg{grid-template-columns:1fr!important;}
          .nl{display:none!important;}
          .hcc{height:400px!important;}
          .orb{display:none!important;}
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ position:"fixed",top:0,width:"100%",zIndex:500,display:"flex",alignItems:"center",justifyContent:"space-between",
        padding: scrollY>40?"14px 6%":"22px 6%", background:navBG,
        backdropFilter: scrollY>40?"blur(20px)":"none",
        borderBottom: scrollY>40?`1px solid ${BR}`:"none", transition:"all 0.35s" }}>
        <div className="bb" style={{fontSize:"2.1rem",letterSpacing:"4px",color:TX}}>QUENCH</div>
        <div className="nl" style={{display:"flex",gap:"34px"}}>
          {["Flavours","Why Us","Story","Pre-order"].map((l,i)=>(
            <a key={l} href={`#${["flavours","why","story","waitlist"][i]}`}
              style={{textDecoration:"none",color:TX,fontWeight:600,fontSize:"0.88rem",opacity:0.85,transition:"opacity 0.2s"}}
              onMouseOver={e=>e.target.style.opacity="0.4"}
              onMouseOut={e=>e.target.style.opacity="0.85"}>{l}</a>
          ))}
        </div>
        <a href="#waitlist"><button className="pill pd" style={{padding:"11px 22px",fontSize:"0.82rem"}}>Join Waitlist →</button></a>
      </nav>

      {/* ── HERO ── */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",padding:"120px 6% 80px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:560,height:560,background:"radial-gradient(circle,rgba(255,228,94,0.3) 0%,transparent 70%)",top:-100,right:-100,borderRadius:"50%",pointerEvents:"none"}}/>
        <div style={{position:"absolute",width:380,height:380,background:"radial-gradient(circle,rgba(255,179,138,0.22) 0%,transparent 70%)",bottom:-80,left:-80,borderRadius:"50%",pointerEvents:"none"}}/>

        <div className="hg" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center",width:"100%",position:"relative",zIndex:2}}>
          {/* left */}
          <div>
            <div className="fu" style={{marginBottom:22,display:"inline-flex",alignItems:"center",gap:6,
              background:CARD,boxShadow:`0 4px 20px ${BR}`,borderRadius:999,padding:"8px 16px",
              fontSize:"0.7rem",fontWeight:700,letterSpacing:"1px",animationDelay:"0s",color:TX}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",display:"inline-block"}}/>
              NOW TAKING PRE-ORDERS · SHIPS Q3 2025
            </div>
            <h1 className="bb fu" style={{fontSize:"clamp(5rem,11vw,9.5rem)",lineHeight:0.88,letterSpacing:"-1px",marginBottom:22,color:TX,animationDelay:"0.1s"}}>
              TEA<br/>THAT<br/><span style={{color:YLW,WebkitTextStroke:`2px ${TX}`}}>HITS.</span>
            </h1>
            <p className="fu" style={{color:MT,lineHeight:1.8,fontSize:"1rem",maxWidth:460,marginBottom:34,animationDelay:"0.22s"}}>
              Premium clean-label iced tea for the next generation. Real brewed tea, zero sugar, zero BS. Two flavours. One mission.
            </p>
            <div className="fu" style={{display:"flex",gap:12,marginBottom:46,flexWrap:"wrap",animationDelay:"0.32s"}}>
              <a href="#waitlist"><button className="pill pd" style={{padding:"15px 26px",fontSize:"0.93rem"}}>Claim Early Access →</button></a>
              <a href="#flavours"><button className="pill pl" style={{padding:"15px 26px",fontSize:"0.93rem"}}>See Flavours</button></a>
            </div>
            <div ref={statsRef} className="fu" style={{display:"flex",gap:40,animationDelay:"0.42s"}}>
              {[{v:`${c1}+`,l:"On Waitlist"},{v:`${c2}%`,l:"Real Tea"},{v:`${c3}g`,l:"Sugar"}].map((s,i)=>(
                <div key={i}>
                  <div className="bb" style={{fontSize:"2.6rem",lineHeight:1,color:TX}}>{s.v}</div>
                  <div style={{fontSize:"0.7rem",color:"#888",marginTop:3,fontWeight:700,letterSpacing:"1px"}}>{s.l.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* right — can + orbit badges */}
          <div className="hcc" style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",height:560}}>
            {[220,340,460].map((sz,i)=>(
              <div key={i} style={{position:"absolute",width:sz,height:sz,borderRadius:"50%",
                border:`1px solid ${d?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.06)"}`,
                animation:`pulse ${3.2+i}s ease-out infinite`,animationDelay:`${i*0.9}s`}}/>
            ))}
            <div style={{position:"absolute",width:260,height:260,borderRadius:"50%",
              background:"rgba(255,228,94,0.38)",filter:"blur(55px)"}}/>

            <div className="fc" style={{position:"relative",zIndex:5}}>
              <img key={activeCan} src={CANS[activeCan]} alt="QUENCH can" className="ci"
                style={{width:270,height:"auto",filter:"drop-shadow(0 36px 55px rgba(0,0,0,0.28))",display:"block"}}/>
            </div>

            {/* Orbit badges — clean, glassmorphic, well-spaced */}
            {[
              {txt:"⚡ Zero Sugar",        top:"9%",   left:"-2%"},
              {txt:"🍃 Real Brewed Tea",   top:"46%",  right:"-6%"},
              {txt:"🧪 No Preservatives",  bottom:"11%",left:"1%"},
            ].map((b,i)=>(
              <div key={i} className="orb" style={{
                top:b.top,left:b.left,right:b.right,bottom:b.bottom,
                background: d?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.88)",
                border:`1px solid ${BR}`,
                boxShadow: d?"none":"0 6px 24px rgba(0,0,0,0.08)",
                color:TX,
              }}>{b.txt}</div>
            ))}

            {/* dot switcher */}
            <div style={{position:"absolute",bottom:"-18px",display:"flex",gap:8,zIndex:10}}>
              {CANS.map((_,i)=>(
                <button key={i} onClick={()=>setActiveCan(i)} style={{
                  width:i===activeCan?26:8,height:8,borderRadius:999,
                  background:i===activeCan?YLW:(d?"#333":"#ccc"),
                  border:"none",cursor:"pointer",transition:"all 0.3s",padding:0}}/>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{overflow:"hidden",background:"#111",padding:"17px 0"}}>
        <div className="mq-t">
          {[...MARQUEE,...MARQUEE].map((item,i)=>(
            <span key={i} style={{color:"white",fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"1.15rem",letterSpacing:"4px",padding:"0 30px",opacity:i%2===0?1:0.3}}>
              {item} {i%2===0?"✦":"·"}
            </span>
          ))}
        </div>
      </div>

      {/* ── FLAVOURS ── */}
      <section id="flavours" style={{padding:"110px 6%",background:BG}}>
        <div style={{marginBottom:54}}>
          <div className="sl" style={{marginBottom:14}}>OUR FLAVOURS</div>
          <h2 className="bb" style={{fontSize:"clamp(3rem,7vw,6rem)",lineHeight:0.9,color:TX}}>
            PICK YOUR<br/><span style={{color:YLW,WebkitTextStroke:`1.5px ${TX}`}}>VIBE.</span>
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:22}}>
          {FLAVOURS.map(f=>(
            <div key={f.id} className="fcard" onClick={()=>setSelFlavour(f)}
              style={{background:CARD,borderRadius:32,padding:38,border:`1.5px solid ${BR}`,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",width:240,height:240,borderRadius:"50%",background:f.accent,top:-110,right:-70,filter:"blur(48px)",opacity:d?0.15:0.28}}/>
              <div style={{display:"inline-block",background:"#111",color:"white",padding:"5px 13px",borderRadius:999,
                fontSize:"0.63rem",fontWeight:700,letterSpacing:"1.5px",marginBottom:26}}>{f.tag}</div>
              <div style={{display:"flex",justifyContent:"center",marginBottom:24}}>
                <img src={f.image} alt={f.name} className="cimg"
                  style={{height:210,width:"auto",filter:`drop-shadow(0 18px 36px ${f.accent}70)`,display:"block"}}/>
              </div>
              <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
                {f.notes.map(n=><span key={n} style={{background:d?"#2a2a2a":"#f4f4ef",borderRadius:999,
                  padding:"4px 12px",fontSize:"0.67rem",fontWeight:600,color:MT}}>{n}</span>)}
              </div>
              <h3 className="bb" style={{fontSize:"2.4rem",marginBottom:8,letterSpacing:"1px",color:TX}}>{f.name}</h3>
              <p style={{color:MT,lineHeight:1.75,marginBottom:26,fontSize:"0.87rem"}}>{f.desc}</p>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:"0.63rem",color:"#888",fontWeight:700,letterSpacing:"1px"}}>PER CAN</div>
                  <div className="bb" style={{fontSize:"2.1rem",color:TX}}>{f.price}</div>
                </div>
                <button className="pill" style={{padding:"11px 22px",background:f.accent,color:"#111",
                  fontSize:"0.81rem",fontWeight:700,border:"none"}}>Pre-order +</button>
              </div>
            </div>
          ))}
        </div>
        {/* combo */}
        <div style={{marginTop:22,background:"#111",borderRadius:26,padding:"30px 36px",
          display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{color:YLW,fontWeight:700,fontSize:"0.7rem",letterSpacing:"2px",marginBottom:5}}>BEST VALUE</div>
            <div className="bb" style={{fontSize:"1.9rem",color:"white",letterSpacing:"2px"}}>MIXED CASE · 12 CANS</div>
            <div style={{color:"#555",fontSize:"0.8rem",marginTop:3}}>6 Lemon Smash + 6 Peach Rush · Free shipping</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div>
              <div style={{color:"#444",textDecoration:"line-through",fontSize:"0.85rem"}}>₹708</div>
              <div className="bb" style={{fontSize:"2.4rem",color:"white"}}>₹599</div>
            </div>
            <a href="#waitlist"><button className="pill py" style={{padding:"14px 24px",fontSize:"0.87rem"}}>Pre-order Pack →</button></a>
          </div>
        </div>
      </section>

      {/* ── WHY + COMPARE ── */}
{/* ── WHY + COMPARE ── */}
<section id="why" style={{ padding: "110px 6%", background: BG2 }}>
  <div style={{ marginBottom: 54 }}>
    <div className="sl" style={{ marginBottom: 14 }}>
      WHY QUENCH
    </div>

    <h2
      className="bb"
      style={{
        fontSize: "clamp(3rem,7vw,6rem)",
        lineHeight: 0.9,
        color: TX,
      }}
    >
      BUILT
      <br />
      <span
        style={{
          color: YLW,
          WebkitTextStroke: `1.5px ${TX}`,
        }}
      >
        DIFFERENT.
      </span>
    </h2>
  </div>

  {/* WHY CARDS */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
      gap: 16,
      marginBottom: 70,
    }}
  >
    {WHY.map((w, i) => (
      <div
        key={i}
        className="wcard"
        style={{
          background: CARD,
          borderRadius: 22,
          padding: 28,
          border: `1.5px solid ${BR}`,
        }}
      >
        <div style={{ fontSize: "2.1rem", marginBottom: 12 }}>
          {w.icon}
        </div>

        <h3
          className="bb"
          style={{
            fontSize: "1.65rem",
            marginBottom: 8,
            letterSpacing: "1px",
            color: TX,
          }}
        >
          {w.title}
        </h3>

        <p
          style={{
            color: MT,
            lineHeight: 1.75,
            fontSize: "0.85rem",
          }}
        >
          {w.desc}
        </p>
      </div>
    ))}
  </div>

  {/* ── QUENCH VS REST ── */}
  <div
    style={{
      background: CARD,
      borderRadius: 28,
      border: `1px solid ${BR}`,
      overflow: "hidden",
    }}
  >
    {/* Heading */}
    <div
      style={{
        padding: "30px 24px",
        borderBottom: `1px solid ${BR}`,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "2px",
          color: "#888",
          marginBottom: 10,
        }}
      >
        QUENCH VS THE REST
      </div>

      <h3
        className="bb"
        style={{
          fontSize: "clamp(2rem,5vw,3.5rem)",
          color: TX,
          letterSpacing: "2px",
        }}
      >
        CLEANER. LIGHTER.
        <br />
        <span style={{ color: YLW }}>BETTER.</span>
      </h3>
    </div>

    {/* Table Header */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr 1fr",
        padding: "18px 22px",
        borderBottom: `1px solid ${BR}`,
        background: d
          ? "rgba(255,255,255,0.02)"
          : "rgba(0,0,0,0.02)",
      }}
    >
      <div
        style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "1.5px",
          color: "#888",
        }}
      >
        FEATURES
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: "0.78rem",
          fontWeight: 800,
          color: TX,
          letterSpacing: "1px",
        }}
      >
        QUENCH
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: "0.78rem",
          fontWeight: 800,
          color: "#888",
          letterSpacing: "1px",
        }}
      >
        OTHERS
      </div>
    </div>

    {/* Rows */}
    {COMPARE.map((row, ri) => (
      <div
        key={ri}
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr",
          alignItems: "center",
          padding: "18px 22px",
          borderBottom:
            ri !== COMPARE.length - 1
              ? `1px solid ${BR}`
              : "none",
          background:
            ri % 2 === 0
              ? "transparent"
              : d
              ? "rgba(255,255,255,0.015)"
              : "rgba(0,0,0,0.015)",
        }}
      >
        {/* Feature */}
        <div
          style={{
            fontSize: "0.86rem",
            fontWeight: 600,
            color: TX,
            lineHeight: 1.5,
            paddingRight: 10,
          }}
        >
          {row.feature}
        </div>

        {/* Quench */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "rgba(34,197,94,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            ✅
          </div>
        </div>

        {/* Others */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background:
                row.rest === "partial"
                  ? "rgba(234,179,8,0.12)"
                  : "rgba(239,68,68,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            {row.rest === "partial" ? "⚠️" : "❌"}
          </div>
        </div>
      </div>
    ))}

    {/* Footer */}
    <div
      style={{
        padding: "16px 22px",
        textAlign: "center",
        borderTop: `1px solid ${BR}`,
        background: d
          ? "rgba(255,255,255,0.02)"
          : "rgba(0,0,0,0.02)",
      }}
    >
      <span
        style={{
          fontSize: "0.75rem",
          color: MT,
          lineHeight: 1.6,
        }}
      >
        Minimal ingredients. Maximum refreshment.
      </span>
    </div>
  </div>
</section>

      {/* ── STORY ── */}
      <section id="story" style={{padding:"110px 6%",background:BG}}>
        <div className="sg" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
          <div>
            <div className="sl" style={{marginBottom:14}}>OUR STORY</div>
            <h2 className="bb" style={{fontSize:"clamp(2.8rem,6vw,5.5rem)",lineHeight:0.9,marginBottom:28,color:TX}}>
              BORN FROM<br/>FRUSTRATION.<br/>
              <span style={{color:YLW,WebkitTextStroke:`1.5px ${TX}`}}>BUILT WITH</span><br/>OBSESSION.
            </h2>
            {[
              {year:"2023",event:"Fed up with sugary, fake iced teas"},
              {year:"2024",event:"50+ recipes brewed in a home kitchen"},
              {year:"2025",event:"QUENCH launches to the world"},
            ].map((t,i)=>(
              <div key={i} style={{display:"flex",gap:14,marginBottom:16,alignItems:"flex-start"}}>
                <div style={{minWidth:50,height:25,background:YLW,borderRadius:999,display:"flex",
                  alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:"0.7rem"}}>{t.year}</div>
                <div style={{color:MT,paddingTop:3,lineHeight:1.6,fontSize:"0.88rem"}}>{t.event}</div>
              </div>
            ))}
          </div>
          <div>
            {["Every iced tea brand we loved was loaded with sugar or packed with stuff we couldn't pronounce. So we stopped buying and started brewing.",
              "QUENCH started as a frustration, became an obsession, and is now ready to be your new favourite drink. Two flavours. Zero compromise.",
              "We're a small team. Pre-orders go live first to early believers. Be one of them."
            ].map((p,i)=><p key={i} style={{color:MT,lineHeight:1.9,marginBottom:20,fontSize:"0.97rem"}}>{p}</p>)}
            <a href="#waitlist"><button className="pill pd" style={{padding:"14px 24px",fontSize:"0.92rem",marginTop:10}}>Join the Movement →</button></a>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <div style={{background:YLW,padding:"48px 6%",textAlign:"center"}}>
        <div className="bb" style={{fontSize:"clamp(1.3rem,3vw,1.9rem)",letterSpacing:"3px",marginBottom:22,color:"#111"}}>WHAT EARLY TESTERS ARE SAYING</div>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
          {[
            {quote:"Finally a tea that doesn't taste like sugar water.",name:"Arjun M., Mumbai"},
            {quote:"The Peach Rush is dangerously good.",name:"Priya S., Bangalore"},
            {quote:"I've had 3 cans today. No regrets.",name:"Rahul K., Delhi"},
          ].map((r,i)=>(
            <div key={i} style={{background:"white",borderRadius:20,padding:"18px 22px",maxWidth:252,
              textAlign:"left",boxShadow:"0 6px 22px rgba(0,0,0,0.07)"}}>
              <div style={{fontSize:"1rem",marginBottom:7}}>⭐⭐⭐⭐⭐</div>
              <p style={{color:"#333",lineHeight:1.7,marginBottom:9,fontSize:"0.83rem"}}>"{r.quote}"</p>
              <div style={{fontSize:"0.68rem",fontWeight:700,color:"#888",letterSpacing:"1px"}}>{r.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── WAITLIST ── */}
      <section id="waitlist" style={{padding:"110px 6%",background:"#0a0a0a",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:540,height:540,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(255,228,94,0.16) 0%,transparent 70%)",top:-200,right:-200}}/>
        <div style={{position:"absolute",width:360,height:360,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(255,179,138,0.1) 0%,transparent 70%)",bottom:-150,left:-100}}/>

        <div style={{position:"relative",zIndex:2,maxWidth:580,margin:"0 auto",textAlign:"center"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.06)",
            borderRadius:999,padding:"7px 16px",marginBottom:28}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#22c55e",
              display:"inline-block",animation:"shimmer 2s infinite"}}/>
            <span style={{color:"#aaa",fontSize:"0.72rem",fontWeight:700,letterSpacing:"2px"}}>
              {wCount} PEOPLE ALREADY WAITING
            </span>
          </div>

          <h2 className="bb" style={{fontSize:"clamp(3.2rem,9vw,7rem)",lineHeight:0.9,color:"white",marginBottom:16}}>
            DON'T MISS<br/><span style={{color:YLW}}>LAUNCH DAY.</span>
          </h2>
          <p style={{color:"#666",lineHeight:1.8,marginBottom:32,fontSize:"0.94rem"}}>
            Join the waitlist and be first to order at launch. Early backers get{" "}
            <strong style={{color:"white"}}>20% off their first case</strong> + free shipping.
          </p>

          {!done ? (
            <form onSubmit={handleSubmit}>
              <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:440,margin:"0 auto"}}>
                <input className="inp" type="text" value={name} onChange={e=>setName(e.target.value)}
                  placeholder="Your first name (optional)"
                  style={{border:"1.5px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",color:"white"}}/>
                <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  style={{border:"1.5px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",color:"white"}}/>
                <button type="submit" className="pill py" disabled={sending}
                  style={{padding:"15px",fontSize:"0.93rem",width:"100%",opacity:sending?0.7:1}}>
                  {sending?"Securing your spot…":"Claim 20% Early Access →"}
                </button>
              </div>
              <div style={{color:"#333",fontSize:"0.7rem",marginTop:10}}>No spam, ever. Just launch news + your exclusive discount.</div>
            </form>
          ) : (
            <div style={{background:"rgba(255,255,255,0.05)",borderRadius:22,padding:"30px",
              border:"1px solid rgba(255,255,255,0.09)"}}>
              <div style={{fontSize:"2.2rem",marginBottom:10}}>🎉</div>
              <div className="bb" style={{fontSize:"1.7rem",color:"white",letterSpacing:"2px",marginBottom:8}}>
                YOU'RE IN{name?`, ${name.toUpperCase()}`:""}!
              </div>
              <div style={{color:"#555",fontSize:"0.86rem",lineHeight:1.7}}>
                A confirmation is on its way to <strong style={{color:"white"}}>{email}</strong>.<br/>
                Your 20% off code will be in the email. Welcome to the movement.
              </div>
            </div>
          )}

          <div style={{display:"flex",gap:26,justifyContent:"center",marginTop:40,flexWrap:"wrap"}}>
            {[["🔒","No charge until launch"],["✈️","Free shipping included"],["↩️","Cancel anytime"]].map(([icon,label],i)=>(
              <div key={i} style={{color:"#333",fontSize:"0.76rem",fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
                <span>{icon}</span>{label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{padding:"52px 6%",background:"#070707",textAlign:"center"}}>
        <div className="bb" style={{fontSize:"3.6rem",letterSpacing:"8px",color:"white",marginBottom:7}}>QUENCH</div>
        <div style={{color:"#2a2a2a",fontSize:"0.8rem",marginBottom:26}}>Tea That Hits Different. · Real. Clean. Unreal.</div>
        <div style={{display:"flex",gap:26,justifyContent:"center",flexWrap:"wrap",marginBottom:28}}>
          {["Instagram","Twitter / X","hello@drinkquench.in","Privacy Policy"].map(l=>(
            <a key={l} href="#" style={{color:"#2a2a2a",textDecoration:"none",fontSize:"0.76rem",fontWeight:600,transition:"color 0.2s"}}
              onMouseOver={e=>e.target.style.color="#888"} onMouseOut={e=>e.target.style.color="#2a2a2a"}>{l}</a>
          ))}
        </div>
        <div style={{color:"#1a1a1a",fontSize:"0.65rem"}}>© 2025 QUENCH BEVERAGES PVT LTD · MADE IN INDIA 🇮🇳</div>
      </footer>

      {/* ── FLAVOUR MODAL ── */}
      {selFlavour && (
        <div className="ov" onClick={()=>setSelFlavour(null)}>
          <div className="mi" style={{background:CARD,border:`1.5px solid ${BR}`}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setSelFlavour(null)} style={{position:"absolute",top:16,right:16,
              background:d?"#2a2a2a":"#f0f0f0",border:"none",borderRadius:"50%",width:32,height:32,
              cursor:"pointer",fontSize:"0.95rem",display:"flex",alignItems:"center",justifyContent:"center",color:TX}}>✕</button>
            <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
              <img src={selFlavour.image} alt={selFlavour.name}
                style={{height:185,width:"auto",filter:`drop-shadow(0 16px 40px ${selFlavour.accent}60)`,display:"block"}}/>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{background:"#111",color:"white",display:"inline-block",padding:"4px 12px",
                borderRadius:999,fontSize:"0.6rem",fontWeight:700,letterSpacing:"1.5px",marginBottom:9}}>{selFlavour.tag}</div>
              <h2 className="bb" style={{fontSize:"2.5rem",letterSpacing:"2px",marginBottom:9,color:TX}}>{selFlavour.name}</h2>
              <p style={{color:MT,lineHeight:1.75,marginBottom:16,fontSize:"0.86rem"}}>{selFlavour.desc}</p>
              <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:20,flexWrap:"wrap"}}>
                {selFlavour.notes.map(n=><span key={n} style={{background:d?"#2a2a2a":"#f5f5f0",borderRadius:999,
                  padding:"4px 12px",fontSize:"0.7rem",fontWeight:600,color:MT}}>{n}</span>)}
              </div>
              <div style={{background:d?"#181818":"#f5f5f0",borderRadius:14,padding:"13px 18px",marginBottom:20,textAlign:"left"}}>
                {[["Calories","5 kcal"],["Sugar","0g"],["Caffeine","~35mg"],["Ingredients","Brewed Tea, Natural Flavour, Stevia"]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",
                    borderBottom:`1px solid ${BR}`,fontSize:"0.8rem"}}>
                    <span style={{color:"#888",fontWeight:600}}>{k}</span>
                    <span style={{color:TX}}>{v}</span>
                  </div>
                ))}
              </div>
              <a href="#waitlist" onClick={()=>setSelFlavour(null)}>
                <button className="pill" style={{width:"100%",padding:"14px",fontSize:"0.93rem",fontWeight:700,
                  background:selFlavour.accent,color:"#111",border:"none",cursor:"pointer"}}>
                  Pre-order {selFlavour.name} — {selFlavour.price}
                </button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}