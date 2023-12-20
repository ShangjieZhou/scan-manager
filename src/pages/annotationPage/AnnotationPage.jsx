import "./AnnotationPage.scss";
import { IoMdRefresh } from 'react-icons/io';
import { AnnotationStep } from "../../components/annotationStep/AnnotationStep";
import { useState, Fragment, useRef, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import { steps, ANNOTATION, STEP_STATUS, stepNames, IMAGETYPE } from "../../assets/stepsData.js";
import styled, { css } from 'styled-components';
import PageWrapper from "../pageWrapper/PageWrapper";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchImage, make_request, getImageOriginalDimensions } from "../../helpers";
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';

// annotation options
import { AnnotateDoubleLines } from "../../components/annotateDoubleLines/AnnotateDoubleLines";
import { AnnotateSingleLine } from "../../components/annotateSingleLine/AnnotateSingleLine";
import { AnnotateDoubleCircles } from "../../components/annotateDoubleCircles/AnnotateDoubleCircles";
import { AnnotateDot } from "../../components/annotateDot/AnnotateDot";
import { useLayoutEffect } from "react";

const defaultLandmarks = {
    "cortical_coords": "50,50,100,50,25,25,100,25",
    "ci_l": 50.0,
    "ci_r": 50.0,
    "st_s1_coords": "100,50,150,100",
    "st_l1_coords": "100,50,150,100",
    "st_asis_coords": "100,50,150,100",
    "st_ps_coord": "100,50",
    "st_headcenter_coord": "100,50",
    "st_h1_coord": "100,50",
    "st_h1_radius": 10.0,
    "st_h2_coord": "130,70",
    "st_h2_radius": 15.0,
    "se_s1_coords": "100,50,150,100",
    "se_l1_coords": "100,50,150,100"
}

const AnnotationBackground =
    styled.div.attrs(props => ({
        style: {
            transform: `scale(${props.scale})`,
            top: props.top + "px",
            left: props.left + "px",
            width: props.width,
            height: props.height
        },
    }))`
    background-color: white;
    position: relative;
    display: flex;
`

const Annotation = styled.div`
    position: relative;
    overflow: hidden;
    width: 50%;
    display: flex;
    background-color: #454545;
    align-items: center;
    justify-content: center;
    cursor: grab;
    cursor: -webkit-grab;

    ${props => props.panning === true && css`
        cursor:  grabbing;
        cursor: -webkit-grabbing;
    `}
`

