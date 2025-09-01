export type WalkGallery = {
  imageIds: string[];
  imageData: {
    title: string;
    caption: string;
  }[]
  coverId: string;
  sections: {
    type: number;
    indexes: number[]
  }[]
}

type Walk = {
  slug: string;

  title: string;
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
  }
  busConnections?: {
    [number: string]: string;
  }
  terrain?: {
    gradient?: number;
    path?: number;
    exposure?: number;
    desc?: string;
  }

  intro?: string;
  waypoints?: {
    [name: string]: string;
  }
  gallery?: WalkGallery;

  weatherLoc?: string;
  tags: string[];

  distance?: number;
  // distanceFromLocation?: number;
}


export default Walk;
