"use client";

import styles from "../LazyImage.module.css";
import { Fragment, JSX, useEffect, useRef, useState } from "react";


type LazyPictureClientProps = {
  fallbackSrc: string;
  fallbackSrcSet: string;
  sizes: string;
  alt: string;
  className?: string;
  blurURL: string;
  SourceElements: JSX.Element[];
  eager?: boolean;
}


export default function LazyPictureClient({ fallbackSrc, fallbackSrcSet, sizes, alt, blurURL, SourceElements, className, eager=false } : LazyPictureClientProps) {

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
      <picture>
        {SourceElements.map((Source, index) => {
          return <Fragment key={index}>{Source}</Fragment>
        })}
        <img
          ref={imgRef}
          src={fallbackSrc}
          srcSet={fallbackSrcSet}
          sizes={sizes}
          alt={alt}

          loading={eager ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          style={{
            opacity: loaded ? 1 : 0
          }}
        />
      </picture>
    </div>
  )
}