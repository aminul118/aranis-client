type HeadingType = {
  heading: string;
  description?: string;
  className?: string;
};

const SectionHeading = ({ heading, description, className }: HeadingType) => {
  return (
    <div
      className={`text-muted-foreground mx-auto max-w-2xl space-y-3 px-2 py-12 text-center ${className}`}
    >
      <p className="text-foreground text-center text-4xl font-bold">
        {heading}
      </p>
      <p>{description}</p>
    </div>
  );
};

export default SectionHeading;
