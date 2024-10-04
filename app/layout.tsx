import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import Providers from "@/components/theme/providers";
import HomeHeader from "@/components/header/header-home";
import { Footer } from "@/components/footer";
import Head from "next/head";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Invoiceraptor",
  description:
    "Create and manage invoices easily with our invoice generator app. Track payments, manage clients, and stay organized.",
  openGraph: {
    title: "Invoiceraptor",
    description: "A fast and fierce way to get your invoices done.",
    siteName: "Invoiceraptor",
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentSession = await auth();

  return (
    <SessionProvider session={currentSession}>
      <html lang="en">
        <Head>
          {/* Preload CSS */}
          <link
            rel="preload"
            href="/_next/static/css/app/layout.css"
            as="style"
          />
        </Head>
        <body className={inter.className}>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="icon" href="/favicon.png" sizes="any" type="image/png" />
          <Providers>
            <HomeHeader />
            {children}
            <Footer />
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
