export default function StaticDot(props) {
  const toCoords = () => props.coords.split(",").map(s => parseInt(s));

  const strokeWidth = 3 * props.factor;
  const radius = 6 * props.factor;

  return <g className="annotate">
    <circle
      className="inner-dot"
      cx={toCoords()[0]}
      cy={toCoords()[1]}
      r={radius}
      strokeWidth={strokeWidth}
    />
  </g>
}