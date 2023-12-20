import { useRef, useState } from "react";
import { populateDoubleLines } from "../../assets/stepsData";
import { getMovements } from "../../helpers";
import { Svg } from "../../styled-components/Svg";
import { LINE, Line } from "../svgs/Line";

export function AnnotateDoubleLines(props) {
  const drawboard = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const linesRef = useRef({
    line1: props.coords.slice(0, 4),
    line2: props.coords.slice(4, 8),
  });

  const changeZoom = (event) => {
    const zoomResult = props.calcZoom(event);
    setScaleFactor(zoomResult);
  }

  const confirmToParent = () => {
    props.confirmCallback(linesRef.current.line1.concat(linesRef.current.line2));
  }

  return (
    <Svg
      onWheel={changeZoom}
      ref={drawboard}
      viewBox={`0 0 ${props.dimensions[0]} ${props.dimensions[1]}`}
    >
      <Line
        update={(anno) => {
          linesRef.current.line1 = anno;
          confirmToParent();
        }}
        c1={[props.coords[0], props.coords[1]]}
        c2={[props.coords[2], props.coords[3]]}
        scale={scaleFactor}
        canvasRef={drawboard}
      />
      <Line
        update={(anno) => {
          linesRef.current.line2 = anno;
          confirmToParent();
        }}
        c1={[props.coords[4], props.coords[5]]}
        c2={[props.coords[6], props.coords[7]]}
        scale={scaleFactor}
        canvasRef={drawboard}
      />
    </Svg>
  )
}