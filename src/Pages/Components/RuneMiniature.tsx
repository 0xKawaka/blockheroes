import "./RuneMiniature.css"

type RuneMiniatureProps = {
  image: string,
  rank: number,
  imageWidth: string,
}

function computeLeftBottomGap(imageWidth: string) {
  if(imageWidth.slice(-2) !== "px") throw new Error("imageWidth must be in px")
  const imageWidthNumber = parseInt(imageWidth.slice(0, -2))
  const bottomGap = imageWidthNumber * 0.01
  const leftGap = imageWidthNumber * 0.6
  return [leftGap, bottomGap]
}

function computeFontSize(imageWidth: string) {
  if(imageWidth.slice(-2) !== "px") throw new Error("imageWidth must be in px")
  const imageWidthNumber = parseInt(imageWidth.slice(0, -2))
  const fontSize = Math.log(imageWidthNumber) * 3.8
  return fontSize
}

export default function RuneMiniature({image, rank, imageWidth}: RuneMiniatureProps) {

  const [leftGap, bottomGap] = computeLeftBottomGap(imageWidth)
  const fontSize = computeFontSize(imageWidth)
  return(
    <div className="RuneMiniatureContainer">
      <img className="RuneMiniatureImage" src={image} width={imageWidth}/>
      {rank >= 0 &&
        <div className="RuneMiniatureRank" style={{left: leftGap + "px", bottom: bottomGap + "px", fontSize: fontSize + "px"}}>+{rank}</div>
      }
    </div>
  )
}