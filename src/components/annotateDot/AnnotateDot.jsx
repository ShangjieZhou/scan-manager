import { useRef, useState } from "react";
import { Svg } from "../../styled-components/Svg";
import { Dot } from "../svgs/Dot";

export function AnnotateDot(props) {
  const drawboard = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  const changeZoom = (event) => {
    const zoomResult = props.calcZoom(event);
    setScaleFactor(zoomResult);
  }

  return (
    <Svg
      onWheel={changeZoom}
      ref={drawboard}
      viewBox={`0 0 ${props.dimensions[0]} ${props.dimensions[1]}`}
    >
      <Dot
        update={props.confirmCallback}
        x={props.dot[0]}
        y={props.dot[1]}
        scale={scaleFactor}
        canvasRef={drawboard}
      />
    </Svg>
  )
}