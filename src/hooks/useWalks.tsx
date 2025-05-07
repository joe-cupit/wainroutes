import walkDataJson from "../assets/walkData.json";
import { Walk } from "../pages/WalkPage/WalkPage";


export const useWalks = (slug?: string) => {
  const walkData: {[slug: string]: Walk} = walkDataJson;

  if (slug === undefined || slug === null) return walkData;
  else return walkData[slug];
}