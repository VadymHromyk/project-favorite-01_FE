'use client';

import css from './FilterPanel.module.css';
// import { AppButton } from '@/components/Ui/Button/Button';
import { getLocationTypes, getRegions } from '@/lib/locationsApi';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface FilterPanelProps {
  region: string | undefined;
  locationType: string | undefined;
  sort: string | undefined;
}

export default function FilterPanel({
  region,
  locationType,
  sort,
}: FilterPanelProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeFromUrl =
    searchParams.get('locationType')?.split(',')[0] ?? locationType ?? '';

  const updateUrlFilter = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    nextParams.delete('page');
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const {
    data: regions = [],
    isPending: isRegionsPending,
    error: regionsError,
  } = useQuery({
    queryKey: ['regions'],
    queryFn: getRegions,
  });

  const {
    data: locationTypes = [],
    isPending: isLocationTypesPending,
    error: locationTypesError,
  } = useQuery({
    queryKey: ['locationTypes'],
    queryFn: getLocationTypes,
  });

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  // const [search, setSearch] = useState<string | undefined>(undefined);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [handleLocationType, setHandleLocationType] = useState<string | undefined>(undefined);
  // const [handleRegion, setHandleRegion] = useState<string | undefined>(undefined);
  const handleSearch = useDebouncedCallback((search: string) => {
    updateUrlFilter('search', search.trim());
  }, 1000);
  // const handleSearch = useDebouncedCallback((search: string) => {
  //   setSearch(search);
  // }, 1000);

  // const handleRegionChange = () => {
  //   setHandleRegion(handleRegion);
  //   setCurrentPage(1);
  // };
  // const handleTypeChange = () => {
  //   setHandleLocationType(handleLocationType);
  //   setCurrentPage(1);
  // };

  const handleRegionChange = (value: string) => {
    updateUrlFilter('region', value);
  };
  const handleTypeChange = (value: string) => {
    updateUrlFilter('locationType', value);
  };
  const handleSortChange = (value: string) => {
    updateUrlFilter('sort', value);
  };
  // const handleMultipleTypesChange = (type: string) => {
  //   const nextTypes = typesFromUrl.includes(type)
  //     ? typesFromUrl.filter(selectedType => selectedType !== type)
  //     : [...typesFromUrl, type];
  //   updateUrlFilter('locationType', nextTypes.join(','));
  // };

  // const handleSubmit = () => {};

  return (
    // <form onSubmit={handleSubmit}>
    <div className={css.panel}>
      <input
        className={css.searchInput}
        autoComplete="off"
        type="text"
        name="query"
        value={search}
        onChange={event => {
          setSearch(event.target.value);
          handleSearch(event.target.value);
        }}
        placeholder="Пошук"
        aria-label="Пошук"
      />
      <div className={css.filterRow}>
        <div className={css.control}>
          <label htmlFor="locationType">Тип локації</label>
          <select
            id="locationType"
            value={typeFromUrl}
            onChange={event => handleTypeChange(event.target.value)}
          >
            <option value="">Тип локації</option>
            {locationTypes.map(type => (
              <option key={type._id} value={type.slug}>
                {type.type}
              </option>
            ))}
          </select>
          {isLocationTypesPending && <p>Завантаження типів локацій...</p>}
          {locationTypesError && <p>Не вдалося завантажити типи локацій.</p>}
        </div>
        {/* Старий вибір кількох типів через checkbox:
      <fieldset>
        <legend>Тип локації</legend>
        {locationTypes.map(type => (
          <label key={type._id}>
            <input
              type="checkbox"
              value={type.slug}
              checked={typesFromUrl.includes(type.slug)}
              onChange={() => handleMultipleTypesChange(type.slug)}
            />
            <span>{type.type}</span>
          </label>
        ))}
      </fieldset>
      */}
        <div className={css.control}>
          <label htmlFor="region">Регіон</label>
          <select
            id="region"
            value={searchParams.get('region') ?? region ?? ''}
            onChange={event => handleRegionChange(event.target.value)}
          >
            <option value="">Регіон</option>
            {regions.map(region => (
              <option key={region._id} value={region.slug}>
                {region.region}
              </option>
            ))}
          </select>
          {isRegionsPending && <p>Завантаження регіонів...</p>}
          {regionsError && <p>Не вдалося завантажити регіони.</p>}
        </div>
      </div>
      <div className={`${css.control} ${css.sortControl}`}>
        <label htmlFor="sort">Сортування</label>
        <select
          id="sort"
          value={searchParams.get('sort') ?? sort ?? 'popular'}
          onChange={event => handleSortChange(event.target.value)}
        >
          {/* <option value="popular">Сортування</option> */}
          <option value="popular">За популярністю</option>
          <option value="rating">За рейтингом</option>
          <option value="newest">Новіші спочатку</option>
        </select>
      </div>
      {/* <AppButton
        className={css.searchButton}
        type="submit"
        aria-label="Знайти місце"
      >
        Знайти місце
      </AppButton> */}
      {/* </form> */}
    </div>
  );
}
