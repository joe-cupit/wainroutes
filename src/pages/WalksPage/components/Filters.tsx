import "./Filters.css";

import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { DropdownIcon } from "../../../components/Icons";


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


export function FilterGroup({ title, children } : { title?: string; children?: React.ReactNode }) {
  return (
    <div className="filter__group">
      <h3>{title}</h3>
      {children}
    </div>
  )
}


export function CheckboxFilter({ name, checked, disabled, onChange } : { name: string; checked: boolean; disabled?: boolean; onChange: ChangeEventHandler<HTMLInputElement> }) {
  return (
    <label className="filter__checkbox">
      <input type="checkbox" checked={checked} disabled={disabled} onChange={onChange} />
      {name}
    </label>
  )
}

export function CheckboxFilterGroup({ filter } : { filter: MultiSelectFilterData }) {
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredValues, setFilteredValues] = useState(Object.keys(filter.values));

  useEffect(() => {
    if (searchTerm && searchTerm.length > 0) {
      setFilteredValues(Object.keys(filter.values).filter(key => key.replace("-", " ").includes(searchTerm.toLowerCase())))
    }
    else setFilteredValues(Object.keys(filter.values));
  }, [searchTerm])


  return (
    <>
      {filter.isSearchable &&
        <SearchBoxFilter
          placeholder={"Search"}
          value={searchTerm}
          setValue={(newTerm: string) => setSearchTerm(newTerm)}
        />
      }
      <div className="filter__checkbox-group">
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
        : <i className="filter__checkbox-info">No entries matching '{searchTerm}'</i>
        }
      </div>
    </>
  )
}


export function SearchableCheckboxFilterGroup({ data, placeholder } : { data: MultiSelectFilterData; placeholder?: string }) {

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    
  }, [searchTerm])


  return (
    <>
      <SearchBoxFilter
        placeholder={placeholder}
        value={searchTerm}
        setValue={(newTerm: string) => setSearchTerm(newTerm)}
      />
      <CheckboxFilterGroup
        filter={data}
      />
    </>
  )
}


export function RadioFilter({ groupId, name, checked, className, onChange } : { groupId: string; name: string; checked: boolean; className?: string; onChange: ChangeEventHandler }) {
  return (
    <label className={"filter__radio" + (className ? " "+className : "")}>
      <input name={groupId} type="radio" checked={checked} onChange={onChange} />
      {name}
    </label>
  )
}

export function RadioFilterGroup({ data } : { data: SelectFilterData }) {
  return (
    <div className="filter__radio-group">
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


export function SearchBoxFilter({ placeholder, value, setValue } : { placeholder?: string; value: string; setValue: CallableFunction }) {
  return (
    <div className="filter__search">
      <input type="text"
        placeholder={placeholder ?? "search"}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  )
}


export function SelectFilter({ data } : { data: SelectFilterData }) {
  return (
    <div className="filter__select">
      {Object.keys(data.values).map((key, index) => {
        return <RadioFilter key={index}
          className="filter__radio-select"
          groupId={data.groupId}
          name={data.values[key]}
          checked={data.currentValue === key}
          onChange={() => data.setCurrentValue(key)}
        />
      })}
    </div>
  )
}


export function SelectFilterOld({ data } : { data: SelectFilterData }) {
  return (
    <select
      className="filter__select"
      value={data.currentValue}
      onChange={e => data.setCurrentValue(e.target.value)}
    >
      {Object.keys(data.values).map((key, index) => {
        return (
          <option key={index} value={key}>
            {data.values[key]}
          </option>
        )
      })}
    </select>
  )
}


export function FilterButton({ text, onClick } : { text: string; onClick?: CallableFunction }) {
  return (
    <button className="button filter__button" onClick={() => onClick && onClick()}>
      {text}
    </button>
  )
}


export function Filters({ filterData, title, className, resetFilters, closeSelf, children } : { filterData: (MultiSelectFilterData | SelectFilterData)[]; title?: string; className?: string; resetFilters?: CallableFunction; closeSelf?: CallableFunction; children?: React.ReactNode }) {

  return (
    <div
      className={"filters" + (className ? " "+className : "")}
      // data-open={open}
    >
      {title &&
        <div className="filters__heading">
          <h2 className="subheading">{title}</h2>
        </div>
      }

      <div className="filters__main">
        {filterData.map((filter, index) => (<NewFilterGroup key={index} filter={filter} />))}

        {children}

        {/* {resetFilters && <FilterButton text="Reset filters" onClick={resetFilters} />} */}
      </div>

      {/* {closeSelf &&
        <button className="accent small button filters__open-close_bottom" onClick={() => closeSelf()}>
          Close filters
        </button>
      } */}
    </div>
  )
}


export function NewFilterGroup({ filter } : { filter: MultiSelectFilterData | SelectFilterData }) {

  const [open, setOpen] = useState(false);
  const FilterRef = useRef<HTMLDivElement>(null);

  const clickListener = (e: MouseEvent) => {
    if (FilterRef.current && !e.composedPath().includes(FilterRef.current)) openCloseFilter(false);
  }

  const openCloseFilter = (open: boolean) => {
    setOpen(open);

    if (open) document.addEventListener("mouseup", clickListener);
    else document.removeEventListener("mouseup", clickListener);
  }

  useEffect(() => {
    openCloseFilter(false);
  }, [(filter.type === "select" && filter.currentValue)])


  return (
    <div
      className="new-filter-group"
      ref={FilterRef}
      data-open={open}
      data-active={
        (filter.type === "select" && filter.currentValue !== "any") ||
        (filter.type === "multi-select" && filter.currentValues.length > 0)
      }
    >
      <button className="new-filter-group__button" onClick={() => openCloseFilter(!open)}>
        <div className="new-filter-group__button-main">
          <h3>{filter.title}</h3>
          <p className="new-filter-group__active-value">
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

      <div className="new-filter-group__main">
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
