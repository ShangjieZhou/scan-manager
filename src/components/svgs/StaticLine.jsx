import { useMemo } from "react"

export default function StaticLine(props) {
  const coords = useMemo(() => {
    return props.coords.split(",").map(s => parseInt(s))
  }, [])

  const strokeWidth = 3 * props.factor;
  const radius = 3 * props.factor;

  return <g className="annotate">
    <line
      x1={coords[0]}
      y1={coords[1]}
      x2={coords[2]}
      y2={coords[3]}
      strokeWidth={strokeWidth}
    />
    <circle
      className="inner-dot"
      cx={coords[0]}
      cy={coords[1]}
      r={radius}
      strokeWidth={strokeWidth}
    />

    <circle
      className="inner-dot"
      cx={coords[2]}
      cy={coords[3]}
      r={radius}
      strokeWidth={strokeWidth}
    />
  </g>
}