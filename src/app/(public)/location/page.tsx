import Container from '@/components/ui/Container';
import { MapPin } from 'lucide-react';

const locations = [
  {
    name: 'Main Branch - Banani',
    address: 'Block E, Road 11, Banani, Dhaka 1213',
    phone: '+880 1886-877730',
    hours: '10:00 AM - 10:00 PM',
  },
  {
    name: 'Dhanmondi Outlet',
    address: 'Satmasjid Road, Dhanmondi, Dhaka 1209',
    phone: '01633501123',
    hours: '11:00 AM - 9:00 PM',
  },
  {
    name: 'Uttara Flagship Store',
    address: 'Sector 3, Uttara, Dhaka 1230',
    phone: '01633501124',
    hours: '10:00 AM - 10:00 PM',
  },
];

const LocationPage = () => {
  return (
    <Container className="py-20 lg:py-32">
      <div className="mb-16 text-center">
        <div className="mb-6 inline-flex rounded-full bg-blue-100 p-4 font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <MapPin size={40} />
        </div>
        <h1 className="mb-4 text-4xl font-black tracking-widest uppercase md:text-5xl">
          Our Outlets
        </h1>
        <p className="mx-auto max-w-2xl text-gray-500 dark:text-gray-400">
          Visit any of our physical stores to experience the quality of our
          apparel firsthand. Our team is ready to help you find your perfect
          fit.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {locations.map((loc, i) => (
          <div
            key={i}
            className="group rounded-3xl border border-gray-100 bg-white p-8 transition-all hover:border-blue-500/20 hover:shadow-2xl dark:border-white/5 dark:bg-[#111111]"
          >
            <h3 className="mb-4 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white">
              {loc.name}
            </h3>
            <div className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-blue-600" />
                <span>{loc.address}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-5 w-5 items-center justify-center text-blue-600">
                  <span className="font-bold underline decoration-2">PH</span>
                </div>
                <span>{loc.phone}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-5 w-5 items-center justify-center text-blue-600">
                  <span className="font-bold underline decoration-2">HR</span>
                </div>
                <span>{loc.hours}</span>
              </div>
            </div>
            <button className="mt-8 w-full rounded-2xl bg-gray-50 py-4 text-sm font-bold tracking-widest text-gray-900 uppercase transition-colors hover:bg-blue-600 hover:text-white dark:bg-white/5 dark:text-white dark:hover:bg-blue-600">
              Get Directions
            </button>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default LocationPage;
