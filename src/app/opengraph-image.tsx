import { ImageResponse } from "next/og";

export const alt = "DMS practice operations workspace";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#f6f8f7",
        color: "#14211f",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px",
        width: "100%",
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: "24px" }}>
        <div
          style={{
            alignItems: "center",
            background: "#0f6b62",
            borderRadius: "18px",
            color: "#ffffff",
            display: "flex",
            fontFamily: "monospace",
            fontSize: "42px",
            fontWeight: 700,
            height: "76px",
            justifyContent: "center",
            width: "76px",
          }}
        >
          D
        </div>
        <div
          style={{
            fontFamily: "sans-serif",
            fontSize: "34px",
            fontWeight: 700,
            letterSpacing: "-0.5px",
          }}
        >
          DMS
        </div>
      </div>

      <div
        style={{ display: "flex", flexDirection: "column", maxWidth: "900px" }}
      >
        <div
          style={{
            color: "#0f6b62",
            display: "flex",
            fontFamily: "monospace",
            fontSize: "22px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Practice operations workspace
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "sans-serif",
            fontSize: "72px",
            fontWeight: 700,
            letterSpacing: "-3px",
            lineHeight: 1.05,
            marginTop: "24px",
          }}
        >
          A quieter way to coordinate the day.
        </div>
      </div>

      <div
        style={{
          borderTop: "2px solid #dce8e4",
          color: "#5a6662",
          display: "flex",
          fontFamily: "sans-serif",
          fontSize: "24px",
          paddingTop: "28px",
        }}
      >
        Scheduling · Patient context · Treatments · Notes
      </div>
    </div>,
    size,
  );
}
