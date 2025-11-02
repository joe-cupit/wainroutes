import Hill from "@/types/Hill";
import MapMarker from "@/types/MapMarker";

import temphills from "@/data/hills.json";

export const getHillMarkers = (filters?: string[]) => {
  const hillData = temphills as Hill[];

  const hillMarkers = hillData
    .map((hill) => ({
      coordinates: [hill.latitude, hill.longitude],
      properties: {
        type: "hill",
        slug: hill.slug,
        name: hill.name,
        book: hill.book,
      },
    }))
    .filter(
      (a) => filters === undefined || filters.includes(a.properties.slug)
    ) as MapMarker[];

  return hillMarkers;
};
