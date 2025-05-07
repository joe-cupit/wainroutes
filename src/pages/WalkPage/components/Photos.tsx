import { WalkGallery } from "../WalkPage";
import ImageGallery from "../../../components/ImageGallery";


export function Photos({ secRef, slug, galleryData } : { secRef: React.RefObject<HTMLDivElement>; slug: string; galleryData: WalkGallery | undefined }) {
  if (!galleryData) return <></>;


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