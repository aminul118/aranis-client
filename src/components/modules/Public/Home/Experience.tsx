import SectionHeading from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils';
import { getExperience } from '@/services/experience/experience';

const Experience = async () => {
  const { data } = await getExperience();

  return (
    <section
      className="relative overflow-hidden py-16 lg:py-24"
      id="experience"
    >
      {/* Background Gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] left-[15%] h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute right-[15%] bottom-[20%] h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4">
        <SectionHeading
          heading="Professional Experience"
          description="A journey through my professional career and the roles I've embraced."
        />

        <div className="relative mx-auto mt-16 max-w-5xl">
          {/* Center line with gradient */}
          <div className="absolute top-0 left-4 h-full w-[2px] bg-linear-to-b from-blue-500/50 via-purple-500/50 to-transparent md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-12">
            {data?.map((exp, i) => {
              const isLeft = i % 2 === 0;

              return (
                <div
                  key={exp._id}
                  className={`relative flex w-full flex-col md:flex-row ${
                    isLeft ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute top-0 left-4 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-blue-500 bg-black shadow-[0_0_10px_rgba(59,130,246,0.5)] md:left-1/2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  </div>

                  {/* Spacer for desktop alignment */}
                  <div className="hidden w-1/2 md:block" />

                  {/* Content Card */}
                  <div
                    className={cn(
                      'ml-12 w-[calc(100%-3rem)] md:ml-0 md:w-[calc(50%-2rem)]',
                      isLeft ? 'md:mr-8' : 'md:ml-8',
                    )}
                  >
                    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-blue-500/30 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/10">
                      {/* Hover gradient effect */}
                      <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20" />

                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                          {exp.timeline}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white transition-colors group-hover:text-blue-400">
                        {exp.position}
                      </h3>

                      <p className="mb-4 text-sm font-medium text-white/60">
                        {exp.companyName}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
