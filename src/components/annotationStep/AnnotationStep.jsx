import "./AnnotationStep.scss";
import { BsDot, BsCheck } from 'react-icons/bs';

export function AnnotationStep(props) {
    return (
        <li onClick={props.onClick} className={props.status}>
            <BsDot className="bsdot"/>
            <BsCheck className="bscheck"/>
            <h1>{props.children}</h1>
        </li>
    )
}