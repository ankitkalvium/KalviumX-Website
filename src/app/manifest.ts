import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KalviumX",
    short_name: "KalviumX",
    description: "Enterprise intern hiring from Kalvium's work-integrated B.Tech ecosystem",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f53333",
    icons: [
      {
        src: "/images/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
