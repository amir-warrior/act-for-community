import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Branded share card (1200×630) used when a link is posted in Telegram,
 * Instagram DMs, WhatsApp, etc. Plain shapes only — no photos needed.
 */
export function ogCard({ kicker, title, footer }: { kicker: string; title: string; footer: string }) {
  const long = title.length > 34;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #1f52d8 0%, #18306a 100%)",
          color: "white",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ position: "absolute", right: -120, top: -120, width: 460, height: 460, borderRadius: 9999, background: "#ffc531", display: "flex" }} />
        <div style={{ position: "absolute", right: 60, bottom: -180, width: 380, height: 380, borderRadius: 9999, background: "rgba(255,255,255,0.08)", display: "flex" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 9999, background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "#1f52d8", fontSize: 32, fontWeight: 800 }}>
            A
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>Act for Community</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#ffc531", textTransform: "uppercase", letterSpacing: 4 }}>{kicker}</div>
          <div style={{ fontSize: long ? 68 : 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, marginTop: 18 }}>{title}</div>
        </div>

        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.75)", display: "flex" }}>{footer}</div>
      </div>
    ),
    OG_SIZE,
  );
}
