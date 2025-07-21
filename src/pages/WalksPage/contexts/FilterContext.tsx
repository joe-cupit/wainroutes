import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MultiSelectFilterData, SelectFilterData } from "../components/Filters";
import { useHills } from "../../../contexts/HillsContext";
import { distanceOptions, elevationOptions, locations } from "../utils/FilterValues";


type FilterState = {
  town: string;
  distance: string;
  elevation: string;
  wainwrights: string[];
  byBus: boolean;
}
type FilterType = {
  town: SelectFilterData;
  distance: SelectFilterData;
  elevation: SelectFilterData;
  wainwrights: MultiSelectFilterData;
  byBus: SelectFilterData;
}


type FilterContextType = {
  filters: FilterState;
  filterObjects: FilterType;
  reset: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error('useFilters must be used in FilterContext');
  return context;
}


const initialFilterState : FilterState = {
  town: "any",
  distance: "any",
  elevation: "any",
  wainwrights: [],
  byBus: false
}


export const FiltersProvider = ({ children } : { children : ReactNode }) => {

  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const replaceSearchParams = (searchParams?: URLSearchParams) => {
    setUrlSearchParams(searchParams ?? {}, { replace: true })
  }

  useEffect(() => {
    const params = Object.fromEntries(urlSearchParams.entries());
    let newFilters = {...initialFilterState} as FilterState;

    // update town
    if (params.town && params.town in locations) {
      if (!locationSelectEntries.includes(params.town)) {
        setLocationSelectEntries(prev => [...prev, params.town]);
      }
      newFilters.town = params.town;
    }

    // update wainwrights
    newFilters.wainwrights = params.wainwrights?.split(" ") ?? [];

    // update distance
    if (params.distance && params.distance in distanceOptions) {
      newFilters.distance = params.distance;
    }

    // update elevation
    if (params.elevation && params.elevation in elevationOptions) {
      newFilters.elevation = params.elevation;
    }

    // update accessible by bus
    newFilters.byBus = (params.byBus === "yes");

    setFilters(newFilters);
  }, [urlSearchParams])


  const [locationSelectEntries, setLocationSelectEntries] = useState<string[]>(["keswick", "ambleside", "grasmere", "buttermere", "borrowdale", "coniston", "glenridding", "windermere"]);
  const townSelect : SelectFilterData = {
    type: "select",
    title: "Near to town",
    groupId: "town",
    values: Object.fromEntries([["any", "Any"]].concat(locationSelectEntries.map(loc => [loc, locations[loc]?.name ?? ""]))),
    
    currentValue: filters.town,
    setCurrentValue: (newTown?: string) => {
      if (newTown === undefined || newTown.length === 0 || newTown === "any") urlSearchParams.delete("town");
      else urlSearchParams.set("town", newTown);

      replaceSearchParams(urlSearchParams);
    }
  }

  const hillsData = useHills().hills;
  const wainValues = useMemo(() => {
    if (hillsData) return Object.fromEntries(hillsData.map(hill => [hill.slug, hill.name]));
    else return {};
  }, [hillsData])
  const wainChoose : MultiSelectFilterData = {
    type: "multi-select",
    title: "Wainwrights",
    values: wainValues,
    currentValues: filters.wainwrights,
    setCurrentValues: (newWainwrights: string[]) => {
      if (newWainwrights.length > 0) urlSearchParams.set("wainwrights", newWainwrights.join(" "));
      else urlSearchParams.delete("wainwrights");
      
      replaceSearchParams(urlSearchParams);
    },

    enabledValues: Object.keys(wainValues),
    isSearchable: true
  }

  const distRadios : SelectFilterData = {
    type: "select",
    title: "Walk length",
    groupId: "distance",
    values: distanceOptions,

    currentValue: filters.distance,
    setCurrentValue: (newDist?: string) => {
      if (newDist === undefined || newDist.length === 0 || newDist === "any") urlSearchParams.delete("distance");
      else urlSearchParams.set("distance", newDist);

      replaceSearchParams(urlSearchParams);
    },
    isRadio: true
  }
  const eleRadios : SelectFilterData = {
    type: "select",
    title: "Elevation gain",
    groupId: "elevation",
    values: elevationOptions,

    currentValue: filters.elevation,
    setCurrentValue: (newEle?: string) => {
      if (newEle === undefined || newEle.length === 0 || newEle === "any") urlSearchParams.delete("elevation");
      else urlSearchParams.set("elevation", newEle);

      replaceSearchParams(urlSearchParams);
    },
    isRadio: true
  }
  const transportRadios : SelectFilterData = {
    type: "select",
    title: "Transport access",
    groupId: "by-bus",
    values: {
      "any": "Any",
      "byBus": "By bus"
    },
    currentValue: filters.byBus ? "byBus" : "any",
    setCurrentValue: (val?: string) => {
      if (val !== undefined && val.length > 0 && val === "byBus") urlSearchParams.set("byBus", "yes");
      else urlSearchParams.delete("byBus");

      replaceSearchParams(urlSearchParams);
    },
    isRadio: true
  }

  const filterObjects = {
    town: townSelect,
    distance: distRadios,
    elevation: eleRadios,
    wainwrights: wainChoose,
    byBus: transportRadios
  };


  const resetFilters = useCallback(() => {
    const sortValue = urlSearchParams.get("sort");
    if (sortValue) {
      const newSearchParams = new URLSearchParams();
      newSearchParams.set("sort", sortValue);
      replaceSearchParams(newSearchParams);
    }
    else replaceSearchParams();
  }, [setUrlSearchParams])


  return (
    <FilterContext.Provider value={{ filters, filterObjects, reset: resetFilters }}>
      {children}
    </FilterContext.Provider>
  )
}
