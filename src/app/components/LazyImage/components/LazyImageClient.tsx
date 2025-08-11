"use client";

import styles from "../LazyImage.module.css";
import { useEffect, useRef, useState } from "react";


type LazyImageClientProps = {
  src: string;
  srcSet: string;
  sizes: string;
  alt: string;
  className?: string;
  blurURL: string;

  eager?: boolean;
}


export default function LazyImageClient({ src, srcSet, sizes, alt, blurURL, className, eager=false } : LazyImageClientProps) {

  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, [])


  return (
    <div
      className={`${styles.blurLoad} ${className ? className : ""}`}
      style={{
        backgroundImage: blurURL,
        filter: loaded ? "none" : "blur(1em)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}

        loading={eager ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        style={{
          opacity: loaded ? 1 : 0
        }}
      />
    </div>
  )
}