import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const Skills = ({ data }) => {
  return (
    <section
      id="skills"
      className="py-20 bg-muted/30 overflow-x-hidden overflow-y-hidden"
    >
      <div className="container mx-auto px-4">
        <h2
          className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16"
          data-aos="fade-up"
        >
          My <span className="text-primary">Skills</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div data-aos="fade-right">
            <h3 className="text-2xl font-bold mb-6">Technical Skills</h3>
            <div className="space-y-5">
              {data.skills.technical.map((skill, index) => (
                <div
                  key={index}
                  className="space-y-2 max-w-xs md:max-w-full mx-auto"
                >
                  <div className="flex justify-between text-sm font-medium">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                      data-aos="slide-right"
                      data-aos-delay={index * 100}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div data-aos="fade-left">
            <h3 className="text-2xl font-bold mb-6">Professional Skills</h3>
            <div className="space-y-5">
              {data.skills.professional.map((skill, index) => (
                <div
                  key={index}
                  className="space-y-2 max-w-xs md:max-w-full mx-auto"
                >
                  <div className="flex justify-between text-sm font-medium">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                      data-aos="slide-right"
                      data-aos-delay={index * 100}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16" data-aos="fade-up">
          <h3 className="text-2xl font-bold mb-6 text-center">GitHub Stats</h3>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <Image
              src="https://github-readme-stats-total-kinky-69.vercel.app/api?username=techux&show_icons=true&include_all_commits=true&theme=react&cache_seconds=30&hide_border=true"
              width={450}
              height={195}
              alt="Devesh's GitHub Stats"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
            <Image
              src="https://github-readme-stats-total-kinky-69.vercel.app/api/top-langs/?username=techux&layout=compact&theme=react&hide_border=true"
              width={350}
              height={175}
              alt="Devesh's GitHub Top Programming Languages"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>

        <div className="mt-16" data-aos="fade-up">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Technologies & Tools
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {data.skills.technologies.map((tech, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
