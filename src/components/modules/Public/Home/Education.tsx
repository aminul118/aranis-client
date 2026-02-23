import SectionHeading from '@/components/ui/SectionHeading';
import images from '@/constants/images';
import { Calendar, MapPin, University } from 'lucide-react';
import Image from 'next/image';

const Education = () => {
  return (
    <div className="container mx-auto px-4 py-16" data-aos="fade-up">
      <SectionHeading heading="Education Journey" />

      <div className="group relative overflow-hidden">
        {/* University Image */}
        <div className="relative h-[300px] w-full overflow-hidden rounded-xl md:h-[500px] lg:h-[600px]">
          <Image
            src={images.daffodil}
            alt="Daffodil International University"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Overlay Text for Mobile efficiency, hidden on larger screens if we want layout separation, 
              but let's keep it clean below the image for better readability based on current design */}
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left Column: Key Details */}
        <div className="space-y-4 lg:col-span-1">
          <h2 className="text-xl font-bold text-cyan-400 text-white md:text-3xl">
            B.Sc. in Computer Science & Engineering
          </h2>

          <div className="space-y-2 text-lg text-white/80">
            <div className="flex items-center gap-2">
              <University className="h-5 w-5 text-cyan-400" />
              <span className="font-medium">
                Daffodil International University
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-cyan-400" />
              <span>Dhaka, Bangladesh</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-400" />
              <span>2020 - 2023</span>
            </div>
          </div>
        </div>

        {/* Right Column: Description */}
        <div className="text-justify leading-relaxed text-white/70 lg:col-span-2 lg:border-l lg:border-white/10 lg:pl-8">
          <div className="prose prose-invert max-w-none">
            <p>
              During my B.Sc. in Computer Science & Engineering at Daffodil
              International University (2020 - 2023), I built a solid foundation
              in programming, web development, and database management.
              Throughout my academic journey, I actively participated in the
              Computer Programming Club, where I engaged in coding competitions,
              and collaborative projects that enhanced my problem-solving
              abilities and technical expertise.
            </p>
            <br />
            <p>
              Beyond coursework, I took on hands-on projects, exploring modern
              web technologies, some algorithms, and software development
              practices. My passion for learning led me to continuously improve
              my skills in full-stack development, API integration, and system
              design. These experiences have prepared me to tackle real-world
              challenges and contribute effectively to the tech industry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
