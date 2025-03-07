function WalkCheckboxFilter({ name, list, isSearchable=false, wainwrights=false }) {

  if (list === null || list === undefined || list.length === 0) return <></>

  if (wainwrights) {
    list.sort((a, b) => hillData?.[b]?.hasWalk - hillData?.[a]?.hasWalk)
  }

  const [selected, setSelected] = useState([])

  function onCheckboxChange(checked, label) {
    if (checked) {
      setSelected(prev => prev.includes(label) ? [...prev] : [...prev, label])
    }
    else {
      setSelected(prev => prev.includes(label) ? prev.filter(i => i !== label) : [...prev])
    }
  }


  return (
    <WalkFilter name={name}
      isSearchable={isSearchable}
      selectedCount={selected.length}
      onClear={() => setSelected([])}
    >
      <div className="walks-page_filter-options flex-column wrap-none">
        {list.map((label, index) => {
          return (
            <WalkCheckboxInput key={index}
              label={wainwrights ? hillData?.[label]?.name : label}
              checked={selected.includes(label)}
              setChecked={(checked) => onCheckboxChange(checked, label)}
              disabled={wainwrights ? !hillData?.[label]?.hasWalk : false}
            />
          )
        })}
      </div>
    </WalkFilter>
  )
}
function WalkCheckboxInput({ label, checked, setChecked, disabled }) {
  return (
    <label className={"walks-page_filter-options_option flex-row align-center wrap-none" + (disabled ? " disabled" : "")}>
      <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} disabled={disabled} />
      {label}
    </label>
  )
}

function WalkRadioFilter({ name, list, isSearchable=false }) {

  if (list === null || list === undefined || list.length === 0) return <></>

  const [selected, setSelected] = useState(null)

  function onRadioChange(label) {
    if (selected === label) setSelected(null)
    else setSelected(label)
  }


  return (
    <WalkFilter name={name}
      isSearchable={isSearchable}
      onClear={() => setSelected(null)}
    >
      <div className="walks-page_filter-options flex-column wrap-none">
        {list.map((label, index) => {
          return (
            <WalkRadioInput key={index}
              label={label}
              checked={selected == label}
              setChecked={() => onRadioChange(label)}
            />
          )
        })}
      </div>
    </WalkFilter>
  )
}
function WalkRadioInput({ label, checked, setChecked }) {
  return (
    <label className="walks-page_filter-options_option flex-row align-center">
      <input type="radio" checked={checked} onChange={setChecked} />
      {label}
    </label>
  )
}


function WalkFilter({ name, selectedCount, onClear, children, isSearchable=false }) {

  const [open, setOpen] = useState(false)


  return (
    <div className={"walks-page_filter" + (open ? " active" : "")}>
      <button
        className="walks-page_filter-button flex-row"
        onClick={() => setOpen(prev => !prev)}
      >
        {name + ((selectedCount && selectedCount > 0) ? ` (${selectedCount})` : "")}
        <ChevronIcon />
      </button>

      <div
        className="walks-page_filter-popup flex-column"
        style={open ? {} : {display: "none"}}
      >
        {isSearchable && <WalkFilterSearchBar name={name} />}

        {children}

        <WalkFilterButtons onClear={onClear} />
      </div>
    </div>
  )
}

function WalkFilterSearchBar({ name }) {
  return (
    <div className="walks-page_filter-search">
      <input type="text" placeholder={"search " + (name ? name?.toLowerCase() : "")} />
    </div>
  )
}

function WalkFilterButtons({ onClear }) {
  return (
    <div className="walks-page_filter-buttons flex-row">
      <button
        className="secondary small button"
        onClick={onClear}
      >
        Clear
      </button>
      <button
        className="primary small button"
        onClick={() => setOpen(false)}
      >
        Update
      </button>
    </div>
  )
}



