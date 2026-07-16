import { useState, useEffect } from "react";

const STORAGE_KEY = "mps_lasid";

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; } catch { return null; }
}
function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function clear() {
  localStorage.removeItem(STORAGE_KEY);
}

export default function App() {
  const [saved, setSaved] = useState(load);
  const [showSetup, setShowSetup] = useState(!load());
  const [formName, setFormName] = useState("");
  const [formLasid, setFormLasid] = useState("");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null); // null | "correct" | "wrong"

  useEffect(() => {
    if (saved) {
      setFormName(saved.name || "");
      setFormLasid(saved.lasid || "");
    }
  }, [saved]);

  const handleSave = () => {
    if (!formLasid.trim()) return;
    const data = { lasid: formLasid.trim(), name: formName.trim() };
    save(data);
    setSaved(data);
    setShowSetup(false);
    setInput("");
    setResult(null);
  };

  const handleClear = () => {
    clear();
    setSaved(null);
    setFormName("");
    setFormLasid("");
    setInput("");
    setResult(null);
    setShowSetup(true);
  };

  const handleKey = (digit) => {
    if (result) return;
    setInput(prev => saved && prev.length < saved.lasid.length ? prev + digit : prev);
  };

  const handleKeypadClear = () => { setInput(""); setResult(null); };

  const handleEnter = () => {
    if (!input || !saved) return;
    const ok = input === saved.lasid;
    setResult(ok ? "correct" : "wrong");
    if (ok) setTimeout(() => { setInput(""); setResult(null); }, 2000);
  };

  const lasidLen = saved?.lasid?.length || 5;
  const displayStr = input.padEnd(lasidLen, "·");

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4FF", fontFamily: "sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#1A3A6B", color: "#fff", textAlign: "center", padding: "18px 20px 14px" }}>
        <div style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", opacity: 0.8, marginBottom: 4 }}>
          Medford Public Schools
        </div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>Cafeteria Keypad Practice</div>
      </div>

      <div style={{ maxWidth: 420, margin: "0 auto", padding: "24px 20px 60px" }}>

        {/* Setup panel */}
        {showSetup ? (
          <div style={{
            background: "#fff", borderRadius: 14, padding: "24px 22px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: 24
          }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1A3A6B", marginBottom: 4 }}>
              🔒 Parent Setup
            </div>
            <div style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>
              Enter your child's LASID (cafeteria PIN). This stays on your device — nothing is sent anywhere.
            </div>

            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 }}>
              Student name <span style={{ fontWeight: 400, color: "#999" }}>(optional)</span>
            </label>
            <input
              type="text"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="e.g. Billy"
              style={{
                width: "100%", padding: "11px 14px", fontSize: 16, borderRadius: 8,
                border: "1.5px solid #CCD", outline: "none", marginBottom: 16, boxSizing: "border-box"
              }}
            />

            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 6 }}>
              LASID / PIN number
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formLasid}
              onChange={e => setFormLasid(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="e.g. 12345"
              style={{
                width: "100%", padding: "11px 14px", fontSize: 22, letterSpacing: 8,
                borderRadius: 8, border: "1.5px solid #CCD", outline: "none",
                marginBottom: 20, boxSizing: "border-box", fontFamily: "monospace"
              }}
            />

            <button
              onClick={handleSave}
              disabled={!formLasid.trim()}
              style={{
                width: "100%", padding: "14px", fontSize: 16, fontWeight: 700,
                background: formLasid.trim() ? "#1A3A6B" : "#AAB", color: "#fff",
                border: "none", borderRadius: 10, cursor: formLasid.trim() ? "pointer" : "default",
                marginBottom: 10
              }}
            >
              Save &amp; Start Practice
            </button>

            {saved && (
              <button
                onClick={() => setShowSetup(false)}
                style={{
                  width: "100%", padding: "11px", fontSize: 15,
                  background: "transparent", color: "#1A3A6B",
                  border: "1.5px solid #1A3A6B", borderRadius: 10, cursor: "pointer"
                }}
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          /* Practice view */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>

            {/* Student greeting + gear */}
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                {saved?.name && (
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#1A3A6B" }}>
                    Hi {saved.name}! 👋
                  </div>
                )}
                <div style={{ fontSize: 15, color: "#555", marginTop: 2 }}>
                  Type your number, then press ENTER
                </div>
                <div style={{ fontSize: 20, letterSpacing: 8, color: "#1A3A6B", fontWeight: 700, marginTop: 6, fontFamily: "monospace" }}>
                  {saved?.lasid.split("").join(" ")}
                </div>
              </div>
              <button
                onClick={() => setShowSetup(true)}
                title="Parent settings"
                style={{
                  background: "none", border: "none", fontSize: 22,
                  cursor: "pointer", padding: 4, lineHeight: 1
                }}
              >⚙️</button>
            </div>

            {/* Keypad */}
            <div style={{
              background: "#E8E8EC", borderRadius: 16, padding: 22,
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)", width: "100%", maxWidth: 320, boxSizing: "border-box"
            }}>
              {/* Display */}
              <div style={{
                background: result === "correct" ? "#2E7D32" : result === "wrong" ? "#B71C1C" : "#444",
                borderRadius: 8, padding: "16px 20px", marginBottom: 18, minHeight: 58,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.25s"
              }}>
                {result === "correct" && <span style={{ fontSize: 44 }}>✅</span>}
                {result === "wrong"   && <span style={{ fontSize: 44 }}>❌</span>}
                {!result && (
                  <span style={{ fontFamily: "monospace", fontSize: 32, color: "#fff", letterSpacing: 8 }}>
                    {displayStr}
                  </span>
                )}
              </div>

              {/* Digit rows */}
              {[[1,2,3],[4,5,6],[7,8,9]].map(row => (
                <div key={row[0]} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  {row.map(n => (
                    <button key={n} onClick={() => handleKey(String(n))} style={{
                      flex: 1, padding: "22px 0", fontSize: 28, fontWeight: 700,
                      background: "#fff", border: "2px solid #AAAACC", borderRadius: 8,
                      cursor: "pointer", color: "#222", boxShadow: "0 3px 0 #AAAACC"
                    }}>{n}</button>
                  ))}
                </div>
              ))}

              {/* Bottom row */}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleKeypadClear} style={{
                  flex: 1, padding: "22px 0", fontSize: 15, fontWeight: 700,
                  background: "#D32F2F", border: "none", borderRadius: 8,
                  cursor: "pointer", color: "#fff", boxShadow: "0 3px 0 #8B0000"
                }}>CLEAR</button>
                <button onClick={() => handleKey("0")} style={{
                  flex: 1, padding: "22px 0", fontSize: 28, fontWeight: 700,
                  background: "#fff", border: "2px solid #AAAACC", borderRadius: 8,
                  cursor: "pointer", color: "#222", boxShadow: "0 3px 0 #AAAACC"
                }}>0</button>
                <button onClick={handleEnter} style={{
                  flex: 1, padding: "22px 0", fontSize: 15, fontWeight: 700,
                  background: "#2E7D32", border: "none", borderRadius: 8,
                  cursor: "pointer", color: "#fff", boxShadow: "0 3px 0 #1B5E20"
                }}>ENTER</button>
              </div>
            </div>

            {/* Result messages */}
            {result === "correct" && (
              <div style={{ fontSize: 24, fontWeight: 700, color: "#2E7D32", textAlign: "center" }}>
                Great job{saved?.name ? `, ${saved.name}` : ""}! 🎉
              </div>
            )}
            {result === "wrong" && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#B71C1C", marginBottom: 10 }}>
                  Not quite — try again!
                </div>
                <button onClick={handleKeypadClear} style={{
                  padding: "11px 28px", fontSize: 15, fontWeight: 600,
                  background: "#fff", border: "1.5px solid #1A3A6B",
                  borderRadius: 10, cursor: "pointer", color: "#1A3A6B"
                }}>Try Again</button>
              </div>
            )}

            {/* Clear saved data */}
            <button onClick={handleClear} style={{
              marginTop: 8, background: "none", border: "none",
              fontSize: 13, color: "#999", cursor: "pointer", textDecoration: "underline"
            }}>
              Clear saved LASID
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
