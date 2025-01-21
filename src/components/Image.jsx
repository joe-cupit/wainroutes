import { useMemo } from "react"

export default function Image({ name, className, sizes="100vw", alt="", blurLoad=true }) {

  const path = "/images/wainroutes_" + name
  const ext = ".webp"
  const src = path + "-1024" + ext

  const imgWidths = ["64", "256", "512", "1024", "2048"]
  const srcset = useMemo(() => {
    return imgWidths.map(w => path + "-" + w + ext + " " + w + "w").join(", ")
  }, [path, name, ext])

  const ImageTag = (
    <img
      src={src}
      srcSet={srcset}
      sizes={sizes}
      loading="lazy"
      alt={alt}
      onLoad={blurLoad ? (e => e.target.parentElement.classList.add("loaded")) : null}
    />
  )


  if (blurLoad) {
    const srcSmall = "url(" + path + "-64" + ext + ")"

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
