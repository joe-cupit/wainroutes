import "./Gallery.css";


export default function Gallery({ imageList }) {
  return(
    <div className="image-gallery">
      {imageList.map((img, index) => {
        return (
          <div className="image-gallery_image">
            <img key={index} src={`/images/${img}.jpeg`} alt={"alt"} />
          </div>
        )
      })}
    </div>
  )
}