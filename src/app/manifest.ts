import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DMS — Gestión operativa odontológica",
    short_name: "DMS",
    description:
      "Un espacio de trabajo enfocado para la operación odontológica.",
    start_url: "/",
    display: "browser",
    background_color: "#f8f8f6",
    theme_color: "#171715",
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
      },
    ],
  };
}
