import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import data from "@/public/data.json";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://devesh.is-a.dev"),

  title: {
    default: "Devesh Singh | Full Stack Developer",
    template: "%s | Devesh Singh",
  },

  description: data.shortBio,

  keywords: [
    "Devesh Singh",
    "Full Stack Developer",
    "Web Developer",
    "React Developer",
    "Next.js Developer",
    "Portfolio",
    "JavaScript Developer",
    "TypeScript",
  ],

  authors: [{ name: "Devesh Singh", url: "https://devesh.is-a.dev" }],
  creator: "Devesh Singh",
  publisher: "Devesh Singh",

  alternates: {
    canonical: "https://devesh.is-a.dev/",
  },

  icons: {
    icon: data.profileImage,
    shortcut: data.profileImage,
    apple: data.profileImage,
  },

  openGraph: {
    title: "Devesh Singh | Full Stack Developer",
    description: data.shortBio,
    url: "https://devesh.is-a.dev/",
    siteName: "Devesh Singh Portfolio",
    images: [
      {
        url: data.profileImage,
        width: 1200,
        height: 630,
        alt: "Devesh Singh Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Devesh Singh | Full Stack Developer",
    description: data.shortBio,
    images: [data.profileImage],
    creator: "@deveshsingh75",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  viewport: {
    width: "device-width",
    initialScale: 1,
  },

  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="oJkPdfq46rmoO3pbOSm_9N9Jb5x0tWqpqY68Gf7CDvk" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css"
        />

        <Script
          id="person-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Devesh Singh",
              url: "https://devesh.is-a.dev",
              image: data.profileImage,
              email: "mailto:deveshkumarsingh75@gmail.com",
              sameAs: [
                "https://techux.github.io/",
                "https://github.com/techux",
                "https://www.linkedin.com/in/devesh75",
              ],
              jobTitle: "Full Stack Developer",
              description: data.shortBio,
            }),
          }}
        />
      </head>

      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
