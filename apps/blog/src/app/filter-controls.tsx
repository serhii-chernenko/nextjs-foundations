'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type Props = {
  currentCategory?: string;
  currentSort?: string;
};

export function FilterControls({ currentCategory, currentSort }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create a new URLSearchParams instance preserving existing params
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Reset pagination when filters change
      if (name !== 'page') {
        params.delete('page');
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryChange = (category: string) => {
    router.push(`${pathname}?${createQueryString('category', category)}`);
  };

  const handleSortChange = (sort: string) => {
    router.push(`${pathname}?${createQueryString('sort', sort)}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {/* Category filter */}
      <div className="flex gap-2">
        <button
          className={`rounded px-3 py-1 text-sm ${
            currentCategory ? 'bg-gray-100' : 'bg-blue-600 text-white'
          }`}
          onClick={() => handleCategoryChange('')}
          type="button"
        >
          All
        </button>
        <button
          className={`rounded px-3 py-1 text-sm ${
            currentCategory === 'tech'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100'
          }`}
          onClick={() => handleCategoryChange('tech')}
          type="button"
        >
          Tech
        </button>
        <button
          className={`rounded px-3 py-1 text-sm ${
            currentCategory === 'general'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100'
          }`}
          onClick={() => handleCategoryChange('general')}
          type="button"
        >
          General
        </button>
      </div>

      {/* Sort control */}
      <select
        className="rounded border px-3 py-1 text-sm"
        onChange={(e) => handleSortChange(e.target.value)}
        value={currentSort || ''}
      >
        <option value="">Default order</option>
        <option value="title">Sort by title</option>
      </select>

      {/* Clear all filters */}
      {(currentCategory || currentSort) && (
        <button
          className="text-red-600 text-sm hover:underline"
          onClick={clearFilters}
          type="button"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
