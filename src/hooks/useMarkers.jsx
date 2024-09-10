import { useMemo } from "react"
import { useHills } from "./useHills";
import { useWalks } from "./useWalks";


export const useHillMarkers = (filters=null) => {
  const hillData = useHills(null);

  console.log(filters)

  const hillMarkers = useMemo(() => hillData 
    ? Object.values(hillData)
        .map(hill => ({
          coordinates: [hill.latitude, hill.longitude],
          properties: {
            type: "hill",
            slug: hill.slug,
            name: hill.name,
            book: hill.book
          }
        }))
        .filter(a => filters===null || filters.includes(a.properties.slug))
    : []
  , [hillData]);

  return hillMarkers
}


export const useWalkMarkers = (filters=null) => {
  const walkData = useWalks(null);

  const walkMarkers = useMemo(() => walkData 
    ? Object.values(walkData).map(walk => (
      walk.start_lat_lang
      ? {
          coordinates: walk.start_lat_lang,
          properties: {
            type: "walk",
            slug: walk.slug,
            name: walk.name
          }
        }
      : null))
    : []
  , [walkData]);

  return walkMarkers.filter(w => w);
}
