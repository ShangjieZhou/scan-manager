import { useRef, useState } from "react";
import { Svg } from "../../styled-components/Svg";
import { Line } from "../svgs/Line";

export function AnnotateSingleLine(props) {
    const drawboard = useRef(null);
    const [scaleFactor, setScaleFactor] = useState(1);

    const changeZoom = (event) => {
        const zoomResult = props.calcZoom(event);
        setScaleFactor(zoomResult);
    }

    return (
        <Svg
            onWheel={changeZoom}
            ref={drawboard}
            viewBox={`0 0 ${props.dimensions[0]} ${props.dimensions[1]}`}
        >
            <Line
                update={props.confirmCallback}
                c1={[props.coords[0], props.coords[1]]}
                c2={[props.coords[2], props.coords[3]]}
                scale={scaleFactor}
                canvasRef={drawboard}
            />
        </Svg>
    )
}