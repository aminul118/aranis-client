import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { IoCloudDownloadOutline } from 'react-icons/io5';

const DownloadResume = () => {
  return (
    <div className="flex gap-3">
      {/* External download => use <a> */}
      <a
        href="https://drive.google.com/file/d/19R1yOwSkOh4U3dEWRYJHgQt4_zTjCXjM/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:from-blue-500 hover:to-blue-400 hover:shadow-xl hover:shadow-blue-500/30 sm:w-auto sm:justify-start"
        aria-label="Download my resume"
      >
        <IoCloudDownloadOutline className="text-lg" />
        <span className="hidden whitespace-nowrap lg:block">
          Download Resume
        </span>{' '}
        <span className="whitespace-nowrap lg:hidden"> Resume</span>
      </a>

      {/* Internal route => Next Link */}
      <Link
        href="/projects"
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:text-white sm:w-auto sm:justify-start"
        aria-label="View my projects"
      >
        <span className="hidden whitespace-nowrap lg:block">View Projects</span>
        <span className="whitespace-nowrap lg:hidden">Projects</span>
        <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default DownloadResume;
