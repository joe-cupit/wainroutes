import "./Filters.css";

import { ChangeEventHandler, useState } from "react";


export function FilterGroup({ title, children } : { title?: string; children?: React.ReactNode }) {
  return (
    <div className="filter__group">
      <h3>{title}</h3>
      {children}
    </div>
  )
}


export function CheckboxFilter({ name } : { name: string }) {
  return (
    <label className="filter__checkbox">
      <input type="checkbox" />
      {name}
    </label>
  )
}

export function CheckboxFilterGroup({ children } : { children?: React.ReactNode }) {
  return (
    <div className="filter__checkbox-group">
      {children}
    </div>
  )
}


export function RadioFilter({ groupId, name, value, onChange } : { groupId: string; name: string; value: boolean; onChange: ChangeEventHandler }) {
  return (
    <label className="filter__radio">
      <input name={groupId} type="radio" checked={value} onChange={onChange} />
      {name}
    </label>
  )
}

export function RadioFilterGroup({ defaultValue, groupId, names } : { defaultValue?: string; groupId: string; names: string[] }) {
  const [value, setValue] = useState<string>(defaultValue ?? names[0]);

  return (
    <div className="filter__radio-group">
      {names.map((name, index) =>
        <RadioFilter key={index}
          groupId={groupId}
          name={name}
          value={value === name}
          onChange={() => setValue(name)}
        />
      )}
    </div>
  )
}


export function SearchBoxFilter({ placeholder } : { placeholder?: string }) {
  return (
    <div className="filter__search">
      <input type="text"
        placeholder={placeholder}
      />
    </div>
  )
}


export function SelectFilter({ defaultValue, optionData } : { defaultValue?: string; optionData: {[value: string] : string} }) {
  const [value, setValue] = useState<string>(defaultValue ?? Object.keys(optionData)[0]);

  return (
    <select
      className="filter__select"
      value={value}
      onChange={e => setValue(e.target.value)}
    >
      {Object.keys(optionData).map((value, index) => {
        return (
          <option key={index} value={value}>
            {optionData[value]}
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
