import "./ImageGallery.css";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CloseIcon, LeftIcon, RightIcon } from "./Icons";
import Image from "./Image";

const GalleryContext = createContext({images: null, openCarousel: () => {}})


export default function ImageGallery({ imageList }) {

  const [carouselId, setCarouselId] = useState(null)
  const [displayCorousel, setDisplayCarousel] = useState(false)
  useEffect(() => {
    if (!displayCorousel) setCarouselId(null)
  }, [displayCorousel])

  const openCarousel = useCallback((imageId) => {
    setCarouselId(imageId)
  }, [])

  const contextValue = {
    images: imageList,
    openCarousel: openCarousel
  }

  return(
    <>
      <GalleryContext.Provider value={contextValue}>
        <div className="image-gallery">
          <GalleryRowWideLeft ids={[0, 1, 4]} />
          <GalleryRowTwo ids={[0, 1]} />
          <GalleryRowTallRight ids={[2, 1, 3, 4]} />
          <GalleryRowThree ids={[0, 1, 5]} />
          <GalleryRowTallLeft ids={[2, 1, 0, 3]} />
          <GalleryRowWideRight ids={[6, 5, 4]} />
        </div>

        <GalleryCarousel imageId={carouselId} display={displayCorousel} setDisplay={setDisplayCarousel} />
      </GalleryContext.Provider>
    </>
  )
}


function GalleryCarousel({ imageId, display, setDisplay }) {

  const galleryContext = useContext(GalleryContext)

  const [currIndex, setCurrIndex] = useState(0)
  useEffect(() => {
    setCurrIndex(imageId)
    if (imageId !== null) setDisplay(true)
  }, [imageId])

  const bgClicked = useCallback((e) => {
    if (e.target !== e.currentTarget) return

    setDisplay(false)
  }, [])


  if (display) return (
    <div className="image-gallery_carousel" onClick={bgClicked}>
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
        <h4 className="smallheading">Caption Title</h4>
        <p>This will be the caption for the image, that could be a little long.</p>
      </div>

      <button className="image-gallery_carousel-left" title="Previous Image"
        onClick={() => setCurrIndex(prev => {
          let curr = prev - 1
          if (curr < 0) return curr + galleryContext?.images?.length
          else return curr
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

function CorouselImage({ index }) {

  const galleryContext = useContext(GalleryContext)

  return (
    <div className="image-gallery_carousel-image">
      <Image name={galleryContext?.images?.[index]} />
    </div>
  )
}


function GalleryImage({ index }) {

  const galleryContext = useContext(GalleryContext)

  return (
    <div className="image-gallery_image" onClick={() => galleryContext?.openCarousel(index)}>
      <Image name={galleryContext?.images?.[index]} />
    </div>
  )
}


function GalleryRowTwo({ ids }) {
  return (
    <div className="image-gallery_row image-gallery_row-two">
      <GalleryImage index={ids?.[0]} />
      <GalleryImage index={ids?.[1]} />
    </div>
  )
}

function GalleryRowThree({ ids }) {
  return (
    <div className="image-gallery_row image-gallery_row-three">
      <GalleryImage index={ids?.[0]} />
      <GalleryImage index={ids?.[1]} />
      <GalleryImage index={ids?.[2]} />
    </div>
  )
}


function GalleryRowWideLeft({ ids }) {
  return (
    <div className="image-gallery_row image-gallery_row-wide-left">
      <div className="image-gallery_span-2">
        <GalleryImage index={ids?.[0]} />
      </div>
      <div className="image-gallery_column">
        <GalleryImage index={ids?.[1]} />
        <GalleryImage index={ids?.[2]} />
      </div>
    </div>
  )
}

function GalleryRowWideRight({ ids }) {
  return (
    <div className="image-gallery_row image-gallery_row-wide-right">
      <div className="image-gallery_column">
        <GalleryImage index={ids?.[1]} />
        <GalleryImage index={ids?.[2]} />
      </div>
      <div className="image-gallery_span-2">
        <GalleryImage index={ids?.[0]} />
      </div>
    </div>
  )
}


function GalleryRowTallLeft({ ids }) {
  return (
    <div className="image-gallery_row image-gallery_row-wide-left">
      <div className="image-gallery_span-2">
        <GalleryImage index={ids?.[0]} />
      </div>
      <div className="image-gallery_column">
        <GalleryImage index={ids?.[1]} />
        <GalleryImage index={ids?.[2]} />
        <GalleryImage index={ids?.[3]} />
      </div>
    </div>
  )
}

function GalleryRowTallRight({ ids }) {
  return (
    <div className="image-gallery_row image-gallery_row-wide-right">
      <div className="image-gallery_column">
        <GalleryImage index={ids?.[1]} />
        <GalleryImage index={ids?.[2]} />
        <GalleryImage index={ids?.[3]} />
      </div>
      <div className="image-gallery_span-2">
        <GalleryImage index={ids?.[0]} />
      </div>
    </div>
  )
}
