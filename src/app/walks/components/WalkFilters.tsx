"use client"

import styles from "./WalkFilters.module.css";
import fontStyles from "@/styles/fonts.module.css";
import buttonStyles from "@/styles/buttons.module.css";

import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { DropdownIcon } from "@/icons/MaterialIcons";

import { distanceOptions, elevationOptions, locations } from "./WalkFilterValues";


export type MultiSelectFilterData = {
  type: "multi-select";
  title: string;
  values: {[key: string]: string};
  currentValues: string[];
  setCurrentValues: CallableFunction;

  enabledValues?: string[];
  isSearchable?: boolean;
}
export type SelectFilterData = {
  type: "select";
  title: string;
  values: {[key: string]: string};
  currentValue: string;
  setCurrentValue: (v?: string) => void;

  groupId: string;
  isRadio?: boolean;
  isSearchable?: boolean;
}
// type FilterData = MultiSelectFilterData | SelectFilterData;


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


type WalkFilterProps = {
  wainNames: {[slug : string]: string};
  title?: string;
  className?: string;
}

export default function WalkFilters({ wainNames, title, className } : WalkFilterProps) {

  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value.length > 0) params.set(key, value);
    else params.delete(key);

    window.history.replaceState({}, "", `/walks?${params.toString()}`)
  }

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const newFilters = {...initialFilterState} as FilterState;

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])


  const [locationSelectEntries, setLocationSelectEntries] = useState<string[]>(["keswick", "ambleside", "grasmere", "buttermere", "borrowdale", "coniston", "glenridding", "windermere"]);
  const townSelect : SelectFilterData = {
    type: "select",
    title: "Near to town",
    groupId: "town",
    values: Object.fromEntries([["any", "Any"]].concat(locationSelectEntries.map(loc => [loc, locations[loc]?.name ?? ""]))),
    
    currentValue: filters.town,
    setCurrentValue: (newTown?: string) => {
      updateParam("town", (newTown !== "any" ? newTown : ""));
    },
  }

  const wainChoose : MultiSelectFilterData = {
    type: "multi-select",
    title: "Wainwrights",
    values: wainNames,
    currentValues: filters.wainwrights,
    setCurrentValues: (newWainwrights: string[]) => {
      updateParam("wainwrights", newWainwrights.join(" "));
    },

    enabledValues: Object.keys(wainNames),
    isSearchable: true,
  }

  const distRadios : SelectFilterData = {
    type: "select",
    title: "Walk length",
    groupId: "distance",
    values: distanceOptions,

    currentValue: filters.distance,
    setCurrentValue: (newDist?: string) => {
      updateParam("distance", (newDist !== "any" ? newDist : ""));
    },
    isRadio: true,
  }
  const eleRadios : SelectFilterData = {
    type: "select",
    title: "Elevation gain",
    groupId: "elevation",
    values: elevationOptions,

    currentValue: filters.elevation,
    setCurrentValue: (newEle?: string) => {
      updateParam("elevation", (newEle !== "any" ? newEle : ""));
    },
    isRadio: true,
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
      updateParam("byBus", (val === "byBus" ? "yes" : ""));
    },
    isRadio: true,
  }

  const filterData = [
    townSelect,
    distRadios,
    eleRadios,
    wainChoose,
    transportRadios
  ]


  return (
    <div className={`${styles.filters} ${className ? className : ""}`}>
      {title &&
        <div className={styles.heading}>
          <h2 className={fontStyles.subheading}>{title}</h2>
        </div>
      }

      <Filters filterData={filterData} />
    </div>
  )
}


type FilterProps = {
  filterData: (MultiSelectFilterData | SelectFilterData)[];
  children?: React.ReactNode;
}


export function Filters({ filterData, children } : FilterProps) {

  return (
    <div className={styles.main}>
      {filterData?.map((filter, index) => (
        <FilterGroup key={index} filter={filter} />
      ))}

      {children}

      {/* {resetFilters && <FilterButton text="Reset filters" onClick={resetFilters} />} */}
    </div>
  )
}


