"use client";

import styles from "./ImageGallery.module.css";
import fontStyles from "@/styles/fonts.module.css";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import Walk, { Image, ImageSize } from "@/types/Walk";
import LazyImage from "@/components/LazyImage/LazyImage";
import { CloseIcon, LeftIcon, RightIcon } from "@/icons/MaterialIcons";

const GalleryContext = createContext<{
  slug: string;
  images: Image[];
  openCarousel: CallableFunction;
}>({ slug: "", images: [], openCarousel: () => {} });

export default function ImageGallery({
  slug,
  images,
}: {
  slug: string;
  images: Walk["images"];
}) {
  if (images === undefined) return <></>;

  const [carouselId, setCarouselId] = useState<number | null>(null);
  const [displayCorousel, setDisplayCarousel] = useState(false);
  useEffect(() => {
    if (!displayCorousel) setCarouselId(null);
  }, [displayCorousel]);

  const openCarousel = useCallback((imageId: number) => {
    setCarouselId(imageId);
  }, []);

  const contextValue = {
    slug: slug,
    images: images,
    openCarousel: openCarousel,
  };

  return (
    <>
      <GalleryContext.Provider value={contextValue}>
        <div className={styles.imageGallery}>
          {images.map((image, index) => {
            return <GalleryImage size={image.size} index={index} />;
          })}
        </div>

        <GalleryCarousel
          imageId={carouselId}
          display={displayCorousel}
          setDisplay={setDisplayCarousel}
        />
      </GalleryContext.Provider>
    </>
  );
}

function GalleryCarousel({
  imageId,
  display,
  setDisplay,
}: {
  imageId: number | null;
  display: boolean;
  setDisplay: CallableFunction;
}) {
  const galleryContext = useContext(GalleryContext);

  const [currIndex, setCurrIndex] = useState(0);
  useEffect(() => {
    setCurrIndex(imageId ?? 0);
    if (imageId !== null) setDisplay(true);
  }, [imageId, setDisplay]);

  const bgClicked = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== e.currentTarget) return;

      setDisplay(false);
    },
    [setDisplay]
  );

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.isTrusted) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setCurrIndex((prev) => {
          const curr = prev - 1;
          if (curr < 0) return curr + galleryContext?.images?.length;
          else return curr;
        });
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setCurrIndex(
          (prev) => (prev + 1) % (galleryContext?.images?.length ?? 1)
        );
      } else if (event.key === "Escape") {
        event.preventDefault();
        setDisplay(false);
      }
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [galleryContext?.images?.length, setDisplay]);

  if (display)
    return (
      <div className={styles.galleryCarousel} onClick={(e) => bgClicked(e)}>
        <button
          className={styles.galleryCarouselClose}
          title="Close"
          onClick={() => setDisplay(false)}
        >
          <CloseIcon />
        </button>

        <div className={styles.galleryCarouselTop}>
          <button
            className={styles.galleryCarouselLeft}
            title="Previous Image"
            onClick={() =>
              setCurrIndex((prev) => {
                const curr = prev - 1;
                if (curr < 0) return curr + galleryContext?.images?.length;
                else return curr;
              })
            }
          >
            <LeftIcon />
          </button>

          <span>
            {currIndex + 1}/{galleryContext?.images?.length}
          </span>

          <button
            className={styles.galleryCarouselRight}
            title="Next Image"
            onClick={() =>
              setCurrIndex(
                (prev) => (prev + 1) % (galleryContext?.images?.length ?? 1)
              )
            }
          >
            <RightIcon />
          </button>
        </div>
        <CorouselImage index={currIndex} />
        <div className={styles.galleryCarouselCaption}>
          <h4 className={fontStyles.smallheading}>
            {galleryContext.images[currIndex]?.title ||
              "Image " + (currIndex + 1)}
          </h4>
          {/* <p>{galleryContext.images[currIndex]?.caption || "No caption"}</p> */}
        </div>
      </div>
    );
  else return <></>;
}

function CorouselImage({ index }: { index: number }) {
  const galleryContext = useContext(GalleryContext);

  return (
    <div className={styles.galleryCarouselImage}>
      <LazyImage
        name={`${galleryContext.slug}_${galleryContext.images[index].slug}`}
      />
    </div>
  );
}

function GalleryImage({
  index,
  className,
  size,
}: {
  index: number;
  size: ImageSize;
  className?: string;
}) {
  const galleryContext = useContext(GalleryContext);

  const sizeMap = {
    0: {
      name: "small",
      sizes: "(min-width: 1350px) 210px, (min-width: 881px) 20vw, 40vw",
    },
    1: {
      name: "wide",
      sizes: "(min-width: 1350px) 650px, (min-width: 881px) 50vw, 70vw",
    },
    2: {
      name: "tall",
      sizes: "(min-width: 1350px) 550px, (min-width: 881px) 40vw, 40vw",
    },
    3: {
      name: "big",
      sizes: "(min-width: 1350px) 650px, (min-width: 881px) 80vw, 100vw",
    },
    4: {
      name: "solo",
      sizes: "(min-width: 1350px) 850px, (min-width: 881px) 80vw, 100vw",
    },
  };

  return (
    <LazyImage
      className={`${styles.galleryImage} ${
        styles[`image-${sizeMap[size].name}`]
      } ${className ? className : ""}`}
      name={`${galleryContext.slug}_${galleryContext.images[index].slug}`}
      sizes={sizeMap[size].sizes}
      maxWidth={size === 0 ? 1024 : undefined}
      onClick={() => galleryContext.openCarousel(index)}
    />
  );
}
