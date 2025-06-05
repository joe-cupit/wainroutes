import { useMemo } from "react";

const BASE_PATH = "https://images.wainroutes.co.uk/wainroutes_";


function generateSrcSet(path: string, ext: string, maxWidth?: number) {
  const imgWidths = ["256", "512", "1024", "2048"];
  const srcset = useMemo(() => {
    return (
      imgWidths
        .filter(w => (maxWidth === undefined || Number(w) <= maxWidth))
        .map(w => `${path}_${w}w${ext} ${w}w`).join(", ")
    )
  }, [path, ext])

  return srcset;
}


export default function Image({ name, className, sizes="100vw", alt="", maxWidth, blurLoad=true } : { name: string; className?: string; sizes?: string; alt?: string; maxWidth?: number; blurLoad?: boolean }) {

  const path = BASE_PATH + name; 
  const ext = ".webp";
  const src = path + "_1024w" + ext;

  const srcset = generateSrcSet(path, ext, maxWidth);

  const ImageTag = (
    <img
      className={!blurLoad ? className : ""}
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


export function Picture({ names, widths, className, sizes="100vw", alt="", maxWidth, blurLoad=true } : { names: string[]; widths: number[]; className?: string; sizes?: string; alt?: string; maxWidth?: number; blurLoad?: boolean }) {
  
  const ext = ".webp";

  const PictureTag = (
    <picture className={!blurLoad ? className : ""}>
      {names.slice(1).map((name, index) => {
        return (
          <source
            key={index}
            media={"(max-width: " + widths[index] + "px)"}
            srcSet={generateSrcSet(BASE_PATH + name, ext, maxWidth)}
            sizes={sizes}
            type="image/webp"
          />
        )
      })}
      <img
        className={!blurLoad ? className : ""}
        src={BASE_PATH + names[0] + "_1024" + ext}
        srcSet={generateSrcSet(BASE_PATH + names[0], ext, maxWidth)}
        sizes={sizes}
        loading="lazy"
        alt={alt}
        onLoad={blurLoad ? (e => (e.target as HTMLImageElement).parentElement?.parentElement?.classList.add("loaded")) : () => {}}
      />
    </picture>
  )
  
  
  if (blurLoad) {
    let blur_name = names[0]
    const windowWidth = window.innerWidth;
    for (let i=0; i<widths.length; i++) {
      if (windowWidth < widths[i]) {
        blur_name = names[i + 1];
      }
    }

    const blurStyle = {
      backgroundImage: "url(" + BASE_PATH + blur_name + "_32w" + ext + ")",
    }

    return (
      <div
        className={(className ? className+" " : "") + "image_blur-load"}
        style={blurStyle}
      >
        {PictureTag}
      </div>
    )
  }
  else return PictureTag
}