function FilterGroup({ filter } : { filter: MultiSelectFilterData | SelectFilterData }) {

  const [open, setOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const clickListener = (e: MouseEvent) => {
      console.log("click!")
      if (filterRef.current && !e.composedPath().includes(filterRef.current)) {
        setOpen(false);
      }
    }

    document.addEventListener("mouseup", clickListener);
    return () => {
      document.removeEventListener("mouseup", clickListener);
    }
  }, [open])


  const currentValue = filter.type === "select" ? filter.currentValue : undefined;
  useEffect(() => {
    setOpen(false);
  }, [currentValue])


  return (
    <div
      className={styles.group}
      ref={filterRef}
      data-open={open}
      data-active={
        (filter.type === "select" && filter.currentValue !== "any") ||
        (filter.type === "multi-select" && filter.currentValues.length > 0)
      }
    >
      <button className={styles.group__button} onClick={() => setOpen(!open)}>
        <div className={styles.group__buttonMain}>
          <h3>{filter.title}</h3>
          <p className={styles.group__activeValue}>
            {filter.type === "select" &&
              filter.values[filter.currentValue]
            }
            {filter.type === "multi-select" &&
              filter.currentValues.length + " selected"
            }
          </p>
        </div>

        <DropdownIcon />
      </button>

      <div className={styles.group__main}>
        {filter.type === "select" &&
          (filter.isRadio
            ? <RadioFilterGroup data={filter} />
            : <SelectFilter data={filter} />
          )
        }
        {filter.type === "multi-select" && <CheckboxFilterGroup filter={filter} />}
      </div>
    </div>
  )
}


function CheckboxFilter({ name, checked, disabled, onChange } : { name: string; checked: boolean; disabled?: boolean; onChange: ChangeEventHandler<HTMLInputElement> }) {
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={onChange} />
      {name}
    </label>
  )
}

function CheckboxFilterGroup({ filter } : { filter: MultiSelectFilterData }) {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredValues, setFilteredValues] = useState(Object.keys(filter.values));

  useEffect(() => {
    if (searchTerm && searchTerm.length > 0) {
      setFilteredValues(Object.keys(filter.values).filter(key => key.replace("-", " ").includes(searchTerm.toLowerCase())))
    }
    else setFilteredValues(Object.keys(filter.values));
  }, [searchTerm, filter.values])


  return (
    <>
      {filter.isSearchable &&
        <SearchBoxFilter
          placeholder={"Search"}
          value={searchTerm}
          setValue={(newTerm: string) => setSearchTerm(newTerm)}
        />
      }
      <div className={styles.checkboxGroup}>
        {filteredValues.length > 0
        ? filteredValues
            .sort()
            .sort((a, b) => filter.enabledValues ? ((!filter.enabledValues.includes(a) && filter.enabledValues.includes(b)) ? 1 : 0) : 0)
            // .sort((a, b) => (!filter.currentValues.includes(a) && filter.currentValues.includes(b)) ? 1 : 0)
            .map((key, index) => {
              return (
                <CheckboxFilter key={index}
                  name={filter.values[key]}
                  checked={filter.currentValues.includes(key)}
                  onChange={e => {
                    if (e.target) {
                      if (e.target.checked) filter.setCurrentValues(filter.currentValues.concat([key]));
                      else filter.setCurrentValues(filter.currentValues.filter(k => k !== key))
                    }
                  }}
                  disabled={!filter.currentValues.includes(key) && (filter.enabledValues ? !filter.enabledValues.includes(key) : false) }
                />
              )
          })
        : <i className={styles.checkboxInfo}>No entries matching &apos;{searchTerm}&apos;</i>
        }
      </div>
      <div className={styles.checkboxBottom}>
        <button className={`${buttonStyles.button} ${buttonStyles.small} ${buttonStyles.accent}`} onClick={() => filter.setCurrentValues([])}>Clear all</button>
      </div>
    </>
  )
}


function RadioFilter({ groupId, name, checked, className, onChange } : { groupId: string; name: string; checked: boolean; className?: string; onChange: ChangeEventHandler }) {
  return (
    <label className={`${styles.radio} ${className ? className : ""}`}>
      <input name={groupId} type="radio" checked={checked} onChange={onChange} />
      {name}
    </label>
  )
}

function RadioFilterGroup({ data } : { data: SelectFilterData }) {
  return (
    <div className={styles.radioGroup}>
      {Object.keys(data.values).map((key, index) =>
        <RadioFilter key={index}
          groupId={data.groupId}
          name={data.values[key]}
          checked={data.currentValue === key}
          onChange={() => data.setCurrentValue(key)}
        />
      )}
    </div>
  )
}


function SearchBoxFilter({ placeholder, value, setValue } : { placeholder?: string; value: string; setValue: CallableFunction }) {
  return (
    <div className={styles.search}>
      <input type="text"
        placeholder={placeholder ?? "search"}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  )
}


function SelectFilter({ data } : { data: SelectFilterData }) {
  return (
    <div className={styles.select}>
      {Object.keys(data.values).map((key, index) => {
        return <RadioFilter key={index}
          className={styles.radioSelect}
          groupId={data.groupId}
          name={data.values[key]}
          checked={data.currentValue === key}
          onChange={() => data.setCurrentValue(key)}
        />
      })}
    </div>
  )
}
