'use client';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SearchingProps {
  placeholder?: string;
  className?: string;
}

const AppSearching = ({
  placeholder = 'Searching ...',
  className,
}: SearchingProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [query, setQuery] = useState(searchQuery);

  // Keep input synced with URL param
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  const updateSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('search', value);
    else params.delete('search');
    router.replace(`?${params.toString()}`);
    setQuery(value);
  };

  const handleSearch = () => updateSearch(query);
  const handleClearSearch = () => updateSearch('');

  return (
    <div className="flex items-center justify-center gap-2">
      <ButtonGroup>
        <div className="relative">
          <Input
            type="text"
            placeholder={placeholder}
            className={cn('h-9 w-sm rounded-r-none pr-10', className)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {/* Search clear button */}
          {query && (
            <Button
              type="button"
              variant="outline"
              className="absolute top-0 right-0 rounded-none border-0"
              onClick={handleClearSearch}
            >
              <X size={16} />
            </Button>
          )}
        </div>
        {/* Search Button */}
        <Button onClick={handleSearch}>
          <Search size={16} />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default AppSearching;
