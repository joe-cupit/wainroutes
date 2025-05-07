import { Walk } from "../WalkPage";


export function StartingLocation({ selected, startLocation, busRoutes } : { selected: boolean; startLocation: Walk["startLocation"]; busRoutes: Walk["busConnections"] }) {

  return (
    <div className={"walk-page_aside-section" + (selected ? " selected" : "")}>
      <h2 className="subheading">Starting Location</h2>
      <div className="walk-page_locations flex-column">

        <div className="flex-row flex-apart">
          <h3>Location</h3>
          <span className="bold">{startLocation?.location ?? "N/A"}</span>
        </div>

        <div className="flex-row flex-apart">
          <h3>Postcode</h3>
          <span className="bold">
            {startLocation?.postCode
            ? <a href={"https://www.google.com/maps/dir/?api=1&destination="+startLocation?.latitude+","+startLocation?.longitude}
                 target="_blank"
                 aria-label={startLocation?.postCode + " on Google Maps"}
              >
                {startLocation?.postCode}
              </a>
            : "N/A"
            }
          </span>
        </div>

        <div className="flex-row flex-apart">
          <h3>Grid Ref</h3>
          <span className="bold">{startLocation?.gridRef ?? "N/A"}</span>
        </div>

        {/* <div className="flex-row flex-apart">
          <h3>What3Words</h3>
          <span className="bold">
            {startLocation?.whatThreeWords
            ? <a href={"https://what3words.com/"+startLocation?.whatThreeWords} target="_blank">{"///"+startLocation?.whatThreeWords}</a>
            : "Unavailable"
            }
          </span>
        </div> */}

        <div className="flex-row flex-apart">
          <h3>Busses</h3>
          <ul className="walk-page_busses flex-row">
            {(busRoutes && Object.keys(busRoutes).length > 0)
            ? Object.keys(busRoutes).map((bus, index) => {
                return (
                  <li key={index}
                    className="walk-page_bus-number"
                    style={{"backgroundColor": `var(--clr-bus-${bus})`}}
                  >
                    {bus}
                  </li>
                )
              })
            : "None"
            }
          </ul>
        </div>

      </div>
    </div>
  )
}