import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: { default: "HK properties | Real Estate", template: "%s | HK properties" },
  description: "Verified flats and local property guidance for buyers in Dombivli East, Dombivli West and Thakurli.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Header />{children}<Footer /></body></html>;
}
