import { useState, useMemo } from 'react';

/**
 * Generic hook for filtering and searching lists
 * Reduces duplication across WorkspaceList, ProjectList, etc.
 * 
 * @example
 * ```typescript
 * const { 
 *   searchQuery, 
 *   setSearchQuery,
 *   filters,
 *   setFilter,
 *   filteredItems 
 * } = useFilteredList(items, {
 *   searchFields: ['name', 'description'],
 *   filterConfigs: {
 *     status: { defaultValue: 'all' },
 *     priority: { defaultValue: 'all' }
 *   },
 *   filterFn: (item, filters) => {
 *     if (filters.status !== 'all' && item.status !== filters.status) return false;
 *     if (filters.priority !== 'all' && item.priority !== filters.priority) return false;
 *     return true;
 *   }
 * });
 * ```
 */

export interface FilterConfig {
  defaultValue: string | number | boolean;
}

export interface UseFilteredListOptions<T> {
  /**
   * Fields to search in (dot notation supported, e.g., 'user.name')
   */
  searchFields: string[];
  
  /**
   * Filter configurations
   */
  filterConfigs?: Record<string, FilterConfig>;
  
  /**
   * Custom filter function
   */
  filterFn?: (item: T, filters: Record<string, any>) => boolean;
  
  /**
   * Case-sensitive search
   */
  caseSensitive?: boolean;
  
  /**
   * Debounce search (milliseconds)
   */
  searchDebounce?: number;
}

/**
 * Get nested property value from object using dot notation
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((curr, prop) => curr?.[prop], obj);
}

/**
 * Hook for filtered lists with search and multiple filters
 */
export function useFilteredList<T>(
  items: T[],
  options: UseFilteredListOptions<T>
) {
  const {
    searchFields,
    filterConfigs = {},
    filterFn,
    caseSensitive = false,
    searchDebounce = 0
  } = options;

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [filters, setFiltersState] = useState<Record<string, any>>(() => {
    const initialFilters: Record<string, any> = {};
    Object.entries(filterConfigs).forEach(([key, config]) => {
      initialFilters[key] = config.defaultValue;
    });
    return initialFilters;
  });

  /**
   * Set a single filter value
   */
  const setFilter = (key: string, value: any) => {
    setFiltersState(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Reset all filters to default values
   */
  const resetFilters = () => {
    const resetFilters: Record<string, any> = {};
    Object.entries(filterConfigs).forEach(([key, config]) => {
      resetFilters[key] = config.defaultValue;
    });
    setFiltersState(resetFilters);
  };

  /**
   * Reset search query
   */
  const resetSearch = () => {
    setSearchQuery('');
  };

  /**
   * Reset everything
   */
  const resetAll = () => {
    resetFilters();
    resetSearch();
  };

  /**
   * Filtered and searched items
   */
  const filteredItems = useMemo(() => {
    let result = items;

    // Apply search
    if (searchQuery.trim()) {
      const query = caseSensitive ? searchQuery : searchQuery.toLowerCase();
      
      result = result.filter(item => {
        return searchFields.some(field => {
          const value = getNestedValue(item, field);
          if (value === null || value === undefined) return false;
          
          const stringValue = String(value);
          const searchValue = caseSensitive ? stringValue : stringValue.toLowerCase();
          
          return searchValue.includes(query);
        });
      });
    }

    // Apply custom filters
    if (filterFn) {
      result = result.filter(item => filterFn(item, filters));
    }

    return result;
  }, [items, searchQuery, filters, searchFields, filterFn, caseSensitive]);

  /**
   * Check if any filters are active (non-default)
   */
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      const config = filterConfigs[key];
      return config && value !== config.defaultValue;
    });
  }, [filters, filterConfigs]);

  /**
   * Check if search is active
   */
  const hasActiveSearch = searchQuery.trim().length > 0;

  /**
   * Check if any filtering is active
   */
  const isFiltering = hasActiveFilters || hasActiveSearch;

  return {
    // Search
    searchQuery,
    setSearchQuery,
    resetSearch,
    hasActiveSearch,
    
    // Filters
    filters,
    setFilter,
    resetFilters,
    hasActiveFilters,
    
    // Combined
    resetAll,
    isFiltering,
    
    // Results
    filteredItems,
    totalCount: items.length,
    filteredCount: filteredItems.length,
    isFiltered: filteredItems.length !== items.length
  };
}

/**
 * Simpler version for search-only (no additional filters)
 */
export function useSearch<T>(
  items: T[],
  searchFields: string[],
  options?: {
    caseSensitive?: boolean;
  }
) {
  return useFilteredList(items, {
    searchFields,
    caseSensitive: options?.caseSensitive,
    filterConfigs: {}
  });
}
