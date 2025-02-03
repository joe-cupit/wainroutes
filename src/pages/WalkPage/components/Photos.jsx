import ImageGallery from "../../../components/ImageGallery";


export function Photos({ secRef, slug, galleryData }) {

  return (
    <div ref={secRef}>
      <h2 className="subheading" id="walk_photos">Photos</h2>

      <ImageGallery
        imageList={galleryData?.imageIds?.map(img => slug+"_"+img)}
        imageData={galleryData?.imageData}
        groups={galleryData?.sections}
      />
    </div>
  )
}