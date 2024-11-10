import "./FlatMap.css"

import React, { useEffect } from 'react'

import Water from "../assets/images/flat-map/water.svg"
import Layer0 from "../assets/images/flat-map/layer-0.svg"
import Layer1 from "../assets/images/flat-map/layer-1.svg"
import Layer2 from "../assets/images/flat-map/layer-2.svg"
import Layer3 from "../assets/images/flat-map/layer-3.svg"
import Layer4 from "../assets/images/flat-map/layer-4.svg"


export default function FlatMap() {

  const MapWidth = 518
  const MapHeight = 614
  const HalfWidth = MapWidth/2
  const HalfHeight = MapWidth/2

  useEffect(() => {
    function mouseListener(e) {

      flatMap.querySelectorAll("img").forEach((image, index) => {

        if (index === 0) return

        const originX = HalfWidth - (e.offsetX - HalfWidth)
        const originY = HalfHeight - (e.offsetY - HalfHeight)
        const origin = `${originX}px ${originY}px`

        image.animate({ 
          transformOrigin: origin
        }, { duration: 750, fill: "forwards", easing: "ease" });
      })
    }

    const flatMap = document.getElementById("flat-map")
    flatMap.addEventListener("mousemove", mouseListener)

    return () => {
      flatMap.removeEventListener("mousemove", mouseListener)
    }
  })


  return (
    <div id="flat-map" className="flat-map" style={{width: MapWidth, height: MapHeight}}>
      <img id="layer-water" src={Water} alt="" />
      <img id="layer-0" src={Layer0} alt="" />
      <img id="layer-1" src={Layer1} alt="" />
      <img id="layer-2" src={Layer2} alt="" />
      <img id="layer-3" src={Layer3} alt="" />
      <img id="layer-4" src={Layer4} alt="" />
    </div>
  )
}
