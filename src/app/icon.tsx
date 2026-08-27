import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const runtime = "nodejs";
export const size = {
  width: 64,
  height: 64,
};

const logoData = await readFile(
  join(process.cwd(), "public", "dms-logo.png"),
  "base64",
);
const logoSrc = `data:image/png;base64,${logoData}`;

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#d9eee8",
        borderRadius: "14px",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders standard image elements. */}
      <img alt="" height={92} src={logoSrc} width={92} />
    </div>,
    size,
  );
}
