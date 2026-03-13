import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Papercraft Brasil",
    short_name: "Papercraft BR",
    description:
      "Monte bonecos incríveis de papel em 3D com mais de 3500 moldes aprovados.",
    start_url: "/",
    display: "standalone",
    background_color: "#FDFDFD",
    theme_color: "#0188FA",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
