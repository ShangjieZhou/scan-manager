import { useMemo } from "react"

export default function StaticDoubleLines(props) {
  const coords = useMemo(() => {
    console.log(props.coords)
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
    <line
      x1={coords[4]}
      y1={coords[5]}
      x2={coords[6]}
      y2={coords[7]}
      strokeWidth={strokeWidth}
    />
    <circle
      className="inner-dot"
      cx={coords[4]}
      cy={coords[5]}
      r={radius}
      strokeWidth={strokeWidth}
    />
    <circle
      className="inner-dot"
      cx={coords[6]}
      cy={coords[7]}
      r={radius}
      strokeWidth={strokeWidth}
    />
  </g>
}