'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ICategory } from '@/services/category/category';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function SubCategoryFilter({
  categories,
}: {
  categories: ICategory[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentFilter = searchParams.get('subCategories.title') || '';

  // Extract unique subcategory titles
  const uniqueTitles = Array.from(
    new Set(
      categories.flatMap((cat) =>
        cat.subCategories?.map((sub) => sub.title).filter(Boolean),
      ),
    ),
  ) as string[];

  const handleFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set('subCategories.title', value);
    } else {
      params.delete('subCategories.title');
    }

    // Reset to page 1 when filtering
    params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
  };

  if (uniqueTitles.length === 0) return null;

  return (
    <Select value={currentFilter || 'all'} onValueChange={handleFilter}>
      <SelectTrigger className="h-9 w-[180px]">
        <SelectValue placeholder="Filter by Subcategory" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Subcategories</SelectItem>
        {uniqueTitles.map((title) => (
          <SelectItem key={title} value={title}>
            {title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
