import { ILocation } from '@/services/location/location';
import { CalendarOff, Clock, MapPin, Phone } from 'lucide-react';

const LocationCard = ({ loc }: { loc: ILocation }) => {
  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-gray-100 bg-white p-10 transition-all hover:border-blue-500/20 hover:shadow-2xl dark:border-white/5 dark:bg-[#111111]">
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
            {Array.isArray(loc.phone) ? loc.phone.join(', ') : loc.phone}
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

        {loc.offDay && (
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-red-50 p-2.5 text-red-600 dark:bg-red-900/20 dark:text-red-400">
              <CalendarOff className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
              {loc.offDay} (Off Day)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationCard;
