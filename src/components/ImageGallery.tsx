import "./ImageGallery.css";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { WalkGallery } from "../pages/WalkPage/WalkPage";
import Image from "./Image";
import { CloseIcon, LeftIcon, RightIcon } from "./Icons";


const GalleryContext = createContext<{images: string[]; imageData: WalkGallery["imageData"] | null; openCarousel: CallableFunction}>({images: [], imageData: null, openCarousel: () => {}})


export default function ImageGallery({ imageList, imageData, groups } : { imageList: string[]; imageData: WalkGallery["imageData"]; groups: WalkGallery["sections"] }) {

  const [carouselId, setCarouselId] = useState<number | null>(null);
  const [displayCorousel, setDisplayCarousel] = useState(false);
  useEffect(() => {
    if (!displayCorousel) setCarouselId(null);
  }, [displayCorousel])

  const openCarousel = useCallback((imageId: number) => {
    setCarouselId(imageId);
  }, [])

  const contextValue = {
    images: imageList,
    imageData: imageData,
    openCarousel: openCarousel
  }

  return(
    <>
      <GalleryContext.Provider value={contextValue}>
        <div className="image-gallery">
          {groups?.map((group, index) => {
            switch (group?.type) {
              case 0:
                return <GallerySingleImage key={index} ids={group?.indexes} />
              case 1:
                return <GalleryRowTwo key={index} ids={group?.indexes} />
              case 2:
                return <GalleryRowThree key={index} ids={group?.indexes} />
              case 3:
                return <GalleryRowWideLeft key={index} ids={group?.indexes} />
              case 4:
                return <GalleryRowWideRight key={index} ids={group?.indexes} />
              case 5:
                return <GalleryRowTallLeft key={index} ids={group?.indexes} />
              case 6:
                return <GalleryRowTallRight key={index} ids={group?.indexes} />
              default:
                return <></>
            }
          })}
        </div>

        <GalleryCarousel imageId={carouselId} display={displayCorousel} setDisplay={setDisplayCarousel} />
      </GalleryContext.Provider>
    </>
  )
}


function GalleryCarousel({ imageId, display, setDisplay } : { imageId: number | null, display: boolean, setDisplay: CallableFunction }) {

  const galleryContext = useContext(GalleryContext);

  const [currIndex, setCurrIndex] = useState(0);
  useEffect(() => {
    setCurrIndex(imageId ?? 0);
    if (imageId !== null) setDisplay(true);
  }, [imageId])

  const bgClicked = useCallback((e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;

    setDisplay(false);
  }, [])

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.isTrusted) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setCurrIndex(prev => {
          let curr = prev - 1;
          if (curr < 0) return curr + galleryContext?.images?.length;
          else return curr;
        });
      }
      else if (event.key === "ArrowRight") {
        event.preventDefault();
        setCurrIndex(prev => (prev+1) % (galleryContext?.images?.length ?? 1));
      }
      else if (event.key === "Escape") {
        event.preventDefault();
        setDisplay(false);
      }
    }

    window.addEventListener("keyup", handleKeyUp);
    return (() => {
      window.removeEventListener("keyup", handleKeyUp);
    })
  }, [])


  if (display) return (
    <div className="image-gallery_carousel" onClick={e => bgClicked(e)}>
      <button className="image-gallery_carousel-close" title="Close"
        onClick={() => setDisplay(false)}
      >
        <CloseIcon />
      </button>

      <div className="image-gallery_carousel-caption">
        {currIndex+1}/{galleryContext?.images?.length}
      </div>
      <CorouselImage index={currIndex} />
      <div className="image-gallery_carousel-caption">
        <h4 className="smallheading">{galleryContext?.imageData?.[currIndex]?.title ?? "Image "+(currIndex+1)}</h4>
        <p>{galleryContext?.imageData?.[currIndex]?.caption ?? "No caption."}</p>
      </div>

      <button className="image-gallery_carousel-left" title="Previous Image"
        onClick={() => setCurrIndex(prev => {
          let curr = prev - 1;
          if (curr < 0) return curr + galleryContext?.images?.length;
          else return curr;
        })}
      >
        <LeftIcon />
      </button>
      <button className="image-gallery_carousel-right" title="Next Image"
        onClick={() => setCurrIndex(prev => (prev+1) % (galleryContext?.images?.length ?? 1))}
      >
        <RightIcon />
      </button>

    </div>
  )
  else return <></>
}

