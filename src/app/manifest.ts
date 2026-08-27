import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DMS — Practice operations workspace",
    short_name: "DMS",
    description: "A focused workspace for dental practice operations.",
    start_url: "/",
    display: "browser",
    background_color: "#f6f8f7",
    theme_color: "#0f6b62",
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
      },
    ],
  };
}
