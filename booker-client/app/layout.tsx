import { AuthHeader } from "@/client-components/header/header-auth";
import "./globals.css";
import { karla } from "./fonts";
import Navbar from "@/client-components/navbar/navbar";
const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
  drawer,
}: Readonly<{
  children: React.ReactNode;
  drawer: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${karla.className}`} suppressHydrationWarning>
      <body>
        <header className="w-full">
          <AuthHeader />
        </header>

        <aside>
          <Navbar />
        </aside>

        <main>{children}</main>
      </body>
    </html>
  );
}
