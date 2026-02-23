import { Children } from '@/types';

type classNameProps = Children & {
  className?: string;
  id?: string;
  backgroundColor?: string;
};

const SectionContainer = ({
  children,
  className,
  backgroundColor,
  id,
}: classNameProps) => {
  return (
    <section id={id} className={backgroundColor}>
      <div
        className={`mx-auto px-2 py-8 lg:py-14 xl:py-16 2xl:py-24 ${className}`}
      >
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
