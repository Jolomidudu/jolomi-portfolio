import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import CookieBanner from "./cookie-banner";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jolomi.vercel.app"),
  title: {
    default: "Jolomi Dudu | Software Engineer & Digital Product Builder",
    template: "%s | Jolomi Dudu",
  },
  description:
    "Jolomi Dudu designs and builds useful web and mobile products, teaches practical technology and helps businesses grow digitally.",
  keywords: [
    "Jolomi Dudu",
    "software engineer Nigeria",
    "web development",
    "mobile app development",
    "UI UX design",
    "data analytics",
    "technology tutor",
  ],
  authors: [{ name: "Jolomi Dudu" }],
  creator: "Jolomi Dudu",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://jolomi.vercel.app",
    siteName: "Jolomi Dudu",
    title: "Jolomi Dudu | Software Engineer & Digital Product Builder",
    description:
      "Web, mobile, design, analytics, tutoring and digital growth services.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jolomi Dudu | Software Engineer & Digital Product Builder",
    description:
      "Web, mobile, design, analytics, tutoring and digital growth services.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/hat.png",
    shortcut: "/hat.png",
    apple: "/hat.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}<CookieBanner /></body>
    </html>
  );
}
