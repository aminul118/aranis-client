import { cn } from '@/lib/utils';

interface GradientTitleProps {
  title?: string;
  description?: string;
  className?: string; // match React convention
}

const GradientTitle = ({
  title,
  description,
  className,
}: GradientTitleProps) => {
  return (
    <section>
      <div className={cn('text-center', className)}>
        <h1 className="mb-5 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-3xl font-bold text-transparent">
          {title}
        </h1>
        <p className="mb-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {description}
        </p>
      </div>
    </section>
  );
};

export default GradientTitle;
