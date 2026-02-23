import SectionHeading from '@/components/ui/SectionHeading';
import { aboutMe } from '@/constants/aboutMe';
import Link from 'next/link';
import AboutImage from './AboutImage';

const About = () => {
  const about = aboutMe[0];

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 lg:py-20" id="about">
      <SectionHeading heading="About Me" />
      <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
        <AboutImage />
        <div
          className="mt-6 max-w-2xl flex-1 text-white/60"
          data-aos="fade-right"
        >
          <p className="text-justify">{about.paragraphs[0]}</p>

          {about.list && (
            <ul className="mt-3 list-outside list-disc space-y-1 pl-5">
              {about.list.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}

          {about.paragraphs[1] && (
            <p className="mt-3 text-justify">{about.paragraphs[1]}</p>
          )}

          <div className="mt-4">
            <Link
              href="/about"
              className="btn-outline inline-block rounded-full border px-6 py-2 text-sm font-medium transition-colors hover:bg-white/10"
              aria-label="Read more details about me"
            >
              Read Details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
