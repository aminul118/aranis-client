import { normalizeSlug } from '@/lib/url-slugs';
import { generateCategorizedMeta } from '@/seo/generateDynamicMeta';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ShopContent from '../shop/_components/ShopContent';

interface Props {
  params: Promise<{ slug: string[] }>;
}

const RESTRICTED_SEGMENTS = ['admin', 'api', 'auth', 'dashboard', 'user'];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug.some((s) => RESTRICTED_SEGMENTS.includes(s.toLowerCase()))) {
    return {};
  }
  return await generateCategorizedMeta(slug);
}

const DynamicShopPage = async ({ params }: Props) => {
  const { slug } = await params;

  // Prevent catch-all from capturing admin or system routes
  if (slug.some((s) => RESTRICTED_SEGMENTS.includes(s.toLowerCase()))) {
    notFound();
  }

  // slug = ['men', 'shirts', 'formal']
  const category = slug[0] ? normalizeSlug(slug[0]) : 'All';
  const subCategory = slug[1] ? normalizeSlug(slug[1]) : '';
  const type = slug[2] ? normalizeSlug(slug[2]) : '';

  return (
    <ShopContent
      initialFilters={{
        category: category === 'All' ? undefined : category,
        subCategory: subCategory || undefined,
        type: type || undefined,
      }}
    />
  );
};

export default DynamicShopPage;
export const dynamic = 'force-dynamic';
