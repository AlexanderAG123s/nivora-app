import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopNav from "@/components/layout/TopNav";
import OnboardingTour from "@/components/ui/OnboardingTour";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });

export const metadata: Metadata = {
  title: "Analytical Platform",
  description: "Professional statistical analysis platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${firaCode.variable}`} style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        <OnboardingTour />
        <div className="dashboard-layout">
          <Sidebar />
          <div className="main-content">
            <TopNav />
            <main className="content-wrapper">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
