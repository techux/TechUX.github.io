import Image from "next/image";
import { Button } from "@/components/ui/button";

const About = ({ data }) => {
  return (
    <section id="about" className="bg-muted/30 py-16 md:py-20 overflow-x-hidden">
      <div className="container mx-auto px-4">
        <h2
          className="mb-12 text-center text-2xl font-bold md:mb-16 md:text-4xl"
          data-aos="fade-up"
        >
          About <span className="text-primary">Me</span>
        </h2>

        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div
            className="flex justify-center"
            data-aos="fade-right"
          >
            <div className="relative h-56 w-56 overflow-hidden rounded-full border-4 border-primary/20 sm:h-64 sm:w-64 md:h-80 md:w-80">
              <Image
                src={data.profileImage || "/placeholder.svg"}
                alt={data.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 14rem, (max-width: 768px) 16rem, 20rem"
              />
            </div>
          </div>

          <div
            className="text-center md:text-left"
            data-aos="fade-left"
          >
            <p className="mb-6 text-sm text-muted-foreground sm:text-base">
              {data.about}
            </p>

            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.personalDetails.map((detail, index) => (
                <div key={index}>
                  <span className="font-semibold">{detail.label}:</span>{" "}
                  {detail.value}
                </div>
              ))}
            </div>

            <Button asChild className="w-full sm:w-auto">
              <a
                href={data.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download CV
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