export function AnnotationPage() {
    // global variables
    const [stepsData, setStepsData] = useState(null);
    const [imagesData, setImagesData] = useState(null);

    const [loading, setLoading] = useState(true);
    const defaultStepsDataRef = useRef(null);

    // url related
    const { caseId } = useParams();
    const navigator = useNavigate();
    const [searchParams] = useSearchParams();
    const startingStep = searchParams.get('startingStep'); // "testCode"

    // set the starting step index
    const [stepIndex, setStepIndex] = useState(startingStep ? parseInt(startingStep) : 0);

    console.log(stepIndex);

    // annotate canvas related
    const [scaleFactor, setScaleFactor] = useState(1);
    const [dimensions, setDimensions] = useState([0, 0]);
    const annotateSection = useRef(null);
    const annotateClip = useRef(null);

    // scaling and panning
    const [offsets, setOffsets] = useState([0, 0]);
    const [panning, setPanning] = useState(false);

    useEffect(() => {
        if (imagesData && stepsData) {
            const currStep = stepsData[stepIndex];
            const index = currStep.imageType === IMAGETYPE.AP ? 0 : (currStep.imageType === IMAGETYPE.LST ? 1 : 2);
            setDimensions([imagesData[index].localWidth, imagesData[index].localHeight]);
            setScaleFactor(1);
            setOffsets([0, 0]);
        }
    }, [imagesData, stepIndex])

    useLayoutEffect(() => {
        fetchAnnotateData();
    }, [])

    const getImageLocalDimensions = (naturalWidth, naturalHeight) => {
        const container = annotateSection.current.getBoundingClientRect();
        if (container.height / container.width < naturalHeight / naturalWidth) {
            return [container.height * (naturalWidth / naturalHeight), container.height];
        } else {
            return [container.width, container.width * (naturalHeight / naturalWidth)];
        }
    }

    const fetchAnnotateData = async () => {
        const data = await make_request('/api/case/' + caseId, 'GET');

        console.log(data)

        // get xray_ap image
        const ap = await fetchImage(data.imagingdata.xray_ap);
        const apNatural = await getImageOriginalDimensions(ap);
        const apLocal = getImageLocalDimensions(apNatural[0], apNatural[1]);

        // get xray_lst image
        const lst = await fetchImage(data.imagingdata.xray_lst);
        const lstNatural = await getImageOriginalDimensions(lst);
        const lstLocal = getImageLocalDimensions(lstNatural[0], lstNatural[1]);

        // get xray_lse image
        const lse = await fetchImage(data.imagingdata.xray_lse);
        const lseNatural = await getImageOriginalDimensions(lse);
        const lseLocal = getImageLocalDimensions(lseNatural[0], lseNatural[1]);

        // init imagesData
        const newImagesData = Array(3);
        newImagesData[0] = { src: ap, localWidth: apLocal[0], localHeight: apLocal[1], naturalWidth: apNatural[0], naturalHeight: apNatural[1] };
        newImagesData[1] = { src: lst, localWidth: lstLocal[0], localHeight: lstLocal[1], naturalWidth: lstNatural[0], naturalHeight: lstNatural[1] };
        newImagesData[2] = { src: lse, localWidth: lseLocal[0], localHeight: lseLocal[1], naturalWidth: lseNatural[0], naturalHeight: lseNatural[1] };

        // init stepsData
        let landMarks;
        if (data.case_status === '') { // freshly created case
            landMarks = initStepsData(data.defaultlandmarks)
        }
        landMarks = initStepsData(data.landmarkselections ? data.landmarkselections : data.defaultlandmarks);
        scaleCoords(false, landMarks, newImagesData)

        // memorize default annotation for step-reset purpose
        defaultStepsDataRef.current = JSON.parse(JSON.stringify(landMarks));

        setStepsData(landMarks);
        setImagesData(newImagesData);
        console.log(newImagesData)
        setLoading(false);
    }

    const putAnnotateData = async () => {
        scaleCoords(true, stepsData, imagesData);
        const payload = {
            cortical_coords: stepsData[0].data.join(","),
            st_s1_coords: stepsData[1].data.join(","),
            st_l1_coords: stepsData[2].data.join(","),
            st_asis_coords: stepsData[3].data.join(","),
            st_ps_coord: stepsData[4].data.join(","),
            st_h1_coord: stepsData[5].data.slice(0, 2).join(","),
            st_h1_radius: stepsData[5].data[2],
            st_h2_coord: stepsData[5].data.slice(3, 5).join(","),
            st_h2_radius: stepsData[5].data[5],
            se_s1_coords: stepsData[6].data.join(","),
            se_l1_coords: stepsData[7].data.join(","),
        }
        setLoading(true);
        const res = await make_request(`/api/case/${caseId}/landmark-selections`, 'PUT', payload);
        setLoading(false);
        navigator('/dashboard/' + caseId);
    }

    const scaleCoords = (up, steps, imagesData) => {
        const convertWithRatio = (s, ratio) => s.data.map(c => Math.round(c * ratio));
        for (let step of steps) {
            const index = step.imageType === IMAGETYPE.AP ? 0 : (step.imageType === IMAGETYPE.LST ? 1 : 2);
            step.data = convertWithRatio(step, up
                ? imagesData[index].naturalWidth / imagesData[index].localWidth
                : imagesData[index].localWidth / imagesData[index].naturalWidth
            );
        }
    }

    const initStepsData = (landmarks) => {
        // const newStepsData = [...stepsData];
        const newStepsData = steps;

        // generate unique ID for each step
        for (const s of newStepsData) {
            s.id = uuid();
        }

        const parseCoords = (str) => str.split(',').map(s => parseInt(s));

        // ap
        newStepsData[0].data = parseCoords(landmarks.cortical_coords);
        // lst
        newStepsData[1].data = parseCoords(landmarks.st_s1_coords);
        newStepsData[2].data = parseCoords(landmarks.st_l1_coords);
        newStepsData[3].data = parseCoords(landmarks.st_asis_coords);
        newStepsData[4].data = parseCoords(landmarks.st_ps_coord);
        newStepsData[5].data = [...parseCoords(landmarks.st_h1_coord), landmarks.st_h1_radius, ...parseCoords(landmarks.st_h2_coord), landmarks.st_h2_radius];
        // lse
        newStepsData[6].data = parseCoords(landmarks.se_s1_coords);
        newStepsData[7].data = parseCoords(landmarks.se_l1_coords);
        return newStepsData;
    }

    const nextStep = () => {
        if (stepIndex >= stepsData.length - 1) {
            putAnnotateData();
        } else {
            setStepIndex(stepIndex + 1);
        }
    }

    const resetAnnotation = () => {
        const currStepDefault = [...stepsData];
        const defaultClone = JSON.parse(JSON.stringify(defaultStepsDataRef.current));
        currStepDefault[stepIndex] = defaultClone[stepIndex];
        currStepDefault[stepIndex].id = uuid();
        setStepsData(currStepDefault);
    }

    const gotoStep = (stepToGo) => {
        if (stepToGo < stepIndex) {
            setStepIndex(stepToGo);
        }
    }

    const renderSteps = () => {
        return <Fragment>
            {stepNames.map((step, index) => {
                let status = STEP_STATUS.DONE;
                if (index >= stepIndex) {
                    status = index === stepIndex ? STEP_STATUS.IN_PROGRESS : STEP_STATUS.COMING_UP;
                }
                return <AnnotationStep onClick={() => gotoStep(index)} key={index} status={status}>
                    {step}
                </AnnotationStep>
            })}
        </Fragment>
    }

    const renderAnnotation = () => {
        const data = stepsData[stepIndex];

        // callback to be called within each different annotation
        const confirm = (newAnnotation) => {
            stepsData[stepIndex].data = newAnnotation;
        }

        const stepId = data.id ? data.id : stepIndex;

        // const dimensions = [getCurrBackgroundImage().localWidth, getCurrBackgroundImage().localHeight];
        switch (data.type) {
            case ANNOTATION.SINGLE_LINE:
                return <AnnotateSingleLine
                    confirmCallback={confirm}
                    key={stepId}
                    dimensions={dimensions}
                    calcZoom={getZoomFactor}
                    coords={data.data}
                />
            case ANNOTATION.DOUBLE_LINES:
                return <AnnotateDoubleLines
                    confirmCallback={confirm}
                    key={stepId}
                    dimensions={dimensions}
                    calcZoom={getZoomFactor}
                    coords={data.data}
                />
            case ANNOTATION.DOUBLE_CIRCLES:
                return <AnnotateDoubleCircles
                    confirmCallback={confirm}
                    key={stepId}
                    dimensions={dimensions}
                    calcZoom={getZoomFactor}
                    c1={data.data.slice(0, 3)}
                    c2={data.data.slice(3, 6)}
                />
            case ANNOTATION.DOT:
                return <AnnotateDot
                    confirmCallback={confirm}
                    key={stepId}
                    dimensions={dimensions}
                    calcZoom={getZoomFactor}
                    dot={data.data}
                />
            default:
                break;
        }
    }

    const zoomImage = (event) => {
        const factor = getZoomFactor(event);
        setOffsets(calcFinalOffsets(0, 0, factor));
        setScaleFactor(factor);
    }

    const getZoomFactor = (event) => {
        const change = event.deltaY * 0.001;
        return Math.min(Math.max(scaleFactor - change, 1), 5);
    }

    const calcFinalOffsets = (movementX, movementY, zoomFactor = scaleFactor) => {
        const xLimit = (zoomFactor - 1) * dimensions[0] / 2;
        const yLimit = (zoomFactor - 1) * dimensions[1] / 2;
        const finalX = Math.max(xLimit * -1, Math.min(xLimit, offsets[0] + movementX));
        const finalY = Math.max(yLimit * -1, Math.min(yLimit, offsets[1] + movementY));
        return [finalX, finalY];
    }

    const pan = (event) => {
        const magnifier = 2;
        const calc = calcFinalOffsets(event.movementX * magnifier, event.movementY * magnifier);
        if (panning) {
            setOffsets(calc);
        }
    }

    const getCurrBackgroundImage = () => {
        const currStep = stepsData[stepIndex];
        const index = currStep.imageType === IMAGETYPE.AP ? 0 : (currStep.imageType === IMAGETYPE.LST ? 1 : 2);
        return imagesData[index]
    }

    return (
        <PageWrapper>
            <div id="annotation-page">
                <div id="annotation-steps">
                    <ul>
                        {renderSteps()}
                    </ul>
                    <div id="annotation-step-actions">
                        <IoMdRefresh id="annotation-reset" onClick={resetAnnotation} />
                        <Button variant="contained" onClick={nextStep}>Confirm</Button>
                    </div>
                </div>
                <Annotation
                    onMouseUp={() => setPanning(false)}
                    onMouseDown={() => setPanning(true)}
                    onMouseMove={pan}
                    ref={annotateSection}
                    panning={panning}
                >
                    {imagesData && stepsData && <AnnotationBackground
                        ref={annotateClip}
                        onWheel={zoomImage}
                        id="annotate-reference"
                        scale={scaleFactor}
                        left={offsets[0]}
                        top={offsets[1]}
                        width={dimensions[0]}
                        height={dimensions[1]}
                    >
                        <img
                            src={getCurrBackgroundImage().src}
                            style={{
                                width: dimensions[0],
                                height: dimensions[1],
                            }}
                        />
                        {renderAnnotation()}
                    </AnnotationBackground>}
                    {loading && <div id="loading-canvas">
                        <CircularProgress />
                    </div>}
                </Annotation>
            </div>
        </PageWrapper>
    )
}