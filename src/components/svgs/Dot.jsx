import { useRef, useState } from "react";
import { getMovements } from "../../helpers";

const defaultStrokeWidth = 2;
const defaultRadius = 5;
const defaultOuterRadius = 12;

export function Dot(props) {
  const [x, setX] = useState(props.x);
  const [y, setY] = useState(props.y);
  const dotRef = useRef([props.x, props.y]);

  const pickUpDot = (e) => {
    // prevent triggering upper level events such as panning
    e.stopPropagation();

    const drag = (event) => {
      const movements = getMovements(event, props.canvasRef.current, props.scale);
      setX(movements[0]);
      setY(movements[1]);
      dotRef.current = [movements[0], movements[1]];
    }

    // register position-updating on mousemove
    window.addEventListener("mousemove", drag);

    const dropdownTarget = () => {
      window.removeEventListener("mousemove", drag);
      window.removeEventListener("mouseup", dropdownTarget);
      props.update([...dotRef.current]);
    }

    // stop tracking mousemove
    window.addEventListener("mouseup", dropdownTarget);
  }

  return <g className="annotate">
    <circle
      className="inner-dot"
      cx={x}
      cy={y}
      r={defaultRadius / props.scale}
      strokeWidth={defaultStrokeWidth / props.scale}
    />
    <circle
      className="outer-dot"
      onMouseDown={pickUpDot}
      r={defaultOuterRadius / props.scale}
      cx={x}
      cy={y}
    />
  </g>
}
