import { Walk } from "../WalkPage";

export function Waypoints({ secRef, waypoints } : { secRef: React.RefObject<HTMLDivElement>; waypoints: Walk["waypoints"] }) {

  return (
    <div ref={secRef}>
      <h2 className="subheading" id="walk_waypoints">Waypoints</h2>
      <div className="walks-page_section flex-column">
        {waypoints
        ? Object.keys(waypoints).map((waypoint, index) => {
            return (
              <div key={index}>
                <h3 className="smallheading">{waypoint}</h3>
                <p>{waypoints?.[waypoint]}</p>
              </div>
            )
          })
        : "N/A"
        }
      </div>
    </div>
  )
}