import { OG_SIZE, ogCard } from "@/lib/og";

export const alt = "Act for Community — student-led charity in Bishkek";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    kicker: "Student-led charity · Bishkek",
    title: "Small acts. Together, they change lives.",
    footer: "Tournaments · Fairs · Concerts · Drives",
  });
}
