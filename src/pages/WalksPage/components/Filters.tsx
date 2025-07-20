import "./Filters.css";

import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import { PlusIcon } from "../../../components/Icons";


type CheckboxFilterData = {
  type: "checkbox";
  data: CheckboxData;
  title?: string;
}
type SearchableCheckboxFilterData = {
  type: "searchable-checkbox";
  data: CheckboxData;
  title?: string;
  placeholder?: string;
  searchTerm: string;
  setSearchTerm: CallableFunction;
}
type RadioFilterData = {
  type: "radio";
  data: RadioData;
  title?: string;
}
type SelectFilterData = {
  type: "select";
  data: SelectData;
  title?: string;
}
export type FilterData = CheckboxFilterData | SearchableCheckboxFilterData | RadioFilterData | SelectFilterData;


type CheckboxData = {
  values: {[key: string]: string};
  enabledValues?: string[];
  activeValues: string[];
  setActiveValues: CallableFunction;

  groupName?: string;
}
type RadioData = {
  values: {[key: string]: string};
  currentValue: string;
  setValue: (v: string) => void;

  groupId: string;
}
type SelectData = {
  values: {[key: string]: string};
  currentValue: string;
  setValue: (v: string) => void;

  groupId: string;
}


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

export function CheckboxFilterGroup({ data } : { data: CheckboxData }) {
  
  const minEntries = 4;


  return (
    <>
      <div className="filter__checkbox-group">
        {Object.keys(data.values).length > 0
        ? Object.keys(data.values)
            .sort()
            .sort((a, b) => data.enabledValues ? ((!data.enabledValues.includes(a) && data.enabledValues.includes(b)) ? 1 : 0) : 0)
            .sort((a, b) => (!data.activeValues.includes(a) && data.activeValues.includes(b)) ? 1 : 0)
            .map((key, index) => {
              return (
                <CheckboxFilter key={index}
                  name={data.values[key]}
                  checked={data.activeValues.includes(key)}
                  onChange={e => {
                    if (e.target) {
                      if (e.target.checked) data.setActiveValues(data.activeValues.concat([key]));
                      else data.setActiveValues(data.activeValues.filter(k => k !== key))
                    }
                  }}
                  disabled={!data.activeValues.includes(key) && (data.enabledValues ? !data.enabledValues.includes(key) : false) }
                />
              )
          })
        : <i className="filter__checkbox-info">{data.groupName ? "No matching "+data.groupName : "No matching entries"}</i>
        }
      </div>
    </>
  )
}


