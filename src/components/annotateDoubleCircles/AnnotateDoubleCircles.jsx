import { useEffect } from "react";
import { useRef, useState } from "react";
import { populateDoubleCircles } from "../../assets/stepsData";
import { getMovements } from "../../helpers";
import { Svg } from "../../styled-components/Svg";
import { Circle } from "../svgs/Circle";

export function AnnotateDoubleCircles(props) {
  const drawboard = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  const [selected, setSelected] = useState(null);

  // the three geometry
  const [c1, setC1] = useState(props.c1);
  const [c2, setC2] = useState(props.c2);

  // for overlaying handling
  const [c1Up, setC1Up] = useState(props.c1[2] < props.c2[2]);

  const circlesRef = useRef({
    c1: props.c1,
    c2: props.c2,
  })

  const changeZoom = (event) => {
    const zoomResult = props.calcZoom(event);
    setScaleFactor(zoomResult);
  }

  const rearrange = (r1, r2) => {
    setC1Up(r1 < r2);
  }

  const selectCircle = (which) => {
    if (which === selected) {
      setSelected(null);
    } else {
      setSelected(which);
    }
  }

  const update = (c1, c2) => {
    circlesRef.current.c1 = c1;
    circlesRef.current.c2 = c2;
    props.confirmCallback(c1.concat(c2));
  }

  return (
    <Svg
      onWheel={changeZoom}
      ref={drawboard}
      viewBox={`0 0 ${props.dimensions[0]} ${props.dimensions[1]}`}
      onClick={() => setSelected(null)}
    >
      <circle
        className="middle-dot"
        cx={(c1[0] + c2[0]) / 2}
        cy={(c1[1] + c2[1]) / 2}
        r={3}
      />
      {!c1Up && <Circle
        selected={selected === "c1"}
        circle={[c1[0], c1[1]]}
        radius={c1[2]}
        scale={scaleFactor}
        canvasRef={drawboard}
        drag={setC1}
        update={(circle) => {
          rearrange(circle[2], c2[2]);
          update(circle, circlesRef.current.c2);
        }}
        onClick={() => selectCircle("c1")}
      />}
      <Circle
        selected={selected === "c2"}
        circle={[c2[0], c2[1]]}
        radius={c2[2]}
        scale={scaleFactor}
        canvasRef={drawboard}
        drag={setC2}
        update={(circle) => {
          rearrange(c1[2], circle[2]);
          update(circlesRef.current.c1, circle);
        }}
        onClick={() => selectCircle("c2")}
      />
      {c1Up && <Circle
        selected={selected === "c1"}
        circle={[c1[0], c1[1]]}
        radius={c1[2]}
        scale={scaleFactor}
        canvasRef={drawboard}
        drag={setC1}
        update={(circle) => {
          rearrange(circle[2], c2[2]);
          update(circle, circlesRef.current.c2);
        }}
        onClick={() => selectCircle("c1")}
      />}
    </Svg>
  )
}