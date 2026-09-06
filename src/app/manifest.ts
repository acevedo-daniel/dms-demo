import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    lang: "es-AR",
    name: "DMS — Gestión operativa odontológica",
    short_name: "DMS",
    description:
      "Un espacio de trabajo para coordinar la operación diaria de clínicas odontológicas.",
    scope: "/",
    start_url: "/",
    display: "browser",
    background_color: "#f8f8f6",
    theme_color: "#171715",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
