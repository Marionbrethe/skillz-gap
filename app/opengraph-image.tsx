import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Bottleneck — What's left for you when AI gets clever?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="10" cy="10" r="7" stroke="#0f0f0f" strokeWidth="2" />
            <circle cx="10" cy="10" r="3" stroke="#0f0f0f" strokeWidth="1.5" opacity="0.4" />
            <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="#0f0f0f" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "18px", fontWeight: 600, color: "#111", letterSpacing: "-0.02em" }}>
            Bottleneck
          </span>
        </div>

        {/* Middle: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 700,
              color: "#0f0f0f",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            What's left for you
            <br />when AI gets clever?
          </div>
          <div style={{ fontSize: "24px", color: "#6b7280", lineHeight: 1.4, maxWidth: "800px" }}>
            When intelligence is cheap, something else becomes the real bottleneck.
            Map the constraints for your role.
          </div>
        </div>

        {/* Bottom: attribution */}
        <div style={{ fontSize: "16px", color: "#9ca3af" }}>
          Based on Dario Amodei's "Machines of Loving Grace" · skillz-gap.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
