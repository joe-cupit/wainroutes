import { useMemo } from "react";


export default function Image({ name, className, sizes="100vw", alt="", maxWidth=null, blurLoad=true } : { name: string; className?: string; sizes?: string; alt?: string; maxWidth?: number | null; blurLoad?: boolean }) {

  const path = "https://images.wainroutes.co.uk/wainroutes_" + name; 
  const ext = ".webp";
  const src = path + "_1024w" + ext;

  const imgWidths = ["256", "512", "1024", "2048"];
  const srcset = useMemo(() => {
    return (
      imgWidths
        .filter(w => (maxWidth === null || Number(w) <= maxWidth))
        .map(w => `${path}_${w}w${ext} ${w}w`).join(", ")
    )
  }, [path, name, ext])

  const ImageTag = (
    <img
      src={src}
      srcSet={srcset}
      sizes={sizes}
      loading="lazy"
      alt={alt}
      onLoad={blurLoad ? (e => (e.target as HTMLImageElement).parentElement?.classList.add("loaded")) : () => {}}
    />
  )


  if (blurLoad) {
    const srcSmall = `url(${path}_32w${ext})`;

    return (
      <div
        className={(className ? className+" " : "") + "image_blur-load"}
        style={{backgroundImage: srcSmall}}
      >
        {ImageTag}
      </div>
    )
  }
  else return ImageTag
}
