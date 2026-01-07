"use client";

import "../globals.css";

import Header from "@/components/Header.jsx";
import data from "@/public/data.json";
import { scrollToSection } from "@/utils/common.utils";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header
        data={data}
        scrollToSection={scrollToSection}
        activeSection={"projects"}
      />
      {/* <section className="min-h-screen bg-background text-foreground"> */}
      <main className="p-6">{children}</main>
      {/* </section> */}
    </>
  );
}