export function SearchableCheckboxFilterGroup({ data, placeholder } : { data: CheckboxData; placeholder?: string }) {

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    
  }, [searchTerm])


  return (
    <>
      <SearchBoxFilter
        placeholder={placeholder}
        value={searchTerm}
        setValue={(newTerm: string) => {console.log(newTerm); setSearchTerm(newTerm)}}
      />
      <CheckboxFilterGroup
        data={data}
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

export function RadioFilterGroup({ data } : { data: RadioData }) {
  return (
    <div className="filter__radio-group">
      {Object.keys(data.values).map((key, index) =>
        <RadioFilter key={index}
          groupId={data.groupId}
          name={data.values[key]}
          checked={data.currentValue === key}
          onChange={() => data.setValue(key)}
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


export function SelectFilter({ data } : { data: SelectData }) {
  return (
    <div className="filter__select">
      {Object.keys(data.values).map((key, index) => {
        return <RadioFilter key={index}
          className="filter__radio-select"
          groupId={data.groupId}
          name={data.values[key]}
          checked={data.currentValue === key}
          onChange={() => data.setValue(key)}
        />
      })}
    </div>
  )
}


export function SelectFilterOld({ data } : { data: SelectData }) {
  return (
    <select
      className="filter__select"
      value={data.currentValue}
      onChange={e => data.setValue(e.target.value)}
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


export function CloseableFilters({ filterData, title, className, resetFilters, children } : { filterData: FilterData[]; title?: string; className?: string; resetFilters?: CallableFunction; children?: React.ReactNode }) {

  const [open, setOpen] = useState(true);


  return (
    <div
      className={"filters" + (className ? " "+className : "")}
      data-open={open}
    >
      <div className="filters__heading">
        {title && <h2 className="subheading">{title}</h2>}
        <button
          className="filters__open-close"
          onClick={() => setOpen(prev => !prev)}
          title={open ? "Close filters" : "Open filters"}
        >
          <PlusIcon />
        </button>
      </div>

      <div className="filters__main">
        {filterData.map((filter, index) => {
          return (
            <FilterGroup key={index} title={filter.title}>
              {filter.type === "checkbox" &&
                <CheckboxFilterGroup data={filter.data} />
              }
              {filter.type === "searchable-checkbox" &&
                <SearchableCheckboxFilterGroup data={filter.data} />
              }
              {filter.type === "radio" &&
                <RadioFilterGroup data={filter.data} />
              }
              {filter.type === "select" &&
                <SelectFilter data={filter.data} />
              }
            </FilterGroup>
          )
        })}

        {children}

        {resetFilters && <FilterButton text="Reset filters" onClick={resetFilters} />}
      </div>

      {open &&
        <button className="filters__open-close_bottom" onClick={() => setOpen(prev => !prev)}>
          close filters
        </button>
      }
    </div>
  )
}


export function Filters({ filterData, title, className, resetFilters, closeSelf, children } : { filterData: FilterData[]; title?: string; className?: string; resetFilters?: CallableFunction; closeSelf?: CallableFunction; children?: React.ReactNode }) {

  return (
    <div
      className={"filters" + (className ? " "+className : "")}
      data-open={open}
    >
      {title &&
        <div className="filters__heading">
          <h2 className="subheading">{title}</h2>
        </div>
      }

      <div className="filters__main">
        {filterData.map((filter, index) => {
          return (
            <NewFilterGroup key={index} filter={filter} />
            // <FilterGroup key={index} title={filter.title}>
            //   {filter.type === "checkbox" &&
            //     <CheckboxFilterGroup data={filter.data} />
            //   }
            //   {filter.type === "searchable-checkbox" &&
            //     <SearchableCheckboxFilterGroup data={filter.data} />
            //   }
            //   {filter.type === "radio" &&
            //     <RadioFilterGroup data={filter.data} />
            //   }
            //   {filter.type === "select" &&
            //     <SelectFilter data={filter.data} />
            //   }
            // </FilterGroup>
          )
        })}

        {children}

        {/* {resetFilters && <FilterButton text="Reset filters" onClick={resetFilters} />} */}
      </div>

      {closeSelf &&
        <button className="filters__open-close_bottom" onClick={() => closeSelf()}>
          close filters
        </button>
      }
    </div>
  )
}


export function NewFilterGroup({ filter } : { filter: FilterData }) {

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
  }, [((filter.type !== "checkbox" && filter.type !== "searchable-checkbox") && filter.data.currentValue)])


  return (
    <div
      className="new-filter-group"
      ref={FilterRef}
      data-open={open}
      data-active={
        ((filter.type === "radio" || filter.type === "select") && filter.data.currentValue !== "any") ||
        ((filter.type === "checkbox" || filter.type === "searchable-checkbox") && filter.data.activeValues.length > 0)
      }
    >
      <button className="new-filter-group__button" onClick={() => openCloseFilter(!open)}>
        <h3>{filter.title}</h3>
        <p className="new-filter-group__active-value">
          {(filter.type === "radio" || filter.type === "select") &&
            filter.data.values[filter.data.currentValue]
          }
          {(filter.type === "checkbox" || filter.type === "searchable-checkbox") &&
            filter.data.activeValues.length + " selected"
          }
        </p>
      </button>

      <div className="new-filter-group__main">
        {filter.type === "radio" && <RadioFilterGroup data={filter.data} />}
        {filter.type === "checkbox" && <CheckboxFilterGroup data={filter.data} />}
        {filter.type === "searchable-checkbox" && <SearchableCheckboxFilterGroup data={filter.data} />}
        {filter.type === "select" && <SelectFilter data={filter.data} />}
      </div>
    </div>
  )
}
