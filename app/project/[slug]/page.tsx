import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import data from "@/public/data.json";
import Link from "next/link";
import Script from "next/script";

const projectsData = data;

export function generateStaticParams() {
  return projectsData.projects.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = projectsData.projects.find((p) => p.slug === params.slug);

  console.log(project);

  if (!project) return notFound();

  return (
    <section className="py-20 bg-muted/10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {project.title}
          </h1>

          <p className="text-muted-foreground max-w-2xl mx-auto">
            {project.description}
          </p>

          <div className="flex justify-center flex-wrap gap-2 mt-4">
            {project.technologies.map((tech, i) => (
              <Badge key={i} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden border border-primary/10">
          {/* <div className="relative w-full h-[260px] sm:h-[380px]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-contain"
              loading="lazy"
            />
          </div> */}
          <Image
            src={project.image}
            alt={project.title}
            width={500}
            height={600}
            className="w-auto h-96 mx-auto object-contain rounded-md mt-6"
            loading="lazy"
          />

          <CardHeader>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <CardTitle className="text-xl">Project Overview</CardTitle>

              {project.type && (
                <Badge className="bg-gray-700 text-white">{project.type}</Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4 text-gray-800 dark:text-gray-300 text-sm sm:text-base">
            {project.details ? (
              <div dangerouslySetInnerHTML={{ __html: project.details }} />
            ) : (
              <div>{`This is a ${
                project.type || null
              } project built using ${project.technologies.join(", ")}.`}</div>
            )}

            {project.features && (
              <>
                <h3 className="text-md font-semibold">Key Features</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {project.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </>
            )}

            {project.challenges && (
              <>
                <h3 className="text-md font-semibold">Challenges Faced</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {project.challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              </>
            )}

            {project.learned && (
              <>
                <h3 className="text-md font-semibold">What I Learned</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {project.learned.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {project.technologies && (
              <>
                <h3 className="text-md font-semibold">
                  Tools & Technologies Used
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  {project.technologies.map((tool, index) => (
                    <li key={index}>{tool}</li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-4">
            {project.demoUrl && (
              <Button asChild className="w-full sm:w-auto">
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
              <Button asChild variant="outline" className="w-full sm:w-auto">
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
        <div className="flex justify-center mt-10">
          <Button variant="ghost" asChild>
            <Link href="/project">← Back to Projects</Link>
          </Button>
        </div>
      </div>

      <Script
        id="project-webpage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${data.url}/project/${project.slug}`,
            name: `${project.title} – ${data.name}`,
            description: project.description,
            url: `${data.url}/project/${project.slug}`,
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: project.image,
            },
            mainEntity: {
              "@type": "SoftwareApplication",
              "@id": `${data.url}/project/${project.slug}#software`,
              name: project.title,
              description: project.description,
              image: project.image,
              applicationCategory: "WebApplication",
              operatingSystem: "All",
              keywords: project.technologies.join(", "),
              sameAs: [project.demoUrl, project.codeUrl].filter(Boolean),
              author: {
                "@type": "Person",
                name: data.name,
                url: data.url,
              },
            },
          }),
        }}
      />
    </section>
  );
}
