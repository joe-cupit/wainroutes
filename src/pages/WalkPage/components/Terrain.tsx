import { TerrainExposureIcon, TerrainGradientIcon, TerrainPathIcon } from "../../../components/Icons";
import { Walk } from "../WalkPage";


export function Terrain({ selected, walkTerrain } : { selected: boolean; walkTerrain: Walk["terrain"] }) {

  return (
    <div className={"walk-page_terrain walk-page_aside-section" + (selected ? " selected" : "")}>
      <h2 className="subheading">Terrain</h2>
      {walkTerrain
      ? <div className="flex-column">
          <ul className="walk-page_terrain-badges flex-row">
            <li>{walkTerrain?.gradient && <TerrainGradientIcon level={walkTerrain?.gradient} />}</li>
            <li>{walkTerrain?.path && <TerrainPathIcon level={walkTerrain?.path} />}</li>
            <li>{walkTerrain?.exposure && <TerrainExposureIcon level={walkTerrain?.exposure} />}</li>
          </ul>
          <p>{(walkTerrain?.desc?.length ?? 0) > 0 ? walkTerrain?.desc : "No details"}</p>

          <p className="subtext">*terrain badges are merely a suggestion, always properly prepare for changing weather conditions</p>
        </div>
      : <p>No information available</p>}
    </div>
  )
}