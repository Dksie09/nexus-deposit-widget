import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Nexus Deposit",
  description: "Nexus Deposit Widget",
  openGraph: {
    title: "Nexus Deposit",
    description: "Nexus Deposit Widget",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nexus Deposit Widget",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus Deposit",
    description: "Nexus Deposit Widget",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        <div className="relative">
          <div className="relative mx-auto max-w-screen-xl">
            <div className="absolute left-54 top-0 bottom-0 border-l border-dotted border-white/30 h-full overflow-hidden"></div>

            <div className="absolute right-54 top-0 bottom-0 border-l border-dotted border-white/30 h-full overflow-hidden"></div>

            <div className="px-[34px]">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
