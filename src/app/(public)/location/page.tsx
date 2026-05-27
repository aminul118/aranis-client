import Container from '@/components/ui/Container';
import { generateDynamicMeta } from '@/seo/generateDynamicMeta';
import { getAllLocations } from '@/services/location/location';
import { Metadata } from 'next';
import EmptyOutlet from './_components/EmptyOutlet';
import LocationCard from './_components/LocationCard';
import LocationHeader from './_components/LocationHeader';

const LocationPage = async () => {
  const res = await getAllLocations('isActive=true');
  const locations = res?.data || [];

  return (
    <Container className="py-20 lg:py-32">
      {locations.length > 0 ? (
        <>
          <LocationHeader />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => (
              <LocationCard key={loc._id} loc={loc} />
            ))}
          </div>
        </>
      ) : (
        <EmptyOutlet />
      )}
    </Container>
  );
};

export default LocationPage;

export async function generateMetadata(): Promise<Metadata> {
  return generateDynamicMeta(
    '/location',
    'Store Locations',
    'Find our physical store outlets. Visit us to experience the quality of our apparel firsthand and get help from our expert team.',
  );
}
