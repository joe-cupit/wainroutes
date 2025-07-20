import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FilterData, RadioFilterData, SearchableCheckboxFilterData, SelectFilterData } from "../components/Filters";
import { useHills } from "../../../contexts/HillsContext";
import { distanceOptions, elevationOptions, locations } from "../utils/FilterValues";


type FilterState = {
  town: string;
  distance: string;
  elevation: string;
  wainwrights: string[];
  byBus: boolean;
}
const initialFilterState : FilterState = {
  town: "any",
  distance: "any",
  elevation: "any",
  wainwrights: [],
  byBus: false
}

type FilterType = {
    town: SelectFilterData;
    distance: RadioFilterData;
    elevation: RadioFilterData;
    wainwrights: SearchableCheckboxFilterData;
    byBus: RadioFilterData;
}
type FilterContextType = {
  filters: FilterState;
  filterObjects: FilterType;
}


const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error('useFilters must be used in FilterContext');
  return context;
}


export const FiltersProvider = ({ children } : { children : ReactNode }) => {

  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const replaceSearchParams = (searchParams?: URLSearchParams) => {
    console.log(searchParams)
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
  const townSelect : FilterData = {
    title: "Near to town",
    type: "select",
    data: {
      groupId: "town",
      values: Object.fromEntries([["any", "Any"]].concat(locationSelectEntries.map(loc => [loc, locations[loc]?.name ?? ""]))),
      currentValue: filters.town,
      setValue: (newTown: string) => {
        if (newTown === "any") urlSearchParams.delete("town");
        else urlSearchParams.set("town", newTown);

        replaceSearchParams(urlSearchParams);
      }
    }
  }

  const hillsData = useHills().hills;
  const wainValues = useMemo(() => {
    if (hillsData) return Object.fromEntries(hillsData.map(hill => [hill.slug, hill.name]));
    else return {};
  }, [hillsData])
  const wainChoose : FilterData = {
    title: "Wainwrights",
    type: "searchable-checkbox",
    data: {
      values: wainValues,
      enabledValues: Object.keys(wainValues),
      activeValues: filters.wainwrights,
      setActiveValues: (newWainwrights: string[]) => {
        if (newWainwrights.length > 0) urlSearchParams.set("wainwrights", newWainwrights.join(" "));
        else urlSearchParams.delete("wainwrights");

        replaceSearchParams(urlSearchParams);
      },
      groupName: "fells"
    },
    placeholder: "filter fells",
    searchTerm: "",
    setSearchTerm: () => {}
  }

  const distRadios : FilterData = {
    title: "Walk length",
    type: "radio",
    data: {
      groupId: "distance",
      values: distanceOptions,
      currentValue: filters.distance,
      setValue: (newDist: string) => {
        if (newDist === "any") urlSearchParams.delete("distance");
        else urlSearchParams.set("distance", newDist);

        replaceSearchParams(urlSearchParams);
      }
    },
  }
  const eleRadios : FilterData = {
    title: "Elevation gain",
    type: "radio",
    data: {
      groupId: "elevation",
      values: elevationOptions,
      currentValue: filters.elevation,
      setValue: (newEle: string) => {
        if (newEle === "any") urlSearchParams.delete("elevation");
        else urlSearchParams.set("elevation", newEle);

        replaceSearchParams(urlSearchParams);
      }
    },
  }
  const transportRadios : FilterData = {
    title: "Transport access",
    type: "radio",
    data: {
      groupId: "by-bus",
      values: {
        "any": "Any",
        "byBus": "By bus"
      },
      currentValue: filters.byBus ? "byBus" : "any",
      setValue: (val: string) => {
        if (val === "byBus") urlSearchParams.set("byBus", "yes");
        else urlSearchParams.delete("byBus");

        replaceSearchParams(urlSearchParams);
      }
    },
  }

  const filterObjects = {
    town: townSelect,
    distance: distRadios,
    elevation: eleRadios,
    wainwrights: wainChoose,
    byBus: transportRadios
  };


  return (
    <FilterContext.Provider value={{ filters, filterObjects }}>
      {children}
    </FilterContext.Provider>
  )
}
