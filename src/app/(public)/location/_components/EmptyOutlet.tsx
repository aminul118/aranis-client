import { MapPin } from 'lucide-react';

const EmptyOutlet = () => {
  return (
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
  );
};

export default EmptyOutlet;