export function WalkCardWide({ walk, onHover, link=true, distFrom=null }) {

  if (walk === null || walk === undefined) return <></>

  let distString = ""
  if (distFrom) {
    let dist = getDistanceValue(haversine(distFrom, [walk?.startLocation?.longitude, walk?.startLocation?.latitude]) / 1000)

    if (getDistanceUnit() === "km" && dist < 1) {
      distString = (dist * 1000).toFixed(0) + "m"
    }
    else if (getDistanceUnit() === "mi" && dist < 0.1) {
      distString = metersToFeet(dist * 1000) + "ft"
    }
    else {
      distString = dist.toFixed(1) + getDistanceUnit()
    }

    distString += " away"
  }


  const WalkCardContent = <>
    <div className="walk-card-wide_image">
      <Image name={walk?.slug + "_" + walk?.gallery?.coverId} sizes="(min-width: 200px) 200px, 40vw" />
      {distFrom &&
        <p className="walk-card-wide_dist">
          {distString}
        </p>
      }
    </div>

    <div className="walk-card-wide_main flex-column gap-0">
      <h3 className="walk-card-wide_title subheading">{walk.title}</h3>

      <p className="walk-card-wide_intro">{walk.intro ?? "nothing to see here"}</p>

      <div className="walk-card-wide_stats flex-row flex-apart gap-0">
        <div title={walk.wainwrights?.length + " Wainwrights"}>
          <MountainIcon /> {walk.wainwrights?.length}
        </div>
        <div title={"Route length: " + displayDistance(walk.length, 1)}>
          <HikingIcon /> {displayDistance(walk.length, 1)}
        </div>
        <div title={"Elevation gain: " + displayElevation(walk.elevation)}>
          <ElevationIcon /> {displayElevation(walk.elevation)}
        </div>
      </div>
    </div>
  </>


  if (link) return (
    <Link to={"/walks/"+walk.slug}
      className="walk-card-wide"
      title={walk?.title}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover()}
    >
      {WalkCardContent}
    </Link>
  )
  else return (
    <div
      className="walk-card-wide"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover()}
    >
      {WalkCardContent}
    </div>
  )
}




export function WalkCardWide({ walk, onHover, link=true, distFrom=null }) {

  if (walk === null || walk === undefined) return <></>

  let distString = ""
  if (distFrom) {
    let dist = getDistanceValue(haversine(distFrom, [walk?.startLocation?.longitude, walk?.startLocation?.latitude]) / 1000)

    if (getDistanceUnit() === "km" && dist < 1) {
      distString = (dist * 1000).toFixed(0) + "m"
    }
    else if (getDistanceUnit() === "mi" && dist < 0.1) {
      distString = metersToFeet(dist * 1000) + "ft"
    }
    else {
      distString = dist.toFixed(1) + getDistanceUnit()
    }

    distString += " away"
  }


  const WalkCardContent = <>
    <div className="walk-card-wide_image">
      <Image name={walk?.slug + "_" + walk?.gallery?.coverId} sizes="(min-width: 200px) 200px, 40vw" />
      {distFrom &&
        <p className="walk-card-wide_dist">
          {distString}
        </p>
      }
    </div>

    <div className="walk-card-wide_main flex-row wrap-none gap-0">
      <div className="walk-card-wide_title-intro flex-1">
        <h3 className="walk-card-wide_title subheading">{walk.title}</h3>

        <p className="walk-card-wide_intro">{walk.intro ?? "..."}</p>
      </div>

      <div className="walk-card-wide_stats flex-column gap-0">
        <div title={"Route length: " + displayDistance(walk.length, 1)}>
          {displayDistance(walk.length, 1)} <HikingIcon />
        </div>
        <div title={"Elevation gain: " + displayElevation(walk.elevation)}>
          {displayElevation(walk.elevation)} <ElevationIcon />
        </div>
        <div title={walk.wainwrights?.length + " Wainwrights"}>
          {walk.wainwrights?.length} <MountainIcon />
        </div>
      </div>
    </div>
  </>


  if (link) return (
    <Link to={"/walks/"+walk.slug}
      className="walk-card-wide"
      title={walk?.title}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover()}
    >
      {WalkCardContent}
    </Link>
  )
  else return (
    <div
      className="walk-card-wide"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover()}
    >
      {WalkCardContent}
    </div>
  )
}
