export const STEP_STATUS = {
    DONE: "done",
    IN_PROGRESS: "in-progress",
    COMING_UP: "coming-up",
}

export const ANNOTATION = {
    SINGLE_LINE: 0,
    DOUBLE_LINES: 1,
    DOUBLE_CIRCLES: 2,
    DOT: 3,
}

export const IMAGETYPE = {
    AP: 0,
    LST: 1,
    LSE: 2,
}

export function resizeCoords(step, ratio) {
    switch (step.type) {
        case ANNOTATION.DOUBLE_LINES:
            const line1 = step.annotation.line1;
            const line2 = step.annotation.line2;
            return {
                line1: [
                    { x: line1[0].x * ratio, y: line1[0].y * ratio },
                    { x: line1[1].x * ratio, y: line1[1].y * ratio },
                ],
                line2: [
                    { x: line2[0].x * ratio, y: line2[0].y * ratio },
                    { x: line2[1].x * ratio, y: line2[1].y * ratio },
                ]
            }
        case ANNOTATION.SINGLE_LINE:
            const line = step.annotation.line1;
            return {
                line1: [
                    { x: line[0].x * ratio, y: line[0].y * ratio },
                    { x: line[1].x * ratio, y: line[1].y * ratio },
                ]
            }
        case ANNOTATION.DOT:
            return {
                x: step.annotation.x * ratio,
                y: step.annotation.y * ratio
            }
        case ANNOTATION.DOUBLE_CIRCLES:
            const c1 = step.annotation.circle1;
            const c2 = step.annotation.circle2;
            return {
                circle1: { x: c1.x * ratio, y: c1.y * ratio, radius: c1.radius * ratio },
                circle2: { x: c2.x * ratio, y: c2.y * ratio, radius: c2.radius * ratio }
            }
        default:
            break;
    }
}

export function extractSingleLine(annotation) {
    const line = annotation.line1;
    return [line[0].x, line[0].y, line[1].x, line[1].y].join(",");
}

export function extractDoubleLines(annotation) {
    const line1 = annotation.line1;
    const line2 = annotation.line2;
    return [
        line1[0].x, line1[0].y, line1[1].x, line1[1].y,
        line2[0].x, line2[0].y, line2[1].x, line2[1].y,
    ].join(",");
}

export function extractDoubleCircles(annotation) {
    const c1 = annotation.circle1;
    const c2 = annotation.circle2;
    return {
        c1: [c1.x, c1.y].join(","),
        r1: c1.radius,
        c2: [c2.x, c2.y].join(","),
        r2: c2.radius
    }
}

export function extractDot(annotation) {
    return [annotation.x, annotation.y].join(",");
}

export const steps = [
    {
        type: ANNOTATION.DOUBLE_LINES,
        imageType: IMAGETYPE.AP,
    },
    {
        type: ANNOTATION.SINGLE_LINE,
        imageType: IMAGETYPE.LST,
    },
    {
        type: ANNOTATION.SINGLE_LINE,
        imageType: IMAGETYPE.LST,
    },
    {
        type: ANNOTATION.SINGLE_LINE,
        imageType: IMAGETYPE.LST,
    },
    {
        type: ANNOTATION.DOT,
        imageType: IMAGETYPE.LST,
    },
    {
        type: ANNOTATION.DOUBLE_CIRCLES,
        imageType: IMAGETYPE.LST,
        annotation: {
            circle1: { x: 30, y: 130, radius: 18 },
            circle2: { x: 50, y: 50, radius: 18 }
        }
    },
    {
        type: ANNOTATION.SINGLE_LINE,
        imageType: IMAGETYPE.LSE,
    },
    {
        type: ANNOTATION.SINGLE_LINE,
        imageType: IMAGETYPE.LSE,
    },
];

export const stepNames = [
    "Cortical Index",
    "S1 Endplate",
    "L1 Superior Endplate",
    "ASIS",
    "Public Symphysis",
    "Femoral Head Centre",
    "S1 Endplate",
    "L1 Superior Endplate",
]

// export const images = [
//     {
//         src: "",
//         localWidth: 0,
//         localHeight: 0,
//         naturalWidth: 0,
//         naturalHeight: 0
//     },
//     {
//         src: "",
//         localWidth: 0,
//         localHeight: 0,
//         naturalWidth: 0,
//         naturalHeight: 0
//     },
//     {
//         src: "",
//         localWidth: 0,
//         localHeight: 0,
//         naturalWidth: 0,
//         naturalHeight: 0
//     }
// ]
