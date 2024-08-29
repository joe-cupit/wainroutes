import walkData from "../assets/walkData.json";


export const useWalks = (slug) => {
  if (slug === null || slug === undefined) return walkData;
  else return walkData[slug];
}