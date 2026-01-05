import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";

const sections = [
  "home",
  "about",
  "services",
  "skills",
  "education",
  "experience",
  "projects",
  "contact",
];

const Header = ({ data, scrollToSection, activeSection }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleNavClick = (section) => {
    scrollToSection(section);
    setMenuOpen(false);
  };

  if (window.location.hash){
    const sectionId = window.location.hash.substring(1);
    scrollToSection(sectionId);    
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 overflow-x-hidden border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold whitespace-nowrap">
            {data.name.split(" ")[0]}&nbsp;
            <span className="text-primary">{data.name.split(" ")[1]}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`text-sm font-medium capitalize transition-colors hover:text-primary ${
                  activeSection === section ? "text-primary" : ""
                }`}
              >
                {section}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full p-2 hover:bg-muted transition"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button
              className="md:hidden rounded-md p-2 hover:bg-muted transition"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden border-t bg-background overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex flex-col py-2">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => handleNavClick(section)}
                className={`w-full py-3 text-left text-sm capitalize transition hover:bg-muted ${
                  activeSection === section ? "font-medium text-primary" : ""
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
