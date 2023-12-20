import { useRef } from "react";
import { useState } from "react";
import { GrAddCircle } from 'react-icons/gr';
import { getMovements } from "../../helpers";

const gap = 10;
const iconSize = 20;
const strokeWidth = 2;
const selectedStrokeWidth = 3;

const TARGET = {
  RING: 0,
  ENLARGEICON: 1,
}

export function Circle(props) {
  const [center, setCenter] = useState(props.circle);
  const [radius, setRadius] = useState(props.radius);
  const [hasDragged, setHasDragged] = useState(false);
  const currRef = useRef({
    radius: radius,
    center: center,
  });


  const pickupTarget = (e, target) => {
    // prevent triggering upper level events such as panning
    e.stopPropagation();
    setHasDragged(false);

    const mousePosition = getMovements(e, props.canvasRef.current, props.scale);
    const xOffset = mousePosition[0] - center[0];
    const yOffset = mousePosition[1] - center[1];

    const drag = (event) => {
      props.drag([currRef.current.center[0], currRef.current.center[1], currRef.current.radius]);
      if (target === TARGET.RING) {
        setHasDragged(true);
        const movements = getMovements(event, props.canvasRef.current, props.scale);
        setCenter([movements[0] - xOffset, movements[1] - yOffset]);
        currRef.current.center = [movements[0] - xOffset, movements[1] - yOffset];
      } else if (target === TARGET.ENLARGEICON) {
        currRef.current.radius = Math.max(2, event.movementX + currRef.current.radius);
        setRadius(currRef.current.radius);
      }
    }

    // register position-updating on mousemove
    window.addEventListener("mousemove", drag);

    const dropdownTarget = () => {
      props.update([...currRef.current.center, currRef.current.radius]);
      // props.rearrange(currRef.current.radius);
      window.removeEventListener("mousemove", drag);
      window.removeEventListener("mouseup", dropdownTarget);
    }

    // stop tracking mousemove
    window.addEventListener("mouseup", dropdownTarget);
  }

  return <g className="annotate" onClick={(e) => e.stopPropagation()}>
    {props.selected && <GrAddCircle
      color="white"
      className="react-icon"
      onMouseDown={(e) => pickupTarget(e, TARGET.ENLARGEICON)}
      size={iconSize}
      x={center[0] + radius + gap}
      y={center[1] - iconSize / 2}
    />}
    <circle
      className={props.selected ? "ring selected" : "ring"}
      cx={center[0]}
      cy={center[1]}
      r={radius}
      strokeWidth={props.selected ? selectedStrokeWidth / props.scale : strokeWidth / props.scale}
      onMouseDown={(e) => pickupTarget(e, TARGET.RING)}
      onClick={(e) => !hasDragged && props.onClick()}
    />
  </g>
}