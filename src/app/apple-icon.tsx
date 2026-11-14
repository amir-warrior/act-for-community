import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for iPhone ("Add to Home Screen"). Replace once the official logo exists. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1f52d8", position: "relative" }}>
        <div style={{ position: "absolute", right: 22, top: 22, width: 52, height: 52, borderRadius: 9999, background: "#ffc531", display: "flex" }} />
        <div style={{ color: "white", fontSize: 104, fontWeight: 800, display: "flex" }}>A</div>
      </div>
    ),
    size,
  );
}
