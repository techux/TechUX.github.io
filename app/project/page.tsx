"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import data from "@/public/data.json";
import AOS from "aos";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PROJECTS_PER_LOAD =
  data.projects.length >= data.config.numOfProjectsPerLoad
    ? data.config.numOfProjectsPerLoad
    : data.projects.length;

export default function AllProjectsPage() {
  const projects = data.projects.filter((p) => p.display);
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_LOAD);

  const visibleProjects = projects.slice(0, visibleCount);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <section className="py-20 bg-muted/10 min-h-screen">
      <div className="container mx-auto px-4">
        <h1
          className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16"
          // data-aos="fade-up"
        >
          All <span className="text-primary">Projects</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {visibleProjects.map(
            (project, index) =>
              project.display &&
              project.slug && (
                <div key={project.slug}>
                  <Card
                    key={project.slug}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    className="overflow-hidden relative group border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg flex flex-col"
                  >
                    <Link href={`/project/${project.slug}`}>
                      <div className="relative h-48 sm:h-56 overflow-hidden cursor-pointer">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </Link>

                    {project.type && (
                      <Badge
                        variant="secondary"
                        className="absolute top-3 right-3 text-xs bg-gray-700 text-white"
                      >
                        {project.type}
                      </Badge>
                    )}

                    <CardHeader className="pt-4">
                      <CardTitle className="text-lg sm:text-xl">
                        {project.title}
                      </CardTitle>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs hover:scale-105 transition"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>

                    <CardContent className="flex-grow">
                      <p className="text-sm sm:text-base text-muted-foreground">
                        {project.description}
                      </p>
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-auto">
                      <Button asChild size="sm" className="w-full sm:w-auto">
                        <Link href={`/project/${project.slug}`}>
                          View Details
                        </Link>
                      </Button>

                      {project.demoUrl && (
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="w-full sm:w-auto"
                        >
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Live Demo
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              )
          )}
        </div>

        {visibleCount < projects.length && (
          <div className="flex justify-center mt-14">
            <Button
              size="lg"
              variant="outline"
              onClick={() =>
                setVisibleCount((prev) => prev + PROJECTS_PER_LOAD)
              }
              data-aos="fade-up"
            >
              Load More Projects
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
