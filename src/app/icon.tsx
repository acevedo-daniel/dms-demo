import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const runtime = "nodejs";
export const size = {
  width: 512,
  height: 512,
};

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#171715",
        borderRadius: "112px",
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
          fontSize: "288px",
          fontWeight: 700,
          letterSpacing: "-32px",
          marginLeft: "-24px",
        }}
      >
        D
      </span>
    </div>,
    size,
  );
}
