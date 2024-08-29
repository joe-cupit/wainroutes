import hillData from "../assets/hillData.json";


export const useHills = (slug) => {
  if (slug === null || slug === undefined) return hillData;
  else return hillData[slug];
}