import "./Filters.css";

import { ChangeEventHandler, useState } from "react";


export function CheckboxFilter({ name } : { name: string }) {
  return (
    <label className="filter__checkbox">
      <input type="checkbox" />
      {name}
    </label>
  )
}

export function RadioFilter({ group, name, value, onChange } : { group: string; name: string; value: boolean; onChange: ChangeEventHandler }) {
  return (
    <label className="filter__radio">
      <input name={group} type="radio" checked={value} onChange={onChange} />
      {name}
    </label>
  )
}

export function RadioFilterGroup({ defaultValue, groupTitle, groupName, names } : { defaultValue?: string; groupTitle?: string; groupName: string; names: string[] }) {
  const [value, setValue] = useState<string>(defaultValue ?? names[0]);

  return (
    <div className="filter__radio-group">
      {groupTitle && <h3>{groupTitle}</h3>}
      {names.map((name, index) =>
        <RadioFilter key={index}
          group={groupName}
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
    <input type="text"
      className="filter__search"
      placeholder={placeholder}
    />
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
