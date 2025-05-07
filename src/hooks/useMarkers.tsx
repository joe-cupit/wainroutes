import { useMemo } from "react"
import { useHills } from "./useHills";
import { useWalks } from "./useWalks";


export type MapMarker = {
  coordinates: [number, number];
  properties: {
    type: string;
    slug: string;
    name: string;
    book?: number;
  }
}


export const useHillMarkers = (filters?: string[]) => {
  const hillData = useHills();

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
        .filter(a => filters === undefined || filters.includes(a.properties.slug)) as MapMarker[]
    : []
  , [hillData, filters]);

  return hillMarkers;
}


export const useWalkMarkers = () => {
  const walkData = useWalks();

  const walkMarkers = useMemo(() => walkData 
    ? Object.values(walkData)
      .map(walk => (
        walk.startLocation
        ? {
            coordinates: [walk.startLocation.latitude, walk.startLocation.longitude],
            properties: {
              type: "walk",
              slug: walk.slug,
              name: walk.title
            }
          }
        : null))
      .filter(walk => walk) as MapMarker[]
    : []
  , [walkData]);

  return walkMarkers;
}
