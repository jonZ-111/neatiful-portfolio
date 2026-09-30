import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PostHogProvider } from "./providers";

const quicksand = localFont({
  src: "./fonts/Quicksand-Variable.ttf",
  variable: "--font-quicksand",
  weight: "300 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "neatiful | Cleaning and Organization Services",
  description:
    "Thoughtful cleaning, carpet care, decluttering, and organization services in the Austin area.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${quicksand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
