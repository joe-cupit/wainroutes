export const BookTitles: { [book: number]: string } = {
  1: "The Eastern Fells",
  2: "The Far Eastern Fells",
  3: "The Central Fells",
  4: "The Southern Fells",
  5: "The Northern Fells",
  6: "The North Western Fells",
  7: "The Western Fells",
};

export const Classifications: { [code: string]: string } = {
  "Ma": "Marilyn",
  "Hew": "Hewitt",
  "B": "Birkett",
  "N": "Nuttall",
  "Sim": "Simm",
  "5": "Dodd",
  "F": "Furth",
};

type Hill = {
  slug: string;
  name: string;
  secondaryName?: string;

  height: number;
  prominence: number;

  gridRef: string;
  latitude: number;
  longitude: number;

  classifications: (keyof typeof Classifications)[];
  book: 1 | 2 | 3 | 4 | 5 | 6 | 7;

  nearbyHills?: { slug: string; name: string }[];
};

export default Hill;
