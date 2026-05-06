import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
import data from "@/public/data.json";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(data.url),

  title: {
    default: `${data.name} | ${data.position}`,
    template: `%s | ${data.name}`,
  },

  description: data.shortBio,

  keywords: [
    "Devesh Singh",
    "Devesh Developer",
    "Devesh Backend Developer",
    "Devesh Varanasi",
    "Devesh Singh Varanasi",
    "Full Stack Developer",
    "Web Developer",
    "React Developer",
    "Next.js Developer",
    "Portfolio",
    "JavaScript Developer",
    "TypeScript",
    "Devesh Singh Full Stack Developer",
    "Next.js Developer Portfolio",
    "React Developer India",
    "Freelance Full Stack Developer",
    "Web Developer Portfolio 2025",
    "TypeScript Developer",
    "Devesh Singh Web Developer",
    "Devesh web developer portfolio",
    "Devesh Singh Next.js Developer",
    "Devesh Singh LinkedIn",
    "Devesh Singh Developer LinkedIn",
    "Devesh Singh GitHub",
    "Devesh Singh Chandigarh University"
  ],

  authors: [{ name: data.name, url: data.url }],
  creator: data.name,
  publisher: data.name,

  alternates: {
    canonical: data.url,
    languages: {
      "en-US": data.url,
    },
  },

  icons: {
    icon: data.favicon || data.profileImage,
    shortcut: data.profileImage,
    apple: data.profileImage,
  },

  openGraph: {
    title: `${data.name} | ${data.position}`,
    description: data.shortBio,
    url: data.url,
    siteName: `${data.name} Portfolio`,
    images: [
      {
        url: data.profileImage,
        width: 1200,
        height: 630,
        alt: `${data.name} Portfolio`,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: `${data.name} | ${data.position}`,
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

const experienceSchema = data.experience.map((exp) => ({
  "@type": "Role",
  roleName: exp.position,
  description: exp.description.join(" "),
  startDate: exp.startDate,
  ...(exp.endDate !== "Present" && { endDate: exp.endDate }),
  worksFor: {
    "@type": "Organization",
    name: exp.company,
  },
}));

const projectSchema = data.projects
  .filter((project) => project.display)
  .map((project) => {
    const base = {
      name: project.title,
      description: project.description,
      url: data.url + `/project/${project.slug}`,
      sameAs: [project.demoUrl, project.codeUrl].filter(Boolean),
      image: project.image,
      creator: {
        "@type": "Person",
        name: data.name,
      },
      about: project.technologies,
      keywords: project.technologies.join(", "),
    };

    // Open-source / package project
    if (project.codeUrl && project.demoUrl?.includes("pypi.org")) {
      return {
        "@type": "SoftwareSourceCode",
        ...base,
        codeRepository: project.codeUrl,
        programmingLanguage: project.technologies,
      };
    }

    // Regular project
    return {
      "@type": "CreativeWork",
      ...base,
    };
  });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="oJkPdfq46rmoO3pbOSm_9N9Jb5x0tWqpqY68Gf7CDvk"
        />
        <meta name="msvalidate.01" content="CD863E2F707FF84BE4F5A51ABE8336B4" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css"
        />
        <link rel="alternate" type="text/plain" href="/llms.txt"></link>
        <link rel="alternate" type="text/markdown" href="/llms.md"></link>

        <script
          type="application/ld+json"
          id="website-jsonld"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${data.url}#website`,
              url: data.url,
              name: data.name,
              alternateName: `${data.name} Portfolio`,
              publisher: {
                "@type": "Person",
                name: data.name,
                url: data.url,
              },
            }),
          }}
        />

        <script
          type="application/ld+json"
          id="profile-jsonld"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfilePage",
              "@id": `${data.url}#profile`,
              url: data.url,
              name: `${data.name} | ${data.position}`,
              description: data.shortBio,

              mainEntity: {
                "@type": "Person",
                "@id": `${data.url}#person`,
                name: data.name,
                url: data.url,
                image: data.profileImage,
                email: `mailto:${data.email}`,
                jobTitle: data.position,
                sameAs: Object.values(data.socialLinks)
                  .flat()
                  .map((social) => social.url),
                knowsAbout: Object.values(data.skills.technologies)
                  .flat()
                  .map((skill) => skill.name),
                worksFor: experienceSchema,
              },
              hasPart: projectSchema.length ? projectSchema : undefined,
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
