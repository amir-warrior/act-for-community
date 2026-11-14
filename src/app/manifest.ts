import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Act for Community",
    short_name: "Act for Community",
    description: "Student-led charity initiative in Bishkek, Kyrgyzstan.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1f52d8",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
