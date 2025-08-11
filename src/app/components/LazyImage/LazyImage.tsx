import LazyImageClient from "./components/LazyImageClient";
import generateSrcSet from "./utils/generateSrcSet";


const BASE_PATH = "https://images.wainroutes.co.uk/wainroutes_";
const ext = ".webp";


type LazyImageProps = {
  name: string;
  className?: string;
  sizes?: string;
  alt?: string;
  maxWidth?: number;
}

export default function LazyImage({ name, className, sizes="100vw", alt="", maxWidth } : LazyImageProps) {

  const path = BASE_PATH + name; 

  const src = path + "_1024w" + ext;
  const srcSet = generateSrcSet(path, ext, maxWidth);

  return (
    <LazyImageClient
      className={className}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      blurURL={`url(${path}_32w${ext})`}
    />
  )
}
