import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const runtime = "nodejs";
export const size = {
  width: 64,
  height: 64,
};

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#171715",
        borderRadius: "14px",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <span
        style={{
          color: "#ffffff",
          display: "flex",
          fontFamily: "sans-serif",
          fontSize: "36px",
          fontWeight: 700,
          letterSpacing: "-4px",
          marginLeft: "-3px",
        }}
      >
        D
      </span>
    </div>,
    size,
  );
}
