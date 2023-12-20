import { useRef, useState } from "react";
import { getMovements } from "../../helpers";

const TARGET = {
  C1: 0,
  C2: 1,
}

const defaultRadius = 3;
const defaultOuterRadius = 12;
const defaultStrokeWidth = 2;
const defaultLineWidth = 3;

export function Line(props) {
  const [c1, setC1] = useState(props.c1);
  const [c2, setC2] = useState(props.c2);
  const c1Ref = useRef(c1);
  const c2Ref = useRef(c2);

  const pickupCircle = (e, target) => {
    // prevent triggering upper level events such as panning
    e.stopPropagation();

    const drag = (event) => {
      const movements = getMovements(event, props.canvasRef.current, props.scale);
      if (target === TARGET.C1) {
        setC1([movements[0], movements[1]]);
        c1Ref.current = [movements[0], movements[1]];
      } else if (target === TARGET.C2) {
        setC2([movements[0], movements[1]]);
        c2Ref.current = [movements[0], movements[1]];
      }
    }

    // register position-updating on mousemove
    window.addEventListener("mousemove", drag);

    const dropdownTarget = () => {
      window.removeEventListener("mousemove", drag);
      window.removeEventListener("mouseup", dropdownTarget);
      props.update(c1Ref.current.concat(c2Ref.current));
    }

    // stop tracking mousemove
    window.addEventListener("mouseup", dropdownTarget);
  }

  return <g className="annotate">
    <line
      x1={c1[0]}
      y1={c1[1]}
      x2={c2[0]}
      y2={c2[1]}
      strokeWidth={defaultLineWidth / props.scale}
    />
    <circle
      className="inner-dot"
      cx={c1[0]}
      cy={c1[1]}
      r={defaultRadius / props.scale}
      strokeWidth={defaultStrokeWidth / props.scale}
    />

    <circle
      className="inner-dot"
      cx={c2[0]}
      cy={c2[1]}
      r={defaultRadius / props.scale}
      strokeWidth={defaultStrokeWidth / props.scale}
    />
    <circle
      className="outer-dot"
      onMouseDown={(e) => pickupCircle(e, TARGET.C1)}
      r={defaultOuterRadius / props.scale}
      cx={c1[0]}
      cy={c1[1]}
    />
    <circle
      className="outer-dot"
      onMouseDown={(e) => pickupCircle(e, TARGET.C2)}
      r={defaultOuterRadius / props.scale}
      cx={c2[0]}
      cy={c2[1]}
    />
  </g>
}
