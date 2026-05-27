import { MapPin } from 'lucide-react';

const LocationHeader = () => {
  return (
    <div className="mb-16 text-center">
      <div className="mb-6 inline-flex rounded-full bg-blue-100 p-4 font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        <MapPin size={40} />
      </div>
      <h1 className="mb-4 text-4xl font-black tracking-widest uppercase italic md:text-5xl">
        Our <span className="text-blue-600">Outlets</span>
      </h1>
      <p className="mx-auto max-w-2xl text-gray-500 dark:text-gray-400">
        Visit any of our physical stores to experience the quality of our
        apparel firsthand. Our team is ready to help you find your perfect fit.
      </p>
    </div>
  );
};

export default LocationHeader;
