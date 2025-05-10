import "./Filters.css";

import { ChangeEventHandler, useState } from "react";


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
  activeValues: string[];
  setActiveValues: CallableFunction;
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
}


export function FilterGroup({ title, children } : { title?: string; children?: React.ReactNode }) {
  return (
    <div className="filter__group">
      <h3>{title}</h3>
      {children}
    </div>
  )
}


export function CheckboxFilter({ name, checked, onChange } : { name: string; checked: boolean; onChange: ChangeEventHandler }) {
  return (
    <label className="filter__checkbox">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {name}
    </label>
  )
}

export function CheckboxFilterGroup({ data, expandable } : { data: CheckboxData; expandable?: boolean }) {
  
  const [expanded, setExpanded] = useState(false);


  return (
    <>
      <div className={"filter__checkbox-group" + (expanded ? " expanded" : "")}>
        {Object.keys(data.values).length > 0
        ? Object.keys(data.values)
            .splice(0, (expanded ? 999 : 4))
            .map((key, index) => {
              return (
                <CheckboxFilter key={index}
                  name={data.values[key]}
                  checked={data.activeValues.includes(key)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    console.log(e.target.checked)
                    if (e.target) {
                      if (e.target.checked) data.setActiveValues(data.activeValues.concat([key]));
                      else data.setActiveValues(data.activeValues.filter(k => k !== key))
                    }
                  }}
                />
              )
          })
        : <i>No Wainwrights</i>
        }
      </div>
      {(expandable && Object.keys(data.values).length > 4) &&
        <button className="filter__checkbox-link" onClick={() => setExpanded(prev => !prev)}>
          {expanded ? "view less" : "view more"}
        </button>
      }
    </>
  )
}


export function RadioFilter({ groupId, name, checked, onChange } : { groupId: string; name: string; checked: boolean; onChange: ChangeEventHandler }) {
  return (
    <label className="filter__radio">
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


export function SearchBoxFilter({ placeholder, value, onChange } : { placeholder?: string; value: string; onChange: CallableFunction }) {
  return (
    <div className="filter__search">
      <input type="text"
        placeholder={placeholder ?? "search"}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}


export function SelectFilter({ data } : { data: SelectData }) {
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


export function FilterButton({ text } : { text: string }) {
  return (
    <button className="button filter__button">
      {text}
    </button>
  )
}


export function Filters({ filterData, title, className } : { filterData: FilterData[]; title?: string; className?: string }) {
  return (
    <div className={"filters" + (className ? " "+className : "")}>
      {title && <h2 className="subheading">{title}</h2>}

      {filterData.map((filter, index) => {
        return (
          <FilterGroup key={index} title={filter.title}>
            {filter.type === "checkbox" &&
              <CheckboxFilterGroup data={filter.data} />
            }
            {filter.type === "searchable-checkbox" &&
              <>
              <SearchBoxFilter
                placeholder={filter.placeholder}
                value={filter.searchTerm}
                onChange={filter.setSearchTerm}
              />
              <CheckboxFilterGroup
                data={filter.data}
                expandable={true}
              />
              </>
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
    </div>
  )
}
