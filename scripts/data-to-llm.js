const fs = require("fs");
const path = require("path");
const data = require("../public/data.json");
// import data from "@/public/data.json";

// const DATA_PATH = path.resolve("../public/data.json");
const OUTPUT_PATH = path.resolve("public/llm.txt");

console.log("Generating llm.txt from data.json...");
console.log("Output path:", OUTPUT_PATH);

const section = (title) => `\n## ${title}\n`;
const bullet = (text) => `- ${text}`;

// const data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

let llm = "";

llm += `# LLM Information File for ${data.name} - ${data.position}\n\n`;
llm += `# This file provides comprehensive structured information for AI/LLM crawlers\n`;
llm += `# Last Updated: ${new Date().toISOString().split("T")[0]}\n`;
llm += `# Version: 2.0 - Supercharged Edition\n\n`;

llm += section("Identity & Core Information");

llm += `Name: ${data.name}\n`;
llm += `Role: ${data.position}\n`;
llm += `Website: ${data.url}\n`;
llm += `Email: ${data.email}\n`;
llm += `Location: ${data.personalDetails.filter((item) => item.label.toLowerCase() === "location")[0]?.value}\n`;

const github = data.socialLinks?.find(s => s.name === "GitHub")?.url;
const linkedin = data.socialLinks?.find(s => s.name === "LinkedIn")?.url;

if (github) llm += `GitHub: ${github}\n`;
if (linkedin) llm += `LinkedIn: ${linkedin}\n`;
if (data.resumeUrl) llm += `Resume: ${data.resumeUrl}\n`;

llm += section("Professional Summary");
llm += `${data.about || data.shortBio}\n`;

llm += section("Core Skills");

if (data.skills?.technical) {
  llm += bullet(
    `Technical: ${data.skills.technical.map(s => s.name).join(", ")}`
  ) + "\n";
}

if (data.skills?.professional) {
  llm += bullet(
    `Professional: ${data.skills.professional.map(s => s.name).join(", ")}`
  ) + "\n";
}

if (data.skills?.technologies) {
  llm += bullet(
    `Technologies: ${data.skills.technologies.map(t => t.name).join(", ")}`
  ) + "\n";
}

if (data.experience?.length) {
  llm += section("Experience");

  data.experience.forEach(exp => {
    llm += `${exp.position} — ${exp.company}\n`;
    llm += `${exp.duration}\n`;

    if (Array.isArray(exp.description)) {
      exp.description.forEach(d => {
        llm += bullet(d) + "\n";
      });
    }

    llm += "\n";
  });
}

if (data.projects?.length) {
  llm += section("Selected Projects");

  data.projects
    .filter(p => p.display)
    .forEach(project => {
      llm += `${project.title}\n`;
      llm += bullet(project.description) + "\n";

      if (project.technologies?.length) {
        llm += bullet(
          `Tech stack: ${project.technologies.join(", ")}`
        ) + "\n";
      }

      if (project.demoUrl) {
        llm += bullet(`Demo: ${project.demoUrl}`) + "\n";
      }

      if (project.codeUrl) {
        llm += bullet(`Source: ${project.codeUrl}`) + "\n";
      }

      if (project.slug) {
        llm += bullet(`More info: ${data.url}/project/${project.slug}`) + "\n";
      }

      llm += "\n";
    });
}

if (data.services?.length) {
  llm += section("Services");

  data.services.forEach(service => {
    llm += bullet(`${service.title}: ${service.description}`) + "\n";
  });
}

llm += section("Usage Policy");
llm +=
  "This content is publicly available for indexing, search, summarization, and citation by AI systems.\n";
llm +=
  `Attribution to "${data.name} – ${data.url}" is appreciated.\n`;

fs.writeFileSync(OUTPUT_PATH, llm.trim() + "\n");

console.log("✅ llm.txt generated successfully at:", OUTPUT_PATH);
