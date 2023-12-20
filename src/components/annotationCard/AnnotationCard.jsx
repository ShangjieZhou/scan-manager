import { useLayoutEffect, useRef, useState, useEffect } from "react"
import styled, { css } from 'styled-components';
import { ANNOTATION } from "../../assets/stepsData";
import StaticLine from "../svgs/StaticLine";
import StaticDoubleLines from "../svgs/StaticDoubleLines";
import StaticDoubleCircles from "../svgs/StaticCircle";
import StaticDot from "../svgs/StaticDot";
import { CircularProgress } from "@mui/material";

const Svg = styled.svg`
  position: absolute;
  ${props => props.width && css`
    width: ${props.width}px;
  `};
  ${props => props.height && css`
    height: ${props.height}px;
  `};
`

export default function AnnotationCard(props) {
  const image = useRef(null);
  const [viewbox, setViewbox] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [scaleFactor, setScaleFactor] = useState(1);

  // make svg same width/height as image
  useLayoutEffect(() => {
    setWidth(image.current.offsetWidth);
    setHeight(image.current.offsetHeight);
  })

  // set viewbox according to natural width & height of image when image has been fetched
  useEffect(() => {
    if (props.src && props.src !== "") {
      var img = new Image();
      img.src = props.src;
      img.onload = () => {
        setViewbox(`0 0 ${img.width} ${img.height}`);
        setScaleFactor(img.width / image.current.offsetWidth);
      }
    }
  }, [props.src])

  const generateAnnotations = () => {
    if (props.landmarks) {
      return props.landmarks.map((l, i) => {
        switch (l.type) {
          case ANNOTATION.SINGLE_LINE:
            return <StaticLine
              key={i}
              coords={l.data}
              factor={scaleFactor}
            />
          case ANNOTATION.DOUBLE_LINES:
            return <StaticDoubleLines
              key={i}
              coords={l.data}
              factor={scaleFactor}
            />
          case ANNOTATION.DOUBLE_CIRCLES:
            return <StaticDoubleCircles
              key={i}
              c1={l.data[0] + ',' + l.data[1]}
              c2={l.data[2] + ',' + l.data[3]}
              factor={scaleFactor}
            />
          case ANNOTATION.DOT:
            return <StaticDot
              key={i}
              coords={l.data}
              factor={scaleFactor}
            />
          default:
            break;
        }
      });
    }
  }

  return <div onClick={props.onClick} className="gallery-card">
    <h2 className="title">{props.title}</h2>
    <div className="image">
      <img ref={image} src={props.src} alt="" />
      {viewbox ? <Svg width={width} height={height} viewBox={viewbox}>
        {generateAnnotations()}
      </Svg> : <CircularProgress sx={{ position: "absolute", zIndex: 1 }} />}
    </div>
  </div>
}