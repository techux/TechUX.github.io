import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const Education = ({ data }) => {
  return (
    <section id="education" className="py-5 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-20"
          data-aos="fade-up"
        >
          My <span className="text-primary">Education</span>
        </h2>

        <div className="relative">
          {/* Vertical Timeline */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 h-full w-[2px] bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10" />

          {data.education.map((edu, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div
                key={index}
                className={`relative mb-5 flex flex-col md:flex-row ${
                  !isLeft ? "md:flex-row-reverse" : ""
                }`}
                data-aos={isLeft ? "fade-left" : "fade-right"}
              >
                {/* Timeline Dot */}
                <div className="absolute left-2 md:left-1/2 md:-translate-x-1/2 top-8 z-10">
                  <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20" />
                </div>

                {/* Horizontal Connector */}
                <div
                  className={`hidden md:block absolute top-10 h-[2px] bg-primary/30 ${
                    isLeft
                      ? "right-1/2 w-20"
                      : "left-1/2 w-20"
                  }`}
                />

                <div className="md:w-5/12 md:px-6 mt-6 md:mx-20 md:mt-0">
                  <Card className="group border border-primary/10 bg-background/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/40">
                    <CardHeader className="space-y-1">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {edu.duration}
                      </span>

                      <CardTitle className="text-lg md:text-xl">
                        {edu.degree}
                      </CardTitle>

                      <CardDescription className="text-sm font-medium text-primary">
                        {edu.institution}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {edu.description}
                      </p>
                    </CardContent>

                    <CardFooter className="justify-between">
                      <span className="text-xs text-muted-foreground">
                        Grade
                      </span>
                      <span className="text-sm font-semibold">
                        {edu.grade}
                      </span>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Education;
