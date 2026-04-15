import {useLocation, useNavigate, useSearchParams} from 'react-router';
import type {Filter} from '@shopify/hydrogen/storefront-api-types';

export function CollectionFilters({filters}: {filters: Filter[]}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleFilter = (input: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    
    // Convert parsed input back to string to handle toggling
    const key = Object.keys(input)[0];
    const value = String(input[key]);

    if (key === 'price') {
      // Special handling for price
      const priceObj: {min?: number; max?: number} = JSON.parse(value);
      if (priceObj.min) params.set('price_min', priceObj.min.toString());
      if (priceObj.max) params.set('price_max', priceObj.max.toString());
    } else if (key === 'variantOption') {
      // e.g. input is { variantOption: '{"name":"Color","value":"Red"}' }
      const variantObj = JSON.parse(value);
      const strVal = `${variantObj.name}:${variantObj.value}`;
      if (params.getAll('variantOption').includes(strVal)) {
        params.delete('variantOption', strVal);
      } else {
        params.append('variantOption', strVal);
      }
    } else {
      // ProductType, ProductVendor
      if (params.getAll(key).includes(value)) {
        params.delete(key, value);
      } else {
        params.append(key, value);
      }
    }

    // Reset pagination to first page when filtering
    params.delete('cursor');
    params.delete('direction');

    navigate(`${location.pathname}?${params.toString()}`, {
      preventScrollReset: true,
    });
  };

  const clearFilters = () => {
    navigate(location.pathname, {preventScrollReset: true});
  };

  const activeFiltersCount = Array.from(searchParams.keys()).filter(
    (key) => key !== 'cursor' && key !== 'direction',
  ).length;

  return (
    <div className="collection-filters flex flex-col gap-6">
      <div className="flex justify-between items-center pb-4 border-b border-brand-line">
        <h3 className="font-serif text-2xl text-brand-black">Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm font-light text-brand-muted hover:text-brand-black underline transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-col gap-8">
        {filters.map((filter) => {
          if (filter.values.length === 0) return null;
          return (
            <div key={filter.id} className="flex flex-col gap-3">
              <h4 className="font-medium text-brand-black uppercase tracking-wider text-sm">
                {filter.label}
              </h4>
              <ul className="flex flex-col gap-2">
                {filter.values.map((option) => {
                  const inputObj = JSON.parse((option.input as string) || '{}');
                  let isActive = false;
                  
                  // Check if active
                  const key = Object.keys(inputObj)[0];
                  if (key === 'variantOption') {
                    const strVal = `${inputObj[key].name}:${inputObj[key].value}`;
                    isActive = searchParams.getAll('variantOption').includes(strVal);
                  } else if (key !== 'price') {
                    isActive = searchParams.getAll(key).includes(inputObj[key]);
                  } // simplified price active detection for placeholder

                  return (
                    <li key={option.id}>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => toggleFilter(inputObj)}
                          className="w-4 h-4 rounded border-brand-line text-brand-black focus:ring-brand-black"
                        />
                        <span className="text-brand-black/80 font-light group-hover:text-brand-black transition-colors">
                          {option.label}
                        </span>
                        <span className="text-brand-muted text-xs ml-auto">
                          ({option.count})
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
