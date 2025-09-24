export default function getMapBounds(latBounds: [number, number], lonBounds: [number, number], width: number = 300, height: number = 215) {
  const newcenter : [number, number] = [
    (latBounds[0] + latBounds[1]) / 2,
    (lonBounds[0] + lonBounds[1]) / 2
  ];

  const newzoom : number = Math.max(
    Math.min(
      Math.max(
        Math.log((latBounds[1] - latBounds[0])/((height - 75) * 0.75)) / Math.log(2),
        Math.log((lonBounds[1] - lonBounds[0])/(width)) / Math.log(2)
      ) * -1, 15.5
    ), 8
  );

  return ({
    center: newcenter,
    zoom: newzoom,
  })
}