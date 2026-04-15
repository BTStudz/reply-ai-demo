import { useState, useRef, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0c0c0c;
    --surface: #161616;
    --surface2: #1e1e1e;
    --border: rgba(255,255,255,0.08);
    --border2: rgba(255,255,255,0.14);
    --text: #f0ede8;
    --muted: #888580;
    --accent: #c8f57a;
    --accent-dim: rgba(200,245,122,0.1);
    --accent-dim2: rgba(200,245,122,0.18);
    --red: #ff6b6b;
    --font-display: 'DM Serif Display', Georgia, serif;
    --font-body: 'DM Sans', system-ui, sans-serif;
    --radius: 12px;
    --radius-sm: 8px;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); font-size: 15px; line-height: 1.6; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  .header { padding: 28px 40px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .header-logo { font-family: var(--font-display); font-size: 20px; color: var(--text); letter-spacing: -0.3px; }
  .header-logo span { color: var(--accent); }
  .header-tag { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); background: var(--surface2); border: 1px solid var(--border); padding: 4px 10px; border-radius: 20px; }

  .hero { padding: 64px 40px 48px; max-width: 720px; }
  .hero-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
  .hero-eyebrow::before { content: ''; display: block; width: 24px; height: 1px; background: var(--accent); }
  .hero h1 { font-family: var(--font-display); font-size: clamp(36px, 5vw, 58px); line-height: 1.1; letter-spacing: -1px; color: var(--text); margin-bottom: 20px; }
  .hero h1 em { font-style: italic; color: var(--accent); }
  .hero p { font-size: 16px; color: var(--muted); font-weight: 300; max-width: 520px; line-height: 1.7; }

  .main { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 0; border-top: 1px solid var(--border); }
  @media (max-width: 768px) { .main { grid-template-columns: 1fr; } .header { padding: 20px 20px 18px; } .hero { padding: 40px 20px 32px; } }

  .panel { padding: 36px 40px; }
  .panel:first-child { border-right: 1px solid var(--border); }
  @media (max-width: 768px) { .panel { padding: 24px 20px; } .panel:first-child { border-right: none; border-bottom: 1px solid var(--border); } }
  .panel-label { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 20px; }

  .field { margin-bottom: 20px; }
  .field label { display: block; font-size: 12px; font-weight: 500; color: var(--muted); margin-bottom: 8px; letter-spacing: 0.04em; text-transform: uppercase; }
  .field input, .field textarea, .field select {
    width: 100%; background: var(--surface); border: 1px solid var(--border2); border-radius: var(--radius-sm);
    color: var(--text); font-family: var(--font-body); font-size: 14px; padding: 12px 14px;
    outline: none; transition: border-color 0.15s; resize: vertical;
  }
  .field input:focus, .field textarea:focus, .field select:focus { border-color: var(--accent); }
  .field select option { background: #1e1e1e; }
  .field textarea { min-height: 130px; line-height: 1.6; }

  .tone-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .tone-pill { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border2); background: var(--surface); color: var(--muted); font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
  .tone-pill:hover { color: var(--text); }
  .tone-pill.active { border-color: var(--accent); background: var(--accent-dim); color: var(--accent); }

  .btn-generate { width: 100%; margin-top: 8px; padding: 14px 20px; background: var(--accent); color: #0a0a0a; border: none; border-radius: var(--radius-sm); font-family: var(--font-body); font-size: 14px; font-weight: 500; cursor: pointer; transition: opacity 0.15s, transform 0.1s; }
  .btn-generate:hover:not(:disabled) { opacity: 0.9; }
  .btn-generate:active:not(:disabled) { transform: scale(0.99); }
  .btn-generate:disabled { opacity: 0.4; cursor: not-allowed; }

  .output-empty { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 40px; text-align: center; }
  .output-empty-icon { width: 48px; height: 48px; border-radius: 50%; border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; }
  .output-empty p { font-size: 13px; color: var(--muted); max-width: 280px; line-height: 1.6; }

  .output-content { display: flex; flex-direction: column; gap: 20px; }
  .output-meta { display: flex; align-items: center; gap: 10px; }
  .output-badge { font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; padding: 3px 9px; border-radius: 20px; }
  .badge-success { background: var(--accent-dim); color: var(--accent); border: 1px solid rgba(200,245,122,0.25); }
  .badge-loading { background: rgba(255,255,255,0.06); color: var(--muted); border: 1px solid var(--border); }

  .output-box { background: var(--surface); border: 1px solid var(--border2); border-radius: var(--radius); padding: 20px; font-size: 14px; line-height: 1.75; color: var(--text); white-space: pre-wrap; word-break: break-word; min-height: 200px; }

  .cursor { display: inline-block; width: 2px; height: 16px; background: var(--accent); margin-left: 2px; vertical-align: middle; animation: blink 0.8s step-end infinite; }
  @keyframes blink { 50% { opacity: 0; } }

  .output-actions { display: flex; gap: 10px; }
  .btn-copy, .btn-reset { padding: 8px 16px; border-radius: var(--radius-sm); font-family: var(--font-body); font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
  .btn-copy { background: var(--accent-dim2); border: 1px solid rgba(200,245,122,0.3); color: var(--accent); }
  .btn-copy:hover { background: rgba(200,245,122,0.25); }
  .btn-reset { background: transparent; border: 1px solid var(--border2); color: var(--muted); }
  .btn-reset:hover { color: var(--text); }

  .stats { display: flex; gap: 0; border-top: 1px solid var(--border); }
  .stat { flex: 1; padding: 20px 24px; border-right: 1px solid var(--border); }
  .stat:last-child { border-right: none; }
  .stat-val { font-family: var(--font-display); font-size: 28px; color: var(--accent); }
  .stat-lbl { font-size: 11px; color: var(--muted); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.06em; }
  @media (max-width: 600px) { .stats { flex-wrap: wrap; } .stat { min-width: 50%; } }

  .footer-cta { padding: 32px 40px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
  .footer-text { font-size: 13px; color: var(--muted); max-width: 460px; line-height: 1.6; }
  .footer-text strong { color: var(--text); font-weight: 500; }
  .btn-cta { padding: 12px 24px; background: var(--surface2); border: 1px solid var(--border2); border-radius: var(--radius-sm); color: var(--text); font-family: var(--font-body); font-size: 13px; font-weight: 500; cursor: pointer; white-space: nowrap; transition: border-color 0.15s; }
  .btn-cta:hover { border-color: var(--accent); color: var(--accent); }
  @media (max-width: 768px) { .footer-cta { padding: 24px 20px; } }

  .error-box { background: rgba(255,107,107,0.08); border: 1px solid rgba(255,107,107,0.2); border-radius: var(--radius-sm); padding: 14px 16px; font-size: 13px; color: var(--red); line-height: 1.5; margin-top: 8px; }
`;

const TONES = ["Professional", "Friendly", "Concise", "Warm", "Formal"];
const EXAMPLE_ENQUIRIES = [
  "Hi, I'm interested in your services. What are your prices and how do I get started?",
  "I haven't heard back about my quote from last week. Can someone follow up please?",
  "Do you service the Tuggeranong area? We need someone out this week if possible.",
];

export default function App() {
  const [business, setBusiness] = useState("");
  const [industry, setIndustry] = useState("");
  const [enquiry, setEnquiry] = useState("");
  const [tone, setTone] = useState("Professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [demoCount, setDemoCount] = useState(0);
  const outputRef = useRef(null);

  useEffect(() => {
    const saved = parseInt(localStorage.getItem("demoCount") || "0");
    setDemoCount(saved);
  }, []);

  const generate = async () => {
    if (!business.trim() || !enquiry.trim()) return;
    setLoading(true); setDone(false); setOutput(""); setError("");

    const systemPrompt = `You are an expert email reply assistant for a small business. Write a professional, personalised email reply to a customer enquiry on behalf of the business.

Business name: ${business}
Industry: ${industry || "Small business"}
Tone: ${tone}

Write ONLY the email reply — no commentary, no subject line label. Start directly with the greeting. Keep it concise (3-5 short paragraphs). Sound like a real human business owner. End with a clear next step or call to action.`;

    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: systemPrompt,
          enquiry: `Customer enquiry:\n\n"${enquiry}"\n\nWrite the reply now.`,
        }),
      });

      if (!resp.ok) { const e = await resp.json(); throw new Error(e.error?.message || "API error"); }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done: sd, value } = await reader.read();
        if (sd) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n"); buffer = lines.pop();
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const p = JSON.parse(data);
              if (p.type === "content_block_delta" && p.delta?.text) {
                setOutput(prev => prev + p.delta.text);
                if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
              }
            } catch {}
          }
        }
      }

      setDone(true);
      const n = demoCount + 1;
      setDemoCount(n);
      localStorage.setItem("demoCount", n.toString());
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const reset = () => { setOutput(""); setDone(false); setError(""); };
  const fillExample = () => setEnquiry(EXAMPLE_ENQUIRIES[Math.floor(Math.random() * EXAMPLE_ENQUIRIES.length)]);
  const canGenerate = business.trim().length > 0 && enquiry.trim().length > 0 && !loading;

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <header className="header">
          <div className="header-logo">Reply<span>AI</span></div>
          <div className="header-tag">Live Demo</div>
        </header>

        <div className="hero">
          <div className="hero-eyebrow">AI Email Automation</div>
          <h1>Your inbox,<br /><em>handled.</em></h1>
          <p>See how AI drafts perfect customer replies in your business's voice — in seconds. Try it live below with your own enquiry.</p>
        </div>

        <div className="main">
          <div className="panel">
            <div className="panel-label">Your business</div>
            <div className="field">
              <label>Business name</label>
              <input type="text" placeholder="e.g. Canberra Plumbing Co." value={business} onChange={e => setBusiness(e.target.value)} />
            </div>
            <div className="field">
              <label>Industry (optional)</label>
              <select value={industry} onChange={e => setIndustry(e.target.value)}>
                <option value="">Select your industry...</option>
                <option>Real estate</option>
                <option>Trades & services</option>
                <option>Retail</option>
                <option>Healthcare</option>
                <option>Finance & accounting</option>
                <option>Legal</option>
                <option>Hospitality</option>
                <option>Consulting</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field">
              <label>Customer enquiry <span onClick={fillExample} style={{color:"var(--accent)",cursor:"pointer",fontWeight:400,textTransform:"none",letterSpacing:0}}>(try an example)</span></label>
              <textarea placeholder="Paste a real customer email or enquiry here..." value={enquiry} onChange={e => setEnquiry(e.target.value)} />
            </div>
            <div className="field">
              <label>Reply tone</label>
              <div className="tone-grid">
                {TONES.map(t => (
                  <button key={t} className={`tone-pill${tone === t ? " active" : ""}`} onClick={() => setTone(t)}>{t}</button>
                ))}
              </div>
            </div>
            <button className="btn-generate" onClick={generate} disabled={!canGenerate}>
              {loading ? "Writing reply..." : "Generate reply →"}
            </button>
            {error && <div className="error-box">{error}</div>}
          </div>

          <div className="panel">
            <div className="panel-label">AI-drafted reply</div>
            {!output && !loading && (
              <div className="output-empty">
                <div className="output-empty-icon">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <p>Fill in your business details and paste a customer enquiry — your AI-drafted reply appears here instantly.</p>
              </div>
            )}
            {(output || loading) && (
              <div className="output-content">
                <div className="output-meta">
                  <span className={`output-badge ${done ? "badge-success" : "badge-loading"}`}>{done ? "✓ Reply ready" : "Writing..."}</span>
                  {done && <span style={{fontSize:12,color:"var(--muted)"}}>{tone} tone · {output.split(" ").length} words</span>}
                </div>
                <div className="output-box" ref={outputRef}>
                  {output}{loading && <span className="cursor" />}
                </div>
                {done && (
                  <div className="output-actions">
                    <button className="btn-copy" onClick={copy}>{copied ? "Copied!" : "Copy reply"}</button>
                    <button className="btn-reset" onClick={reset}>Try another</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="stats">
          <div className="stat"><div className="stat-val">~8hrs</div><div className="stat-lbl">saved per week</div></div>
          <div className="stat"><div className="stat-val">&lt;10s</div><div className="stat-lbl">per reply</div></div>
          <div className="stat">
            <div className="stat-val">{demoCount > 0 ? demoCount : "∞"}</div>
            <div className="stat-lbl">{demoCount > 0 ? "replies generated" : "replies possible"}</div>
          </div>
          <div className="stat"><div className="stat-val">100%</div><div className="stat-lbl">your voice</div></div>
        </div>

        <div className="footer-cta">
          <p className="footer-text">
            <strong>Want this running in your business?</strong> I set it up, train it on your business, and it's live within one week. No tech knowledge needed.
          </p>
          <button className="btn-cta" onClick={() => window.open("https://calendly.com/kynastonb/30min", "_blank")}>
            Book a free 20-min call →
          </button>
        </div>
      </div>
    </>
  );
}
