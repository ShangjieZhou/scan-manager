import { useMemo } from "react"

export default function StaticDoubleCircles(props) {

  console.log(props.c1)
  const coords = useMemo(() => {
    const c1 = props.c1.split(",").map(s => parseInt(s));
    const c2 = props.c2.split(",").map(s => parseInt(s));
    return {
      c1: c1,
      c2: c2,
    }
  }, [])

  const strokeWidth = 2 * props.factor;
  const radius = 3 * props.factor;
  const dashedArray = `${4 * props.factor} ${2 * props.factor}`

  return <g className="annotate">
    <circle
      className="ring"
      cx={coords.c1[0]}
      cy={coords.c1[1]}
      r={coords.c1[2]}
      strokeWidth={strokeWidth}
      strokeDasharray={dashedArray}
    />
    <circle
      className="middle-dot"
      cx={(coords.c1[0] + coords.c2[0]) / 2}
      cy={(coords.c1[1] + coords.c2[1]) / 2}
      r={radius}
      strokeWidth={strokeWidth}
    />
    <circle
      className="ring"
      cx={coords.c2[0]}
      cy={coords.c2[1]}
      r={coords.c2[2]}
      strokeWidth={strokeWidth}
      strokeDasharray={dashedArray}
    />
  </g>
}