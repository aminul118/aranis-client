import Container from '@/components/ui/Container';
import { getAllLocations } from '@/services/location/location';
import { Clock, MapPin, Phone } from 'lucide-react';

const LocationPage = async () => {
  const res = await getAllLocations('isActive=true');
  const locations = res?.data || [];

  return (
    <Container className="py-20 lg:py-32">
      <div className="mb-16 text-center">
        <div className="mb-6 inline-flex rounded-full bg-blue-100 p-4 font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <MapPin size={40} />
        </div>
        <h1 className="mb-4 text-4xl font-black tracking-widest uppercase italic md:text-5xl">
          Our <span className="text-blue-600">Outlets</span>
        </h1>
        <p className="mx-auto max-w-2xl text-gray-500 dark:text-gray-400">
          Visit any of our physical stores to experience the quality of our
          apparel firsthand. Our team is ready to help you find your perfect
          fit.
        </p>
      </div>

      {locations.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <div
              key={loc._id}
              className="group relative overflow-hidden rounded-[32px] border border-gray-100 bg-white p-10 transition-all hover:border-blue-500/20 hover:shadow-2xl dark:border-white/5 dark:bg-[#111111]"
            >
              <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-blue-600/5 transition-transform group-hover:scale-150" />

              <h3 className="mb-6 text-2xl font-black tracking-tighter text-gray-900 uppercase italic transition-colors group-hover:text-blue-600 dark:text-white">
                {loc.name}
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-sm leading-relaxed font-medium text-gray-600 dark:text-gray-400">
                    {loc.address}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                    {loc.phone}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                    {loc.hours}
                  </span>
                </div>
              </div>

              <button className="mt-10 w-full rounded-2xl bg-gray-50 py-4 text-[10px] font-black tracking-[0.2em] text-gray-900 uppercase italic transition-all hover:bg-blue-600 hover:text-white dark:bg-white/5 dark:text-white dark:hover:bg-blue-600">
                Get Directions
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 rounded-full bg-gray-100 p-8 dark:bg-white/5">
            <MapPin size={48} className="text-gray-300 dark:text-gray-700" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            No Outlets Available
          </h3>
          <p className="mt-2 text-gray-500">
            We are coming soon to your neighborhood!
          </p>
        </div>
      )}
    </Container>
  );
};

export default LocationPage;
