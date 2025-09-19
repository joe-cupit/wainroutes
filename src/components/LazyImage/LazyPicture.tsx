import LazyPictureClient from "./components/LazyPictureClient";
import generateSrcSet from "./utils/generateSrcSet";


const BASE_PATH = "https://images.wainroutes.co.uk/";


type LazyPictureProps = {
  names: string[]
  widths: number[]
  className?: string
  sizes?: string
  alt?: string
  maxWidth?: number
  eager?: boolean
  newBase?: boolean
}


export default function LazyPicture({ names, widths, className, sizes="100vw", alt="", maxWidth, eager=false, newBase=false } : LazyPictureProps) {

  let base_path: string;
  let extension: string;
  if (newBase) {
    const ext = names[0].split(".")[1];
    base_path = BASE_PATH;
    extension = `.${ext}`;
  }
  else {
    base_path = BASE_PATH + "wainroutes_";
    extension = ".webp";
  }

  const src = base_path + names[0].split(".")[0] + "_1024w" + extension;
  const blurURL = "url(" + base_path + names[0].split(".")[0] + "_32w" + extension + ")";

  const SourceElements = names.slice(1).map((name, index) => {
    return (
      <source
        key={index}
        media={"(max-width: " + widths[index] + "px)"}
        srcSet={generateSrcSet((base_path + name + (newBase ? "" : ".webp")), maxWidth)}
        sizes={sizes}
        type="image/webp"
      />
    )
  })


  return (
    <LazyPictureClient
      className={className}
      SourceElements={SourceElements}
      fallbackSrc={src}
      fallbackSrcSet={generateSrcSet((base_path + names[0] + (newBase ? "" : ".webp")), maxWidth)}
      sizes={sizes}
      alt={alt}
      blurURL={blurURL}
      eager={eager}
    />
  )
}