function CorouselImage({ index } : { index: number }) {

  const galleryContext = useContext(GalleryContext);

  return (
    <div className="image-gallery_carousel-image">
      <Image name={galleryContext?.images?.[index]} />
    </div>
  )
}


function GalleryImage({ index, className, big=false } : { index: number, className?: string, big?: boolean }) {

  const galleryContext = useContext(GalleryContext);

  return (
    <div
      className={"image-gallery_image" + (big ? "" : " image-gallery_lock-ratio") + (className ? " "+className : "")}
      onClick={() => galleryContext?.openCarousel(index)}
    >
      <Image
        name={galleryContext?.images?.[index]}
        sizes={big ? "(min-width: 1000px) 1000px, (min-width: 840px) 50vw, 90vw" : "(min-width: 1000px) 500px, (min-width: 1000px) 25vw, 40vw"}
        maxWidth={big ? null : 1024}
      />
    </div>
  )
}


// 0
function GallerySingleImage({ ids } : { ids: number[] }) {
  return (
    <div className="image-gallery_row image-gallery_row-one">
      <GalleryImage index={ids[0]} big={true} />
    </div>
  )
}


// 1
function GalleryRowTwo({ ids } : { ids: number[] }) {
  return (
    <div className="image-gallery_row image-gallery_row-two">
      <GalleryImage index={ids[0]} />
      <GalleryImage index={ids[1]} />
    </div>
  )
}

// 2
function GalleryRowThree({ ids } : { ids: number[] }) {
  return (
    <div className="image-gallery_row image-gallery_row-three">
      <GalleryImage index={ids[0]} />
      <GalleryImage index={ids[1]} />
      <GalleryImage index={ids[2]} />
    </div>
  )
}


// 3
function GalleryRowWideLeft({ ids } : { ids: number[] }) {
  return (
    <div className="image-gallery_row image-gallery_row-wide-left">
      <GalleryImage className="image-gallery_span-2" index={ids?.[0]} big={true} />
      <div className="image-gallery_column">
        <GalleryImage index={ids[1]} />
        <GalleryImage index={ids[2]} />
      </div>
    </div>
  )
}

// 4
function GalleryRowWideRight({ ids } : { ids: number[] }) {
  return (
    <div className="image-gallery_row image-gallery_row-wide-right">
      <div className="image-gallery_column">
        <GalleryImage index={ids[0]} />
        <GalleryImage index={ids[1]} />
      </div>
      <GalleryImage className="image-gallery_span-2" index={ids[2]} big={true} />
    </div>
  )
}


// 5
function GalleryRowTallLeft({ ids } : { ids: number[] }) {
  return (
    <div className="image-gallery_row image-gallery_row-wide-left">
      <GalleryImage className="image-gallery_span-2" index={ids[0]} big={true} />
      <div className="image-gallery_column">
        <GalleryImage index={ids[1]} />
        <GalleryImage index={ids[2]} />
        <GalleryImage index={ids[3]} />
      </div>
    </div>
  )
}

// 6
function GalleryRowTallRight({ ids } : { ids: number[] }) {
  return (
    <div className="image-gallery_row image-gallery_row-wide-right">
      <div className="image-gallery_column">
        <GalleryImage index={ids[0]} />
        <GalleryImage index={ids[1]} />
        <GalleryImage index={ids[2]} />
      </div>
      <GalleryImage className="image-gallery_span-2" index={ids[3]} big={true} />
    </div>
  )
}
