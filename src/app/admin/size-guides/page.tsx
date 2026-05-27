import SizeGuideTable from '@/app/admin/size-guides/_components/SizeGuideTable';
import cleanSearchParams from '@/lib/cleanSearchParams';
import { getAllSizeGuides } from '@/services/size-guide/size-guide';
import { SearchParams } from '@/types';

export default async function SizeGuidesPage({ searchParams }: SearchParams) {
  const params = await cleanSearchParams(searchParams);
  const res = await getAllSizeGuides(params);
  const sizeGuides = res.data || [];
  const meta = res.meta;

  return <SizeGuideTable sizeGuides={sizeGuides} meta={meta} />;
}
