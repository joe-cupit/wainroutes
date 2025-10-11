import LazyImageClient from "./components/LazyImageClient";
import generateSrcSet from "./utils/generateSrcSet";

const BASE_PATH = "https://images.wainroutes.co.uk/";

type LazyImageProps = {
  name: string;
  className?: string;
  sizes?: string;
  alt?: string;
  maxWidth?: number;
  newBase?: boolean;
};

export default function LazyImage({
  name,
  className,
  sizes = "100vw",
  alt = "",
  maxWidth,
  newBase = false,
}: LazyImageProps) {
  let path: string;
  let extension: string;
  if (newBase) {
    const [src, ext] = name.split(".");
    path = BASE_PATH + src;
    extension = `.${ext}`;
  } else {
    path = BASE_PATH + "wainroutes_" + name;
    extension = ".webp";
  }

  const src = path + "_1024w" + extension;
  const srcSet = generateSrcSet(path + extension, maxWidth);

  return (
    <LazyImageClient
      className={className}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      blurURL={`url(${path}_32w${extension})`}
    />
  );
}
