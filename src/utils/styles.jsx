export const palette = {
bg: "#f5f7fb",
ink: "#0f172a",
muted: "#6b7280",
brand: "#1d4ed8",
brand2: "#2563eb",
card: "#ffffff",
border: "#e5e7eb",
success: "#059669",
};


export const wrap = { maxWidth: 1200, margin: "0 auto", padding: "0 16px" };


export const appBg = { background: palette.bg, minHeight: "100vh", color: palette.ink };


export const button = (filled = true) => ({
padding: "12px 18px",
borderRadius: 12,
border: `1px solid ${filled ? palette.brand2 : palette.border}`,
background: filled ? palette.brand2 : "#fff",
color: filled ? "#fff" : palette.ink,
fontWeight: 600,
cursor: "pointer",
boxShadow: filled ? "0 6px 16px rgba(29,78,216,0.25)" : "none",
});


export const input = {
width: "80%",
padding: "12px 14px",
borderRadius: 12,
border: `1px solid ${palette.border}`,
outline: "none",
background: "#fff",
};


export const card = {
background: palette.card,
borderRadius: 16,
border: `1px solid ${palette.border}`,
boxShadow: "0 8px 24px rgba(16,24,40,0.04)",
};


export const tag = {
display: "inline-block",
padding: "6px 10px",
borderRadius: 999,
border: `1px solid ${palette.border}`,
background: "#fff",
fontSize: 13,
color: palette.muted,
};