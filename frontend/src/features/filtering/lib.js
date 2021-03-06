import {useState, useEffect, useMemo} from 'react';

export function useFilter({options}) {
  let keys = Object.keys(options);

  const [option, selectOption] = useState(keys[0]);
  const currentFilterFunction = options[option];

  const filter = useMemo(
    () => ({
      option,
      selectOption,
      options,
      optionsArray: keys,
      currentFilterFunction,
    }),
    [options, option],
  );

  return filter;
}

export function useFilters({items, filters}) {
  const [filteredItems, setFilteredItems] = useState([]);
  const [filterCounts, setFilterCounts] = useState([]);

  useEffect(() => {
    let filteredItems = items;
    let filterCounts = [];

    filters.forEach((filter) => {
      const filterRunResult = {};
      // run filter for every possible function
      Object.keys(filter.options).forEach((option) => {
        const filtered = filteredItems.filter(filter.options[option]);

        filterRunResult[option] = filtered;
      });

      // calc counts for every option in filter
      const currentFilterCount = {};
      Object.keys(filterRunResult).forEach(
        (option) =>
          (currentFilterCount[option] = filterRunResult[option].length),
      );

      filterCounts.push(currentFilterCount);
      // set items to selected filter
      filteredItems = filterRunResult[filter.option];
    });

    setFilterCounts(filterCounts);
    setFilteredItems(filteredItems);
  }, [items, filters]);

  return {
    filterCounts,
    filteredItems,
  };
}
