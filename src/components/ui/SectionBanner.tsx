type SectionBannerProps = {
  heading?: string;
  description?: string;
  className?: string;
  backgroundImagePath?: string;
};

const SectionBanner = ({
  heading,
  description,
  className,
  backgroundImagePath,
}: SectionBannerProps) => {
  return (
    <div
      className={`${className} relative flex h-64 w-full items-center justify-center bg-cover bg-center`}
      style={{
        backgroundImage: backgroundImagePath
          ? `url('${backgroundImagePath}')`
          : 'none',
      }}
    >
      {backgroundImagePath && (
        <div className="absolute inset-0 bg-black opacity-50"></div>
      )}
      <div className="relative z-10 max-w-2xl px-4 text-center">
        <h2 className="mb-4 text-2xl font-bold lg:text-4xl">{heading}</h2>
        {description && <p className="text-sm md:text-lg">{description}</p>}
      </div>
    </div>
  );
};

export default SectionBanner;
