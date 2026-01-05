import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const Project = ({ data }) => {
  const numOfProjectsOnHomePage = data.config?.numOfProjectsOnHomePage || 3;
  return (
    <section id="projects" className="py-20 bg-muted/10">
      <div className="container mx-auto px-4">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16"
          data-aos="fade-up"
        >
          My <span className="text-primary">Projects</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {data.projects.slice(0, numOfProjectsOnHomePage).map(
            (project, index) =>
              project.display && (
                <Card
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="overflow-hidden relative group border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
                >
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  {project.type && (
                    <Badge
                      variant="secondary"
                      className="absolute top-3 right-3 text-xs z-10 bg-gray-700 text-white"
                    >
                      {project.type}
                    </Badge>
                  )}

                  <CardHeader className="pt-4">
                    <CardTitle className="text-lg sm:text-xl">
                      {project.title}
                    </CardTitle>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
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
                    {project.demoUrl && (
                      <Button asChild size="sm" className="w-full sm:w-auto">
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Live Demo
                        </a>
                      </Button>
                    )}
                    {project.codeUrl && (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        <a
                          href={project.codeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Source Code
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
          )}
        </div>
        <div
          className="flex justify-center mt-10"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <Button asChild size="lg" className="px-8">
            <a
              href={data.projectsPageUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              View All Projects
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Project;
