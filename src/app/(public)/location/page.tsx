import Container from '@/components/ui/Container';
import { MapPin } from 'lucide-react';

const LocationPage = () => {
  return (
    <Container className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 rounded-full bg-blue-100 p-4 font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
        <MapPin size={40} />
      </div>
      <h1 className="mb-4 text-4xl font-black tracking-widest uppercase">
        Our Locations
      </h1>
      <p className="max-w-md text-gray-500 dark:text-gray-400">
        We are expanding our physical stores across the country. Check back soon
        to find the nearest store to your location.
      </p>
    </Container>
  );
};

export default LocationPage;
