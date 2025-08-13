import { Metadata } from "next";


export function createPageMetadata({
  title,
  description,
  path,
  imageURL,
}: {
  title?: string
  description?: string
  path?: string
  imageURL?: string
}) : Metadata {

  const ogtitle = title ?? "Wainroutes Lake District Walks";
  const canonical = (path)
    ? "https://wainroutes.co.uk" + (path !== "/" ? path : "")
    : undefined;

  if (!description) {
    description = "Walk the Wainwrights in the Lake District with detailed routes, mountain forecasts, and travel info.";
  }
  if (!imageURL) {
    imageURL = "https://images.wainroutes.co.uk/wainroutes_home_01_1024w.webp";
  }


  return {
    title: title,
    description: description,
    alternates: {
      canonical: canonical,
    },
    openGraph: {
      type: "website",
      title: ogtitle,
      description: description,
      url: canonical,
      images: imageURL,
    },
    twitter: {
      card: "summary_large_image",
      title: ogtitle,
      description: description,
      images: imageURL,
    },
  }
}
