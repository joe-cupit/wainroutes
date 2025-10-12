type TerrainLevel = 1 | 2 | 3 | 4;
export type ImageSize = 0 | 1 | 2 | 3 | 4;

type Walk = {
  slug: string;

  title: string;
  recommendedScore?: number;
  type?: string;
  summary?: string;
  wainwrights: string[];
  length: number;
  elevation: number;
  estimatedTime?: string;
  date?: string;

  startLocation?: {
    location: string;
    latitude?: number;
    longitude?: number;
    postcode?: string;
    gridRef?: string;
  };
  busConnections?: {
    [number: string]: string;
  };
  terrain?: {
    gradient?: TerrainLevel;
    path?: TerrainLevel;
    exposure?: TerrainLevel;
    desc?: string;
  };

  intro?: string;
  waypoints?: {
    [name: string]: string;
  };

  images?: {
    slug: string;
    title: string;
    caption: string;
    size: ImageSize;
  }[];
  coverImage?: string;

  weatherLoc?: string;
  tags: string[];

  distance?: number;
  // distanceFromLocation?: number;
};

export default Walk;
