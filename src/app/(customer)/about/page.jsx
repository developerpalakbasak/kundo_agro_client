import Image from "next/image";
import Link from "next/link";
import { AboutClientContent } from "./AboutClientContent";

export const metadata = {
  title: "About Us | Kundu Agro & Fisheries",
  description:
    "Learn about Kundu Agro & Fisheries, our founder Dabotosh Kundu, our brand promise 'We stand with Farmers', and our global import, export & agro-fisheries services.",
  openGraph: {
    title: "About Us | Kundu Agro & Fisheries",
    description:
      "Kundu Agro & Fisheries - Founded in 2026. Empowering farmers with quality feed, fish seeds, livestock & fisheries solutions, and international trading logistics.",
    images: [{ url: "/founder-dabotosh.png" }],
  },
};

export default function AboutPage() {
  return <AboutClientContent />;
}
