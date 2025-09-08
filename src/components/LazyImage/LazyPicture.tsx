import LazyPictureClient from "./components/LazyPictureClient";
import generateSrcSet from "./utils/generateSrcSet";


const BASE_PATH = "https://images.wainroutes.co.uk/wainroutes_";
const ext = ".webp";


export default function LazyPicture({ names, widths, className, sizes="100vw", alt="", maxWidth, eager=false } : { names: string[]; widths: number[]; className?: string; sizes?: string; alt?: string; maxWidth?: number; eager?: boolean }) {

  const src = BASE_PATH + names[0] + "_1024w" + ext;
  const blurURL = "url(" + BASE_PATH + names[0] + "_32w" + ext + ")";

  const SourceElements = names.slice(1).map((name, index) => {
    return (
      <source
        key={index}
        media={"(max-width: " + widths[index] + "px)"}
        srcSet={generateSrcSet((BASE_PATH + name), ext, maxWidth)}
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
      fallbackSrcSet={generateSrcSet(BASE_PATH + names[0], ext, maxWidth)}
      sizes={sizes}
      alt={alt}
      blurURL={blurURL}
      eager={eager}
    />
  )
}
