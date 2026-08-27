import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "DMS practice operations workspace";
export const contentType = "image/png";
export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630,
};

const logoData = await readFile(
  join(process.cwd(), "public", "dms-logo.png"),
  "base64",
);
const logoSrc = `data:image/png;base64,${logoData}`;

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
            background: "#d9eee8",
            borderRadius: "18px",
            display: "flex",
            height: "92px",
            justifyContent: "center",
            overflow: "hidden",
            width: "92px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders standard image elements. */}
          <img alt="" height={158} src={logoSrc} width={158} />
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
