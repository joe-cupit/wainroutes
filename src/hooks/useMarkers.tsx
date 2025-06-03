import { useMemo } from "react"
import { useWalks } from "../contexts/WalksContext";
import { useHills } from "../contexts/HillsContext";


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
  const hillData = useHills().hills;

  const hillMarkers = useMemo(() => hillData 
    ? hillData
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
  const walksData = useWalks().walks;

  return walksData 
    ? walksData
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
    : [];
}
