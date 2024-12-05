import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { AuthProvider } from "@/hooks/authContext";
import Loader from "@/components/loader";
import { CompanyProvider } from "@/hooks/companyContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sales Sphere",
  description: "Sales prospecting made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-modern-gradient`}
        >
          <ClerkLoading>
            <Loader />
          </ClerkLoading>
          <ClerkLoaded>
            <AuthProvider>
              <CompanyProvider>
                <Navbar />
                <div className="flex max-w-full h-[94vh] overflow-y-hidden">
                  <Sidebar />
                  <div className="flex-1 w-full">{children}</div>
                </div>
              </CompanyProvider>
            </AuthProvider>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
